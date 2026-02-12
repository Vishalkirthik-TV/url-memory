"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteBookmark } from "@/app/actions";
import { Trash2, Copy, ExternalLink, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Bookmark {
    id: number;
    url: string;
    title: string | null;
    created_at: string;
}

interface BookmarkListProps {
    initialBookmarks: Bookmark[];
    userId: string;
}

export default function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    // Create Supabase client only once
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        setBookmarks(initialBookmarks);

        const channel = supabase
            .channel('realtime_bookmarks')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newBookmark = payload.new as Bookmark;
                    setBookmarks((current) => {
                        // Avoid duplicates
                        if (current.some(b => b.id === newBookmark.id)) return current;
                        return [newBookmark, ...current];
                    });
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
                    setBookmarks((current) =>
                        current.filter((bookmark) => bookmark.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialBookmarks, supabase, userId]);

    const handleDelete = async (id: number) => {
        // Optimistic update
        const previousBookmarks = [...bookmarks];
        setBookmarks(curr => curr.filter(b => b.id !== id));

        const result = await deleteBookmark(id.toString());
        if (result?.error) {
            // Revert if error
            setBookmarks(previousBookmarks);
            console.error("Failed to delete bookmark:", result.error);
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

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No bookmarks yet</h3>
                <p className="mt-1 text-sm text-gray-500">Paste a URL above to get started.</p>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
                {bookmarks.map((bookmark) => (
                    <motion.li
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={bookmark.id}
                        className="group relative col-span-1 rounded-2xl bg-white p-5 border border-gray-200 transition-all hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/50"
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
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-indigo-600 truncate block transition-colors flex items-center gap-1"
                            >
                                {new URL(bookmark.url).hostname}
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        </div>
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}
