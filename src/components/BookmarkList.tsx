"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { deleteBookmark } from "@/app/actions";
import { useRouter } from "next/navigation";

// Define the Bookmark type locally since we don't have a shared types file yet
type Bookmark = {
    id: string;
    title: string;
    url: string;
    created_at: string;
};

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        let channel: any;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                channel = supabase
                    .channel("realtime bookmarks")
                    .on(
                        "postgres_changes",
                        {
                            event: "INSERT",
                            schema: "public",
                            table: "bookmarks",
                            filter: `user_id=eq.${user.id}`,
                        },
                        (payload) => {
                            const newBookmark = payload.new as Bookmark;
                            setBookmarks((current) => {
                                if (current.some(b => b.id === newBookmark.id)) {
                                    return current;
                                }
                                return [newBookmark, ...current];
                            });
                            router.refresh();
                        }
                    )
                    .on(
                        "postgres_changes",
                        {
                            event: "DELETE",
                            schema: "public",
                            table: "bookmarks",
                        },
                        (payload) => {
                            setBookmarks((current) =>
                                current.filter((b) => b.id !== payload.old.id)
                            );
                            router.refresh();
                        }
                    )
                    .subscribe();
            }
        };

        setupRealtime();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [supabase, router]);

    async function handleDelete(id: string) {
        // Optimistic delete
        setBookmarks((current) => current.filter((b) => b.id !== id));
        const result = await deleteBookmark(id);
        if (result?.error) {
            // revert if error
            router.refresh();
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No bookmarks yet. Add one above!</p>
            </div>
        )
    }

    return (
        <div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {bookmarks.map((bookmark) => (
                    <li
                        key={bookmark.id}
                        className="group relative col-span-1 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-indigo-100"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 truncate pr-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </div>
                                    <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {bookmark.title}
                                    </h3>
                                </div>
                                <p className="mt-2 truncate text-sm text-gray-500 pl-10">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline hover:text-indigo-500 transition-colors"
                                    >
                                        {new URL(bookmark.url).hostname}
                                    </a>
                                </p>
                                <div className="mt-4 pl-10 flex items-center text-xs text-gray-400">
                                    {new Date(bookmark.created_at).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                title="Delete bookmark"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
