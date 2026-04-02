const GENIUS_TOKEN = import.meta.env.VITE_GENIUS_TOKEN
const TIMEOUT_MS = 5000

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

async function geniusFetch(path, params = {}) {
  const url = new URL(`https://api.genius.com${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await withTimeout(
    fetch(url.toString(), {
      headers: { Authorization: `Bearer ${GENIUS_TOKEN}` },
    }),
    TIMEOUT_MS
  )
  if (!res.ok) throw new Error(`Genius ${res.status}`)
  return res.json()
}

export async function searchGenius(title, artist) {
  try {
    const data = await geniusFetch('/search', { q: `${artist} ${title}` })
    const hits = data?.response?.hits || []
    const match = hits.find(h =>
      h.type === 'song' &&
      h.result.primary_artist.name.toLowerCase().includes(artist.toLowerCase())
    ) || hits[0]
    return match?.result || null
  } catch {
    return null
  }
}

export async function fetchGeniusFact(title, artist) {
  try {
    const song = await searchGenius(title, artist)
    if (!song) return null

    // Fetch full song details for description
    const data = await geniusFetch(song.api_path, { text_format: 'plain' })
    const full = data?.response?.song
    if (!full) return null

    const desc = full.description?.plain
    const fact = desc && desc !== '?' && desc.length > 40
      ? (() => {
          const trimmed = desc.slice(0, 320)
          const lastPeriod = trimmed.lastIndexOf('.')
          return lastPeriod > 80 ? trimmed.slice(0, lastPeriod + 1) : trimmed
        })()
      : null

    if (!fact) return null

    return {
      fact,
      songTitle: song.title,
      songUrl: song.url,
      thumbnailUrl: song.song_art_image_thumbnail_url || null,
      artist: song.primary_artist.name,
    }
  } catch {
    return null
  }
}
