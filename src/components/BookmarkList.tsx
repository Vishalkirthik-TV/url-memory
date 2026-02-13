"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteBookmark, toggleFavorite } from "@/app/actions";
import { Trash2, Copy, ExternalLink, Globe, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookmarkDetailsModal from "./BookmarkDetailsModal";

interface Bookmark {
    id: string;
    url: string;
    title: string | null;
    description?: string | null;
    is_favorite: boolean;
    created_at: string;
}

interface BookmarkListProps {
    initialBookmarks: Bookmark[];
    userId: string;
    filter?: 'all' | 'favorites';
}

export default function BookmarkList({ initialBookmarks, userId, filter: initialFilter = 'all' }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [filter, setFilter] = useState<'all' | 'favorites'>(initialFilter);
    const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
    // Create Supabase client only once
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!userId) return;

        console.log("Setting up realtime subscription for user:", userId);
        const channel = supabase
            .channel(`realtime_bookmarks_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log("Realtime INSERT received:", payload.new);
                    const newBookmark = payload.new as Bookmark;
                    setBookmarks((current) => {
                        if (current.some(b => b.id === newBookmark.id)) return current;
                        return [newBookmark, ...current];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log("Realtime UPDATE received:", payload.new);
                    const updatedBookmark = payload.new as Bookmark;
                    setBookmarks((current) =>
                        current.map((b) => b.id === updatedBookmark.id ? { ...b, ...updatedBookmark } : b)
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log("Realtime DELETE received:", payload.old);
                    const deletedId = payload.old.id;
                    setBookmarks((current) =>
                        current.filter((bookmark) => bookmark.id !== deletedId)
                    );
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status);
            });

        return () => {
            console.log("Cleaning up subscription");
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    // Sync state with props when they change (due to server-side revalidation)
    useEffect(() => {
        setBookmarks((current) => {
            // Merge logic: Prefer server source but keep "recently added" items from realtime
            // that might not have hit the revalidation cache yet.
            const serverIds = new Set(initialBookmarks.map(b => b.id));
            const recentlyAdded = current.filter(b => !serverIds.has(b.id));

            // To prevent "resurrecting" deleted items that the server still thinks exist:
            // We assume the server is the source of truth for the 'whole' list,
            // but we allow Realtime to stay "ahead" of it.
            return [...recentlyAdded, ...initialBookmarks].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        });
    }, [initialBookmarks]);

    const handleDelete = async (id: string) => {
        // Optimistic update
        const previousBookmarks = [...bookmarks];
        setBookmarks(curr => curr.filter(b => b.id !== id));

        const result = await deleteBookmark(id);
        if (result?.error) {
            // Revert if error
            setBookmarks(previousBookmarks);
            console.error("Failed to delete bookmark:", result.error);
        }
    };

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        // Optimistic update
        setBookmarks(curr => curr.map(b =>
            b.id === id ? { ...b, is_favorite: newStatus } : b
        ));

        const result = await toggleFavorite(id, newStatus);
        console.log("Toggle favorite server result:", result);
        if (result?.error) {
            // Revert if error
            setBookmarks(curr => curr.map(b =>
                b.id === id ? { ...b, is_favorite: currentStatus } : b
            ));
            console.error("Failed to toggle favorite:", result.error);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    // Helper to get favicon
    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const filteredBookmarks = filter === 'favorites'
        ? bookmarks.filter(b => b.is_favorite === true)
        : bookmarks;

    console.log("Rendering filtered bookmarks:", filteredBookmarks.length, "Mode:", filter);

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`pb-4 text-sm font-semibold transition-all relative ${filter === 'all' ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        All Bookmarks
                        {filter === 'all' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setFilter('favorites')}
                        className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${filter === 'favorites' ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Favorites
                        <Heart className={`w-3.5 h-3.5 ${filter === 'favorites' ? "fill-current" : ""}`} />
                        {filter === 'favorites' && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                </div>
                <span className="pb-4 text-sm text-gray-500 font-medium">
                    {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {filteredBookmarks.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                        {filter === 'favorites' ? (
                            <Heart className="w-6 h-6 text-gray-400" />
                        ) : (
                            <Globe className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">
                        {filter === 'favorites' ? "No favorites yet" : "No bookmarks yet"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'favorites' ? "Heart some bookmarks to see them here." : "Paste a URL above to get started."}
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence initial={false} mode="popLayout">
                        {filteredBookmarks.map((bookmark) => (
                            <motion.li
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                key={bookmark.id}
                                className="group relative col-span-1 rounded-2xl bg-white p-5 border border-gray-200 transition-all hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/50 cursor-pointer"
                                onClick={() => setSelectedBookmark(bookmark)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                        <img
                                            src={getFaviconUrl(bookmark.url) || ''}
                                            alt="Icon"
                                            className="w-5 h-5 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <Globe className="w-5 h-5 text-gray-400 hidden" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => {
                                                console.log("Toggle favorite clicked for ID:", bookmark.id, "Current status:", bookmark.is_favorite);
                                                handleToggleFavorite(bookmark.id, !!bookmark.is_favorite);
                                            }}
                                            className={`p-1.5 rounded-lg transition-all active:scale-90 ${bookmark.is_favorite === true
                                                ? "text-red-500 bg-red-50 hover:bg-red-100"
                                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                }`}
                                            title={bookmark.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            <Heart className={`w-4 h-4 ${bookmark.is_favorite === true ? "fill-current" : ""}`} />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(bookmark.url)}
                                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Copy URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bookmark.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                                        {bookmark.title || bookmark.url}
                                    </h3>
                                    <div
                                        className="text-xs text-gray-500 hover:text-indigo-600 truncate block transition-colors flex items-center gap-1"
                                    >
                                        {new URL(bookmark.url).hostname}
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}

            <BookmarkDetailsModal
                bookmark={selectedBookmark}
                isOpen={!!selectedBookmark}
                onClose={() => setSelectedBookmark(null)}
            />
        </div>
    );
}
