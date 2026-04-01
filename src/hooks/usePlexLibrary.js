import { useState, useEffect } from 'react'
import { fetchAllTracks } from '../lib/plex'

const CACHE_KEY = 'plex_library_v3'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { tracks, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return tracks
  } catch {
    return null
  }
}

function saveCache(tracks) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ tracks, timestamp: Date.now() }))
  } catch {}
}

export function usePlexLibrary() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ loaded: 0, total: 0 })
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = loadCache()
    if (cached) {
      setTracks(cached)
      setLoading(false)
      return
    }

    fetchAllTracks((loaded, total) => setProgress({ loaded, total }))
      .then(allTracks => {
        saveCache(allTracks)
        setTracks(allTracks)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function refresh() {
    localStorage.removeItem(CACHE_KEY)
    setLoading(true)
    setError(null)
    fetchAllTracks((loaded, total) => setProgress({ loaded, total }))
      .then(allTracks => {
        saveCache(allTracks)
        setTracks(allTracks)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  return { tracks, loading, progress, error, refresh }
}
