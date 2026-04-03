const LASTFM_KEY = import.meta.env.VITE_LASTFM_KEY
const BASE = 'https://ws.audioscrobbler.com/2.0/'

async function lfmFetch(params) {
  const url = new URL(BASE)
  Object.entries({ ...params, api_key: LASTFM_KEY, format: 'json' }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  )
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Last.fm ${res.status}`)
  return res.json()
}

export async function fetchArtistInfo(artistName) {
  try {
    const data = await lfmFetch({ method: 'artist.getinfo', artist: artistName, autocorrect: 1 })
    const artist = data?.artist
    if (!artist) return null

    const bio = artist.bio?.summary
      ?.replace(/<a[^>]*>.*?<\/a>/gi, '')  // strip Last.fm links
      ?.replace(/<[^>]+>/g, '')            // strip remaining HTML
      ?.trim()

    return {
      name: artist.name,
      bio: bio && bio.length > 40 ? bio : null,
      listeners: artist.stats?.listeners ? parseInt(artist.stats.listeners) : null,
      similar: (artist.similar?.artist || []).slice(0, 5).map(a => a.name),
      tags: (artist.tags?.tag || []).slice(0, 3).map(t => t.name),
      url: artist.url,
    }
  } catch {
    return null
  }
}

export async function fetchSimilarArtists(artistName) {
  try {
    const data = await lfmFetch({ method: 'artist.getsimilar', artist: artistName, limit: 6, autocorrect: 1 })
    return (data?.similarartists?.artist || []).map(a => a.name)
  } catch {
    return []
  }
}
