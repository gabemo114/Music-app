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

export function albumArtUrl(thumb) {
  if (!thumb) return null
  return plexUrl(thumb, { width: 300, height: 300, minSize: 1, upscale: 1, format: 'jpg' })
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

function mapTrack(t) {
  const part = t.Media?.[0]?.Part?.[0]
  const year = t.parentYear || t.year || null
  return {
    id: `plex-${t.ratingKey}`,
    plexKey: t.ratingKey,
    title: t.title,
    artist: t.grandparentTitle !== 'V.A.' ? t.grandparentTitle : null,
    album: t.parentTitle,
    year,
    decade: guessDecade(year),
    genre: t.Genre?.[0]?.tag || null,
    duration: t.duration ? Math.round(t.duration / 1000) : null,
    track: t.index,
    thumb: t.parentThumb || t.thumb || null,
    streamKey: part?.key || null,
    billboard_peak: null,
    billboard_peak_date: null,
  }
}

export async function fetchAllTracks(onProgress) {
  // First get total count
  const countRes = await fetch(
    plexUrl(`/library/sections/${MUSIC_SECTION}/all`, { type: 10, 'X-Plex-Container-Size': 0 }),
    { headers: plexHeaders() }
  )
  const countData = await countRes.json()
  const total = countData.MediaContainer.totalSize

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
    allTracks.push(...tracks.map(mapTrack))
    if (onProgress) onProgress(Math.min(allTracks.length, total), total)
  }

  return allTracks
}
