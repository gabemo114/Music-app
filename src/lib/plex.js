const PLEX_SERVER = import.meta.env.VITE_PLEX_SERVER
const PLEX_TOKEN = import.meta.env.VITE_PLEX_TOKEN
const MUSIC_SECTION = '8'
const PAGE_SIZE = 500

export function plexHeaders() {
  return {
    'Accept': 'application/json',
    'X-Plex-Token': PLEX_TOKEN,
  }
}

export function plexUrl(path, params = {}) {
  const url = new URL(`${PLEX_SERVER}${path}`)
  url.searchParams.set('X-Plex-Token', PLEX_TOKEN)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}

export function albumArtUrl(thumb, size = 300) {
  if (!thumb) return null
  return plexUrl(thumb, { width: size, height: size, minSize: 1, upscale: 1, format: 'jpg' })
}

export function artistArtUrl(art) {
  if (!art) return null
  return plexUrl(art, { width: 800, height: 450, minSize: 1, upscale: 1, format: 'jpg' })
}

export function streamUrl(partKey) {
  return plexUrl(partKey)
}

function guessDecade(year) {
  if (!year) return null
  const y = parseInt(year)
  const decade = Math.floor(y / 10) * 10
  return `${decade}s`
}

function mapBlurColors(blur) {
  if (!blur) return null
  return {
    topLeft: `#${blur.topLeft}`,
    topRight: `#${blur.topRight}`,
    bottomLeft: `#${blur.bottomLeft}`,
    bottomRight: `#${blur.bottomRight}`,
  }
}

function mapTrack(t, albumMap = {}, artistMap = {}) {
  const part = t.Media?.[0]?.Part?.[0]
  const year = t.parentYear || t.year || null
  const albumData = albumMap[t.parentRatingKey] || {}
  const artistData = artistMap[t.grandparentRatingKey] || {}
  return {
    id: `plex-${t.ratingKey}`,
    plexKey: t.ratingKey,
    grandparentKey: t.grandparentRatingKey,
    title: t.title,
    artist: t.grandparentTitle !== 'V.A.' ? t.grandparentTitle : null,
    album: t.parentTitle,
    year,
    decade: guessDecade(year),
    genre: t.Genre?.[0]?.tag || artistData.genre || null,
    duration: t.duration ? Math.round(t.duration / 1000) : null,
    track: t.index,
    thumb: t.parentThumb || t.thumb || null,
    artistThumb: t.grandparentThumb || artistData.thumb || null,
    artistArt: t.art || t.grandparentArt || artistData.art || null,
    artistSummary: artistData.summary || null,
    artistCountry: artistData.country || null,
    artistBlurColors: artistData.blurColors || null,
    ratingCount: t.ratingCount || 0,
    blurColors: albumData.blurColors || mapBlurColors(t.UltraBlurColors),
    releaseDate: albumData.releaseDate || null,
    streamKey: part?.key || null,
    billboard_peak: null,
    billboard_peak_date: null,
  }
}

async function fetchAllArtists() {
  const artistMap = {}
  let start = 0
  while (true) {
    const res = await fetch(
      plexUrl(`/library/sections/${MUSIC_SECTION}/all`, {
        type: 8,
        'X-Plex-Container-Start': start,
        'X-Plex-Container-Size': PAGE_SIZE,
      }),
      { headers: plexHeaders() }
    )
    const data = await res.json()
    const artists = data.MediaContainer?.Metadata || []
    if (artists.length === 0) break
    for (const a of artists) {
      artistMap[a.ratingKey] = {
        name: a.title,
        summary: a.summary || null,
        country: a.Country?.[0]?.tag || null,
        genre: a.Genre?.[0]?.tag || null,
        thumb: a.thumb || null,
        art: a.art || null,
        blurColors: mapBlurColors(a.UltraBlurColors),
      }
    }
    if (artists.length < PAGE_SIZE) break
    start += PAGE_SIZE
  }
  return artistMap
}

