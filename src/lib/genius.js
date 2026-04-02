const GENIUS_TOKEN = import.meta.env.VITE_GENIUS_TOKEN

// Genius API calls must go through a proxy because the API doesn't support CORS.
// We use the public allorigins proxy for client-side requests.
function geniusUrl(path, params = {}) {
  const url = new URL(`https://api.genius.com${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return `https://api.allorigins.win/get?url=${encodeURIComponent(url.toString())}`
}

function geniusHeaders() {
  return { Authorization: `Bearer ${GENIUS_TOKEN}` }
}

// Search for a song on Genius, return the first match
export async function searchGenius(title, artist) {
  try {
    const q = `${artist} ${title}`
    const res = await fetch(geniusUrl('/search', { q }), { headers: geniusHeaders() })
    const wrapper = await res.json()
    const data = JSON.parse(wrapper.contents)
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

// Fetch song annotations/description from Genius song page
// Returns a short excerpt of the song's description or null
export async function fetchSongDescription(apiPath) {
  try {
    const res = await fetch(geniusUrl(apiPath, { text_format: 'plain' }), { headers: geniusHeaders() })
    const wrapper = await res.json()
    const data = JSON.parse(wrapper.contents)
    const song = data?.response?.song
    if (!song) return null

    const desc = song.description?.plain
    if (desc && desc !== '?' && desc.length > 20) {
      // Return first ~280 chars, end at sentence boundary
      const trimmed = desc.slice(0, 300)
      const lastPeriod = trimmed.lastIndexOf('.')
      return lastPeriod > 80 ? trimmed.slice(0, lastPeriod + 1) : trimmed
    }
    return null
  } catch {
    return null
  }
}

// Main entry point — returns { fact, songUrl, thumbnailUrl } or null
export async function fetchGeniusFact(title, artist) {
  const song = await searchGenius(title, artist)
  if (!song) return null

  const description = await fetchSongDescription(song.api_path)

  return {
    fact: description,
    songTitle: song.title,
    songUrl: song.url,
    thumbnailUrl: song.song_art_image_thumbnail_url || null,
    artist: song.primary_artist.name,
  }
}
