"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "./Sidebar";
import BookmarkList from "./BookmarkList";
import AddBookmarkForm from "./AddBookmarkForm";
import MobileMenuTrigger from "./MobileMenuTrigger";
import { updateBookmarkCategory } from "@/app/actions";

interface Bookmark {
    id: string;
    url: string;
    title: string | null;
    description?: string | null;
    is_favorite: boolean;
    created_at: string;
    category_id?: string | null;
}

interface Category {
    id: string;
    name: string;
    icon?: string;
}

interface DashboardClientProps {
    initialBookmarks: Bookmark[];
    initialCategories: Category[];
    user: any;
    greeting: string;
    username: string;
}

export default function DashboardClient({
    initialBookmarks,
    initialCategories,
    user,
    greeting,
    username
}: DashboardClientProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

    const [supabase] = useState(() => createClient());

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const bookmark = bookmarks.find((b) => b.id === active.id);
        if (bookmark) setActiveBookmark(bookmark);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveBookmark(null);

        if (!over) return;

        // If dropped on a category in the sidebar
        if (over.id.toString().startsWith("category-")) {
            const categoryId = over.id.toString().replace("category-", "");
            const bookmarkId = active.id.toString();

            // Optimistic update
            setBookmarks((prev) =>
                prev.map((b) =>
                    b.id === bookmarkId ? { ...b, category_id: categoryId } : b
                )
            );

            const result = await updateBookmarkCategory(bookmarkId, categoryId);
            if (result.error) {
                // Revert if error
                setBookmarks((prev) =>
                    prev.map((b) =>
                        b.id === bookmarkId ? { ...b, category_id: bookmarks.find(old => old.id === bookmarkId)?.category_id } : b
                    )
                );
            }
        }
    };

    const filteredBookmarks = selectedCategoryId
        ? bookmarks.filter(b => b.category_id === selectedCategoryId)
        : bookmarks;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-gray-50/50 flex transition-all duration-300">
                <Sidebar
                    userEmail={user.email}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                />

                <main className="flex-1 transition-all duration-300 ml-0 md:ml-[280px] lg:ml-[280px] group-data-[collapsed=true]:md:ml-[80px] px-4 py-12 sm:px-6 lg:px-8">
                    <MobileMenuTrigger icon="dashboard" />

                    {/* Header Section */}
                    <div className="mb-12 space-y-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{username}</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            {selectedCategoryId
                                ? `Viewing ${categories.find(c => c.id === selectedCategoryId)?.name}`
                                : "Your personal space to curate and organize the web."}
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Add Bookmark Section */}
                        <section className="max-w-2xl mx-auto w-full relative z-10 transition-all duration-300">
                            <AddBookmarkForm />
                        </section>

                        {/* Bookmarks Grid */}
                        <section className="relative z-20">
                            <BookmarkList
                                initialBookmarks={filteredBookmarks}
                                userId={user.id}
                                isDraggable
                            />
                        </section>
                    </div>
                </main>
            </div>

            <DragOverlay>
                {activeBookmark ? (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xl opacity-80 cursor-grabbing w-64">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {activeBookmark.title || activeBookmark.url}
                        </h3>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