async function fetchAllAlbums() {
  const albumMap = {}
  let start = 0
  while (true) {
    const res = await fetch(
      plexUrl(`/library/sections/${MUSIC_SECTION}/all`, {
        type: 9,
        'X-Plex-Container-Start': start,
        'X-Plex-Container-Size': PAGE_SIZE,
      }),
      { headers: plexHeaders() }
    )
    const data = await res.json()
    const albums = data.MediaContainer?.Metadata || []
    if (albums.length === 0) break
    for (const a of albums) {
      albumMap[a.ratingKey] = {
        blurColors: mapBlurColors(a.UltraBlurColors),
        releaseDate: a.originallyAvailableAt || null,
      }
    }
    if (albums.length < PAGE_SIZE) break
    start += PAGE_SIZE
  }
  return albumMap
}

export async function fetchAllTracks(onProgress) {
  // Fetch albums, artists, and track count in parallel
  const [albumMap, artistMap, countData] = await Promise.all([
    fetchAllAlbums(),
    fetchAllArtists(),
    fetch(
      plexUrl(`/library/sections/${MUSIC_SECTION}/all`, { type: 10, 'X-Plex-Container-Size': 0 }),
      { headers: plexHeaders() }
    ).then(r => r.json()),
  ])

  const mc0 = countData.MediaContainer
  const total = mc0.totalSize ?? mc0.size ?? 0

  if (!total) {
    // totalSize not available with Container-Size=0 on some Plex versions — fetch first page to get size
    const firstRes = await fetch(
      plexUrl(`/library/sections/${MUSIC_SECTION}/all`, {
        type: 10,
        'X-Plex-Container-Start': 0,
        'X-Plex-Container-Size': PAGE_SIZE,
      }),
      { headers: plexHeaders() }
    )
    const firstData = await firstRes.json()
    const firstMc = firstData.MediaContainer
    const firstTracks = firstMc.Metadata || []
    const knownTotal = firstMc.totalSize ?? firstMc.size ?? firstTracks.length
    const allTracks = firstTracks.map(t => mapTrack(t, albumMap, artistMap))
    if (onProgress) onProgress(allTracks.length, knownTotal)

    const remainingPages = Math.ceil((knownTotal - PAGE_SIZE) / PAGE_SIZE)
    for (let i = 1; i <= remainingPages; i++) {
      const res = await fetch(
        plexUrl(`/library/sections/${MUSIC_SECTION}/all`, {
          type: 10,
          'X-Plex-Container-Start': i * PAGE_SIZE,
          'X-Plex-Container-Size': PAGE_SIZE,
        }),
        { headers: plexHeaders() }
      )
      const data = await res.json()
      const tracks = data.MediaContainer.Metadata || []
      if (tracks.length === 0) break
      allTracks.push(...tracks.map(t => mapTrack(t, albumMap, artistMap)))
      if (onProgress) onProgress(allTracks.length, knownTotal)
    }
    return allTracks
  }

  const pages = Math.ceil(total / PAGE_SIZE)
  const allTracks = []

  for (let i = 0; i < pages; i++) {
    const res = await fetch(
      plexUrl(`/library/sections/${MUSIC_SECTION}/all`, {
        type: 10,
        'X-Plex-Container-Start': i * PAGE_SIZE,
        'X-Plex-Container-Size': PAGE_SIZE,
      }),
      { headers: plexHeaders() }
    )
    const data = await res.json()
    const tracks = data.MediaContainer.Metadata || []
    if (tracks.length === 0) break
    allTracks.push(...tracks.map(t => mapTrack(t, albumMap, artistMap)))
    if (onProgress) onProgress(allTracks.length, total)
  }

  return allTracks
}

// Fetch rich artist metadata (bio, background art, blur colors) for a single artist
export async function fetchArtistMeta(grandparentRatingKey) {
  if (!grandparentRatingKey) return null
  try {
    const res = await fetch(
      plexUrl(`/library/metadata/${grandparentRatingKey}`),
      { headers: plexHeaders() }
    )
    const data = await res.json()
    const artist = data.MediaContainer?.Metadata?.[0]
    if (!artist) return null
    return {
      summary: artist.summary || null,
      country: artist.Country?.[0]?.tag || null,
      art: artist.art || null,
      thumb: artist.thumb || null,
      blurColors: artist.UltraBlurColors ? {
        topLeft: `#${artist.UltraBlurColors.topLeft}`,
        topRight: `#${artist.UltraBlurColors.topRight}`,
        bottomLeft: `#${artist.UltraBlurColors.bottomLeft}`,
        bottomRight: `#${artist.UltraBlurColors.bottomRight}`,
      } : null,
    }
  } catch {
    return null
  }
}
