import { parseFile } from 'music-metadata'
import { readdir } from 'fs/promises'
import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MUSIC_DIR = path.join(__dirname, '../Music')

async function extractMetadata() {
  const songs = []
  const genres = await readdir(MUSIC_DIR)

  for (const genre of genres.filter(f => !f.startsWith('.'))) {
    const genreDir = path.join(MUSIC_DIR, genre)
    const files = await readdir(genreDir)

    for (const file of files) {
      if (!file.endsWith('.mp3')) continue

      const filePath = path.join(genreDir, file)

      // Parse filename as fallback: "01 - Artist - Title.mp3"
      const nameWithoutExt = file.replace('.mp3', '')
      const parts = nameWithoutExt.split(' - ')
      const trackNum = parseInt(parts[0]) || null
      const fallbackArtist = parts[1] || ''
      const fallbackTitle = parts.slice(2).join(' - ') || ''

      try {
        const metadata = await parseFile(filePath)
        const { common, format } = metadata

        songs.push({
          id: `${genre}-${trackNum}`,
          file: `Music/${genre}/${file}`,
          genre,
          track: common.track?.no || trackNum,
          title: common.title || fallbackTitle,
          artist: common.artist || fallbackArtist,
          album: common.album || null,
          year: common.year || null,
          duration: Math.round(format.duration) || null,
        })
      } catch {
        // fallback to filename parsing
        songs.push({
          id: `${genre}-${trackNum}`,
          file: `Music/${genre}/${file}`,
          genre,
          track: trackNum,
          title: fallbackTitle,
          artist: fallbackArtist,
          album: null,
          year: null,
          duration: null,
        })
      }
    }
  }

  songs.sort((a, b) => (a.track || 0) - (b.track || 0))

  const output = path.join(__dirname, '../src/data/songs.json')
  writeFileSync(output, JSON.stringify(songs, null, 2))
  console.log(`✓ Extracted ${songs.length} songs → src/data/songs.json`)
  songs.forEach(s => console.log(`  [${s.genre}] ${s.track}. ${s.artist} – ${s.title} (${s.year || 'no year'})`))
}

extractMetadata()
