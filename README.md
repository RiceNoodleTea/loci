# Loci - Study Smarter

A collaborative study platform with rich note-taking, flashcards, quizzes, group study rooms, and a physics-themed particle gamification system.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres, Auth, Realtime, Storage)
- **Tailwind CSS** + **shadcn/ui** patterns
- **Tiptap** (rich text editor with slash commands)
- **React Three Fiber** (3D atom/molecule visualization)
- **Zustand** (state management)

## Getting Started

### 1. Install dependencies

```bash
cd loci
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the migration in the Supabase SQL editor:

```
supabase/migrations/001_initial_schema.sql
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### Notes
Rich text editor with toolbar, slash commands (`\h1`, `\code`, `\table`, etc.), image upload, auto-save.

### Dashboard
Pomodoro timer (Focus Session), calendar (Archives Calendar), to-do list (Daily Ledger), upcoming assessments.

### Study Workshop
Flashcard decks with SM-2 spaced repetition, quizzes with multiple question types, focus stats (Focus Pulse).

### Groups & Socials
Study groups (min 3 members), real-time chat, shared study rooms, weekly/monthly leaderboards.

### Particle System
Physics-themed gamification:
- Solo study earns quarks
- Pair study converts quarks into protons/neutrons
- Quizzes/flashcards earn electrons
- Groups vote weekly on which element to build
- Full-group study sessions enable molecule fusion
- Interactive 3D atom viewer (React Three Fiber)

## Project Structure

```
app/           → Next.js pages and layouts
components/    → React components organized by feature
lib/           → Utilities, Supabase clients, stores, game engine
supabase/      → Database migrations
```
