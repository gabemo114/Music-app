# Epoch — Project Brief

> A dark, moody music memory app. Your library. Your story.

## What is Epoch?

Epoch is a personal music app built on top of a user's existing music library (currently via Plex). It transforms a static music collection into a living, editorial experience — combining song education, personal journaling, and social sharing into one product.

**Core thesis:** music is a timestamp. Every song in your library is a coordinate in time. Epoch helps you rediscover forgotten songs, learn what they meant to the people who made them, and record what they meant to you.

**Stack:** VS Code + Claude Code agent, pushed to GitHub
**Current state:** Skeleton / pre-wireframe
**Audience:** Personal tool first, multi-user later

---

## Visual Identity

- **Mood:** Dark and moody — late night, intimate, not bright or cheerful
- **Color:** Near-black / deep charcoal backgrounds. Album art is the only real color on screen
- **Typography:** Serif for emotional content (journal entries, headlines). Sans-serif for utility (tabs, metadata, timestamps)
- **Cards:** Dark frosted glass or semi-transparent surfaces. Album art bleeds into backgrounds with blur + dark overlay
- **Ambient color:** The dominant color of the current album art subtly tints the UI behind it
- **Reference feel:** Editorial, like a music magazine — not a utility app

---

## App Name

**Epoch** — not just a moment in time, a defining one. Each song is a marker. A before and after.

---

## Core Navigation (3 Tabs)

| Tab | Purpose |
|---|---|
| Home | Editorial discovery feed — always something new |
| Library | Your full album grid — browse and explore |
| Memoir | Your journal entries collected — your story over time |

> **Future tab:** Mixtape may become a 4th tab given its distinct purpose

---

## Screen Breakdown

### 1. Home — The Feed
An editorial, scrollable feed of cards about your library. Calm and browsable on open. One card type per session leads based on editorial priority order.

### 2. Library
Your Plex music library rendered as an album art grid. Dense and visual. Albums with journal entries have a subtle visual indicator (glow, dot, or texture overlay). This is a destination you navigate to — not the landing screen.

### 3. Album View
Tap an album → see its tracks listed. Each track shows a subtle indicator if it has a journal entry. Unwritten songs feel like open invitations.

### 4. Song Screen
The heart of Epoch. Three layers stacked vertically:
1. **Player** — play the track
2. **Did You Know** — Genius-powered fact about this specific song
3. **Your Journal Entry** — existing entry or blank prompt to write

### 5. Memoir View
All journal entries collected chronologically. Less library, more autobiography. Your music library as a memoir over time.

### 6. Mixtape View
Curated playlists with per-song annotations. Distinct from the private journal — these are authored for someone else.

---

## Home Feed — Card Types

The feed is editorial and personal. All content is sourced from or related to the user's own library.

### Editorial Priority Order (daily)
1. **On This Day** — leads if there's a relevant anniversary (time-sensitive, earns top slot)
2. **Did You Know** — anchor card, always present
3. **Journal Prompt** — mid-feed after two content cards; asks something of the user
4. **New Release** — closes the feed; bridges past library to present

### All Card Types

| Card | Description | Data Source |
|---|---|---|
| Did You Know | Genius-powered fact about a song in your library | Genius API |
| On This Day | "X was released N years ago today — it's in your library" | Release date (Plex `originallyAvailableAt`) |
| Journal Prompt | "You've never written about this song" — nudge toward a specific unwritten track | Internal |
| New Release | New music from artists already in your library | Spotify API / MusicBrainz |
| Album of the Day | Spotlight a full album — invite a full listen | Internal / Plex |
| Artist | Fun fact about an artist + related artists you may not know | Last.fm / MusicBrainz |
| Critic's Pick | Weekly critically acclaimed new releases | albumoftheyear.org / Metacritic |

---

## Journaling

- **Format:** Free text entry, date-stamped
- **Trigger:** Mix of in-the-moment (song hits you) and retroactive (browsing the library)
- **Privacy:** Strictly private — never shared, never part of a Mixtape
- **Location in app:** Song Screen (layer 3) and Memoir tab
- **Blank state indicator:** Tracks without entries have a visual cue in Album View and Library grid
- **Future considerations:** Mood tag, location stamp — TBD

---

## Mixtape Feature

A curated playlist format built for sharing. Fundamentally different from the private journal.

**The concept:** You curate songs from your library, write a short note on each one explaining what it means — then share the Mixtape with someone. It's a way to let someone know you by handing them a soundtrack with context.

**Two layers of annotation per song:**
- **Private journal entry** — yours, never shared
- **Mixtape note** — written for someone, shareable

**Key design principles:**
- The act of building a Mixtape should feel slow and intentional (not drag-and-drop transactional)
- Receiving a Mixtape is an experience: song → your note → Genius fact underneath
- A Mixtape is an authored object — it has a title, a recipient, a mood

**Object structure (TBD):** title, recipient name, cover art (auto or custom), ordered list of songs each with a mixtape note, share method (link? in-app? export?)

---

## Competitive Landscape

| App | Overlap with Epoch | Gap |
|---|---|---|
| Backtrack | Music nostalgia, rediscovery by era | No journaling, no personal library, no editorial feed |
| Encore | Memory logging for concerts, Letterboxd-style | Live music only, not personal library |
| Spotify + Genius | Song facts embedded in player | Plugin inside a giant, not a dedicated experience |
| Day One | Gold standard personal journal, attaches currently-playing music | General journal — music is a footnote, not the organizing principle |
| The Nostalgia Machine | Year-based music nostalgia | Web novelty only, no depth |

**Epoch's white space:** Nobody owns the intersection of personal library + song education + memory journaling + social sharing.

---

## Open Decisions

- Genius API for Did You Know — rate limits, querying by song/artist
- New Release data source — Spotify API or MusicBrainz
- Artist data source — Last.fm or MusicBrainz for bios and related artists
- On This Day logic — ✅ resolved: using Plex `originallyAvailableAt` from album endpoint
- Critic's Pick cadence — weekly drop, likely Monday
- Feed handling for new user with zero journal entries
- Mixtape sharing mechanism — shareable link, in-app experience, or export
- Whether recipients need an Epoch account to view a Mixtape
- Mixtape navigation placement — own tab (4th) or nested inside Library
- Typeface selection — serif + sans-serif pairing for Epoch visual language
- Multi-library support beyond Plex (Spotify, Apple Music — future)
- Multi-user accounts and cloud-stored journal entries (future)

---

## Tech Stack

- **Frontend:** React + Vite, deployed to GitHub Pages (`/Music-app/`)
- **Styling:** Inline styles + Tailwind CSS via `@tailwindcss/vite`
- **Music library:** Plex Media Server API
  - Server: configured via `VITE_PLEX_SERVER` env var
  - Music section key: `8`
  - Album metadata (blur colors, release dates) fetched from `type=9` endpoint
  - Artist bios/art fetched via `fetchArtistMeta()` on demand
- **Journal storage:** Firebase Firestore — `memories/{songId}/entries`
- **Cache:** localStorage, 30-min TTL, key `plex_library_v4`
- **CI/CD:** GitHub Actions — all `VITE_*` vars injected as GitHub Secrets
