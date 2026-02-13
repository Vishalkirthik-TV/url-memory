# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Secure login via Supabase Auth.
- **Private Bookmarks**: Row Level Security (RLS) ensures users only see their own data.
- **Real-time Updates**: Bookmarks sync instantly across tabs/devices using Supabase Realtime.
- **Optimistic UI**: Immediate feedback for add/delete actions.
- **Responsive Design**: Built with Tailwind CSS.

## 🚀 Challenges & Technical Solutions

During development, we solved several key technical hurdles to make the app feel professional and robust.

### 1. Dynamic Realtime Updates
*   **The Problem**: Every time a user adds a bookmark, the page refreshes to get the latest data. This refresh was causing the "live" connection (Supabase Realtime) to restart. During that split-second restart, the app would sometimes miss the "success" signal, making the interface feel glitchy or preventing a second addition from working.
*   **The Solution**: I decoupled the real-time connection from the page refresh. Now, the connection stays open and stable in the background, while a "smart merge" logic ensures the UI and database stay perfectly synced without flickering.

### 2. Forced Logged-in (Middleware)
*   **The Problem**: Our security middleware was too strict. Once a user logged in, it would automatically bounce them away from the Home page (`/`) back to the Dashboard. This prevented users from seeing the marketing site or landing page after they had already joined.
*   **The Solution**: I updated the middleware to be more flexible. It now checks the specific path: it protects the `/dashboard` but allows authenticated users to freely visit the `/` landing page if they choose, providing a better user experience.

### 3. UUID Data Mapping
*   **The Problem**: The database uses `UUID` (long unique strings) for bookmark IDs for better security. However, the frontend components were initially expecting `numbers`. This "language barrier" meant that when the UI tried to delete a bookmark using an ID, the database couldn't find a match, causing actions to fail silently.
*   **The Solution**: I performed a sweep across the entire codebase to unify the data types. Every component now speaks "UUID," ensuring that addition, deletion, and real-time updates always find the correct record.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Real-time**: Supabase Broadcast & Postgres Changes
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React


