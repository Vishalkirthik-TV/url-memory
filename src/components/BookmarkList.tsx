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
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((bookmark) => (
                    <li
                        key={bookmark.id}
                        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                    >
                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-sm font-medium text-gray-900">
                                        {bookmark.title}
                                    </h3>
                                </div>
                                <p className="mt-1 truncate text-sm text-gray-500">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {bookmark.url}
                                    </a>
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
