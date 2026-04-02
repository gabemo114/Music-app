import { TIL_FACTS_BY_ARTIST, FALLBACK_FACTS } from '../data/tilFacts'
import { MOOD_DEFINITIONS } from '../data/moods'

const JOURNAL_PROMPTS = [
  'Where were you the first time you heard this?',
  'What does this song remind you of?',
  'Who introduced you to this artist?',
  'What were you going through when this album came out?',
  "What's the memory that comes to mind instantly?",
  'When do you listen to this most?',
  'What would you tell someone hearing this for the first time?',
  'Has your feeling about this song changed over time?',
]

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
  const currentDay = date.getDate()
  const cards = []
  const seen = new Set()

  for (const track of tracks) {
    if (!track.artist) continue
    const key = `${track.artist}-${track.year || track.releaseDate}`
    if (seen.has(key)) continue

    // On This Day — exact month/day match from releaseDate
    if (track.releaseDate) {
      const [releaseYear, releaseMonth, releaseDay] = track.releaseDate.split('-').map(Number)
      const yearsAgo = currentYear - releaseYear
      if (yearsAgo > 0 && releaseMonth === currentMonth && releaseDay === currentDay) {
        seen.add(key)
        cards.push({
          type: 'anniversary',
          id: `onthisday-${track.id}`,
          song: track,
          yearsAgo,
          label: `On This Day, ${yearsAgo} Year${yearsAgo === 1 ? '' : 's'} Ago`,
          isOnThisDay: true,
        })
        continue
      }
    }

    // Round anniversary fallback (5/10/20... years) using year only
    const year = track.year
    if (!year) continue
    const yearsAgo = currentYear - year
    if (yearsAgo <= 0) continue
    const isRound = yearsAgo % 5 === 0

    if (isRound) {
      seen.add(key)
      cards.push({
        type: 'anniversary',
        id: `anniversary-${track.id}`,
        song: track,
        yearsAgo,
        label: yearsAgo % 10 === 0 ? `${yearsAgo} Year Anniversary` : `${yearsAgo} Years Ago`,
        isOnThisDay: false,
      })
    }
  }

  // On This Day cards always lead
  const onThisDay = cards.filter(c => c.isOnThisDay)
  const roundAnniversaries = shuffle(cards.filter(c => !c.isOnThisDay), rng).slice(0, 20)
  return [...onThisDay, ...roundAnniversaries]
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

function buildArtistCards(tracks, rng) {
  // Group by artist, pick one representative track per artist that has a bio
  const artistMap = {}
  for (const track of tracks) {
    if (!track.artist || !track.artistSummary) continue
    if (!artistMap[track.artist]) {
      artistMap[track.artist] = {
        name: track.artist,
        summary: track.artistSummary,
        country: track.artistCountry,
        genre: track.genre,
        thumb: track.artistThumb,
        art: track.artistArt,
        blurColors: track.artistBlurColors,
      }
    }
    // Prefer the representative track to have art
    if (!artistMap[track.artist]._track || track.thumb) {
      artistMap[track.artist]._track = track
    }
  }
  const cards = Object.values(artistMap)
    .filter(a => a.summary && a._track)
    .map(a => ({
      type: 'artist',
      id: `artist-${a.name}`,
      artist: a,
      representativeTrack: a._track,
    }))
  return shuffle(cards, rng)
}

function buildAlbumOfTheDayCards(tracks, rng) {
  // Group tracks into albums
  const albumMap = {}
  for (const track of tracks) {
    const key = `${track.grandparentKey}-${track.album}`
    if (!albumMap[key]) {
      albumMap[key] = {
        title: track.album || 'Unknown Album',
        artist: track.artist || 'Unknown Artist',
        year: track.year,
        decade: track.decade,
        genre: track.genre,
        thumb: track.thumb,
        blurColors: track.blurColors,
        tracks: [],
      }
    }
    albumMap[key].tracks.push(track)
  }
  const albums = Object.values(albumMap).filter(a => a.tracks.length >= 3 && a.thumb)
  return shuffle(albums, rng).slice(0, 15).map(album => ({
    type: 'album_of_day',
    id: `album-${album.title}-${album.artist}`,
    album,
  }))
}

function buildJournalPromptCards(tracks, rng) {
  // Pick random tracks as journal prompt targets — prefer tracks with blur colors (more visual)
  const candidates = shuffle(tracks.filter(t => t.artist && t.thumb), rng)
  return candidates.slice(0, 10).map((track, i) => ({
    type: 'journal_prompt',
    id: `prompt-${track.id}`,
    song: track,
    prompt: JOURNAL_PROMPTS[i % JOURNAL_PROMPTS.length],
  }))
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

  const rng3 = seededRandom(dateSeed(date, 77))

  const tilCards = buildTILCards(libraryArtists, rng)
  const anniversaryCards = buildAnniversaryCards(tracks, date, rng)
  const chartCards = buildChartTopperCards(tracks, rng)
  const moodCards = buildMoodCards(tracks, rng)
  const artistCards = buildArtistCards(tracks, rng)
  const albumCards = buildAlbumOfTheDayCards(tracks, rng)
  const promptCards = buildJournalPromptCards(tracks, rng)

  // On This Day leads if present, then shuffle the rest
  const onThisDayCards = anniversaryCards.filter(c => c.isOnThisDay)
  const otherCards = shuffle([
    ...anniversaryCards.filter(c => !c.isOnThisDay),
    ...tilCards,
    ...chartCards,
    ...moodCards,
    ...artistCards,
    ...albumCards,
    ...promptCards,
  ], rng2)

  const allCards = [...onThisDayCards, ...otherCards]

  // Second round for infinite scroll
  const allCards2 = shuffle([
    ...buildAnniversaryCards(tracks, date, rng2).filter(c => !c.isOnThisDay),
    ...buildTILCards(libraryArtists, rng2),
    ...buildChartTopperCards(tracks, rng2),
    ...buildMoodCards(tracks, rng2),
    ...buildArtistCards(tracks, rng2),
    ...buildAlbumOfTheDayCards(tracks, rng2),
    ...buildJournalPromptCards(tracks, rng2),
  ], rng3)

  return cardsToPages([...allCards, ...allCards2])
}
