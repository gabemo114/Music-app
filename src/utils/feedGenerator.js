import { TIL_FACTS_BY_ARTIST, FALLBACK_FACTS } from '../data/tilFacts'
import { MOOD_DEFINITIONS } from '../data/moods'

function seededRandom(seed) {
  let s = seed
  return function () {
    s = Math.imul(48271, s) | 0
    return ((s >>> 0) + 0.5) / 0x100000000
  }
}

function shuffle(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dateSeed(date, extra = 0) {
  return (
    date.getFullYear() * 1000000 +
    (date.getMonth() + 1) * 10000 +
    date.getDate() * 100 +
    extra
  )
}

function buildTILCards(libraryArtists, rng) {
  const cards = []
  const artistSet = new Set(libraryArtists.map(a => a.toLowerCase()))

  for (const [artist, facts] of Object.entries(TIL_FACTS_BY_ARTIST)) {
    if (artistSet.has(artist.toLowerCase())) {
      for (const fact of facts) {
        cards.push({ type: 'til', id: fact.id, fact: { ...fact, artist } })
      }
    }
  }

  // Pad with fallbacks if very few matches
  if (cards.length < 3) {
    FALLBACK_FACTS.forEach(f => cards.push({ type: 'til', id: f.id, fact: f }))
  }

  return shuffle(cards, rng)
}

function buildAnniversaryCards(tracks, date, rng) {
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth() + 1
  const cards = []
  const seen = new Set()

  // Group tracks by artist+year to avoid duplicates
  for (const track of tracks) {
    if (!track.year || !track.artist) continue
    const key = `${track.artist}-${track.year}`
    if (seen.has(key)) continue

    const yearsAgo = currentYear - track.year
    if (yearsAgo <= 0) continue

    // Prioritize round anniversaries (5, 10, 20, 25, 30...) or "this year's month" matches
    const isRound = yearsAgo % 5 === 0
    const isMilestone = yearsAgo % 10 === 0

    if (isRound || isMilestone) {
      seen.add(key)
      cards.push({
        type: 'anniversary',
        id: `anniversary-${track.id}`,
        song: track,
        yearsAgo,
        label: isMilestone
          ? `${yearsAgo} Year Anniversary`
          : `${yearsAgo} Years Ago`,
      })
    }
  }

  return shuffle(cards, rng).slice(0, 20)
}

function buildChartTopperCards(tracks, rng) {
  // Tracks with billboard data first, otherwise feature tracks from top artists
  const withBillboard = tracks.filter(t => t.billboard_peak === 1)

  if (withBillboard.length >= 5) {
    return shuffle(withBillboard, rng).slice(0, 10).map(song => ({
      type: 'chart_topper',
      id: `chart-${song.id}`,
      song,
    }))
  }

  // Fall back to one random track per top artist
  const artistCounts = {}
  for (const t of tracks) {
    if (t.artist) artistCounts[t.artist] = (artistCounts[t.artist] || 0) + 1
  }
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([a]) => a)

  const cards = []
  for (const artist of topArtists) {
    const artistTracks = tracks.filter(t => t.artist === artist)
    if (artistTracks.length === 0) continue
    const pick = artistTracks[Math.floor(rng() * artistTracks.length)]
    cards.push({ type: 'chart_topper', id: `featured-${pick.id}`, song: pick, isFeatured: true })
  }
  return shuffle(cards, rng)
}

function buildMoodCards(tracks, rng) {
  const cards = []

  for (const mood of MOOD_DEFINITIONS) {
    const matched = tracks.filter(track => {
      const genreMatch = mood.matchGenres.length === 0 ||
        mood.matchGenres.some(g => track.genre?.toLowerCase().includes(g.toLowerCase()))
      const artistMatch = mood.matchArtists.some(a =>
        track.artist?.toLowerCase().includes(a.toLowerCase())
      )
      const decadeMatch = !mood.requireDecades ||
        mood.requireDecades.includes(track.decade)
      return (genreMatch || artistMatch) && decadeMatch
    })

    if (matched.length >= 3) {
      const shuffled = shuffle(matched, rng)
      const coverTrack = shuffled.find(t => t.thumb) || shuffled[0]
      cards.push({
        type: 'mood',
        id: `mood-${mood.id}`,
        mood: {
          ...mood,
          songIds: shuffled.slice(0, 20).map(t => t.id),
          trackCount: matched.length,
          coverThumb: coverTrack?.thumb || null,
          blurColors: coverTrack?.blurColors || null,
        },
      })
    }
  }

  return shuffle(cards, rng)
}

function cardsToPages(cards) {
  const pages = []
  let i = 0
  let pageNum = 0
  while (i < cards.length) {
    if (pageNum % 2 === 0) {
      pages.push({ layout: 'single', cards: [cards[i]] })
      i++
    } else {
      if (i + 1 < cards.length) {
        pages.push({ layout: 'double', cards: [cards[i], cards[i + 1]] })
        i += 2
      } else {
        pages.push({ layout: 'single', cards: [cards[i]] })
        i++
      }
    }
    pageNum++
  }
  return pages
}

export function generateFeed(tracks, date = new Date()) {
  if (!tracks || tracks.length === 0) return []

  const rng = seededRandom(dateSeed(date))
  const rng2 = seededRandom(dateSeed(date, 42))

  const libraryArtists = [...new Set(tracks.map(t => t.artist).filter(Boolean))]

  const tilCards = buildTILCards(libraryArtists, rng)
  const anniversaryCards = buildAnniversaryCards(tracks, date, rng)
  const chartCards = buildChartTopperCards(tracks, rng)
  const moodCards = buildMoodCards(tracks, rng)

  const allCards = shuffle(
    [...anniversaryCards, ...tilCards, ...chartCards, ...moodCards],
    rng2
  )

  // Second round with different seed for infinite scroll
  const allCards2 = shuffle(
    [...buildAnniversaryCards(tracks, date, rng2), ...buildTILCards(libraryArtists, rng2), ...buildChartTopperCards(tracks, rng2), ...buildMoodCards(tracks, rng2)],
    seededRandom(dateSeed(date, 99))
  )

  return cardsToPages([...allCards, ...allCards2])
}
