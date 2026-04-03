const BASE = 'https://musicbrainz.org/ws/2'
const HEADERS = { 'User-Agent': 'Epoch/1.0 (personal music app)' }

// Cache in localStorage so we don't hammer the API
const CACHE_KEY = 'mb_new_releases_v1'
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {}
}

async function mbFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('fmt', 'json')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { headers: HEADERS })
  if (!res.ok) throw new Error(`MusicBrainz ${res.status}`)
  return res.json()
}

// Fetch recent releases (last 90 days) for a given artist name
async function getRecentReleasesForArtist(artistName) {
  try {
    // Search for the artist first
    const search = await mbFetch('/artist', { query: `artist:"${artistName}"`, limit: 1 })
    const artist = search?.artists?.[0]
    if (!artist) return []

    const artistId = artist.id
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10)

    const releases = await mbFetch('/release-group', {
      artist: artistId,
      type: 'album|single|ep',
      limit: 5,
    })

    return (releases?.['release-groups'] || [])
      .filter(r => r['first-release-date'] && r['first-release-date'] >= ninetyDaysAgo)
      .map(r => ({
        title: r.title,
        artist: artistName,
        releaseDate: r['first-release-date'],
        type: r['primary-type'] || 'Release',
        mbid: r.id,
      }))
  } catch {
    return []
  }
}

// Fetch new releases for a sample of library artists
export async function fetchNewReleases(libraryArtistNames) {
  const cached = getCached()
  if (cached) return cached

  // Sample up to 20 artists to avoid too many requests
  const sample = [...libraryArtistNames].sort(() => Math.random() - 0.5).slice(0, 20)
  const results = []

  for (const artist of sample) {
    const releases = await getRecentReleasesForArtist(artist)
    results.push(...releases)
    // Be polite to MusicBrainz (1 req/sec rate limit)
    await new Promise(r => setTimeout(r, 1100))
  }

  const sorted = results.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  setCache(sorted)
  return sorted
}
