import songs from '../data/songs.json'
import { TIL_FACTS } from '../data/tilFacts'
import { MOODS } from '../data/moods'

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

function buildCardPool(date) {
  const month = date.getMonth() + 1
  const currentYear = date.getFullYear()
  const rng = seededRandom(dateSeed(date))
  const cards = []

  // Anniversary cards — songs whose chart peak was this month in a past year
  songs.forEach((song) => {
    if (!song.billboard_peak_date) return
    const peakDate = new Date(song.billboard_peak_date + 'T00:00:00')
    if (peakDate.getMonth() + 1 === month) {
      const yearsAgo = currentYear - peakDate.getFullYear()
      if (yearsAgo > 0) {
        cards.push({
          type: 'anniversary',
          id: `anniversary-${song.id}`,
          song,
          yearsAgo,
          label:
            yearsAgo === 1
              ? '1 Year Ago This Month'
              : `${yearsAgo} Years Ago This Month`,
        })
      }
    }
  })

  // Chart topper cards — songs that peaked at #1
  shuffle(
    songs.filter((s) => s.billboard_peak === 1),
    rng
  ).forEach((song) => {
    cards.push({ type: 'chart_topper', id: `chart-${song.id}`, song })
  })

  // TIL cards
  shuffle(TIL_FACTS, rng).forEach((fact) => {
    cards.push({ type: 'til', id: fact.id, fact })
  })

  // Mood cards
  shuffle(MOODS, rng).forEach((mood) => {
    cards.push({ type: 'mood', id: `mood-${mood.id}`, mood })
  })

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

export function generateFeed(date = new Date()) {
  // Build two rounds of the card pool (different seeds) for a longer infinite feed
  const pool1 = buildCardPool(date)
  const pool2 = shuffle(
    buildCardPool(date),
    seededRandom(dateSeed(date, 42))
  )
  return cardsToPages([...pool1, ...pool2])
}
