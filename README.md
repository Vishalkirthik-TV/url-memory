# Smart Bookmark App - Re-imagined

A premium, real-time bookmark manager built for speed and effortless organization. Built with Next.js 15, Supabase, and Tailwind CSS.

**Live Demo**: [url-memory-lyart.vercel.app](https://url-memory-lyart.vercel.app/)

## ✨ Features

- **Personalized Dashboard**: A clean, modern interface to view and manage your web collections.
- **Smart Organization**: A dedicated board-style page to categorize links via drag-and-drop into customizable pastel columns.
- **Drag & Drop Re-imagined**: Robust bucket-style categorization powered by `dnd-kit`.
- **Favorites & Search**: Quickly find and pin your most important links.
- **Real-time Sync**: Changes reflect across all tabs instantly with Supabase Broadcast.
- **Mobile First**: Fully responsive layout with a custom mobile menu and touch-optimized interactions.

## 🚀 Challenges & Technical Solutions

During development, we solved several key technical hurdles to make the app feel professional and robust.

### 1. Robust Drag and Drop (The "Bucket" Challenge)
*   **The Problem**: Moving items between containers in `dnd-kit` can be finicky. Users found it difficult to drop links exactly where they wanted, especially when dropping directly onto other links or into empty sections.
*   **The Solution**: I implemented a custom `findContainer` logic and optimized collision detection. Now, dropping a link onto another link *correctly* identifies the destination category. I also added minimum heights and interactive "drop rings" to ensure every section is an easy target.

### 2. Mobile Drag-and-Drop vs. Scrolling
*   **The Problem**: On mobile, dragging a link often interferes with vertical scrolling. Users would accidentally move links when they just wanted to scroll down.
*   **The Solution**: I implemented a "Long-Press" activation constraint (250ms). This allows users to scroll through their categories normally, while a deliberate press-and-hold picks up a link for reorganization.

### 3. Layout & Sidebar Refinement
*   **The Problem**: The initial sidebar was fixed on desktop, overlapping content and reducing available workspace. It also lacked clear visual branding.
*   **The Solution**: I refactored the layout to be responsive. On desktop, the sidebar pushes content (flex-flow), while on mobile it remains a floating action menu. I also updated the branding with a custom bookmark logo and restored the mobile menu trigger.

### 4. Hydration & Performance
*   **The Problem**: Drag-and-drop libraries often cause "Hydration Mismatch" errors because they generate unique IDs on the server that don't match the client.
*   **The Solution**: I implemented a `isMounted` state pattern for draggable items, deferring the application of DnD attributes until the component reaches the client. This eliminated errors and improved initial load performance.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Real-time**: Supabase Broadcast & Postgres Changes
- **Interactions**: dnd-kit (Sortable & Core)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React


