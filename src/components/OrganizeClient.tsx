"use client";

import { useState, useEffect, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Plus,
    GripVertical,
    MoreHorizontal,
    Trash2,
    Folder,
    Globe,
    Clock,
    Search,
    ChevronRight,
    Tag
} from "lucide-react";
import { createCategory, deleteCategory, updateBookmarkCategory } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Bookmark {
    id: string;
    url: string;
    title: string | null;
    category_id: string | null;
    created_at: string;
}

interface Category {
    id: string;
    name: string;
    color?: string;
}

interface OrganizeClientProps {
    initialBookmarks: Bookmark[];
    initialCategories: Category[];
    userId: string;
}

const PASTEL_COLORS = [
    { name: "Blue", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", chip: "bg-blue-100/50" },
    { name: "Green", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", chip: "bg-emerald-100/50" },
    { name: "Yellow", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", chip: "bg-amber-100/50" },
    { name: "Purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", chip: "bg-purple-100/50" },
    { name: "Pink", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100", chip: "bg-pink-100/50" },
    { name: "Indigo", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", chip: "bg-indigo-100/50" },
];

function CategoryCard({ category, bookmarks, isOver, colorIndex }: { category: Category | null, bookmarks: Bookmark[], isOver?: boolean, colorIndex: number }) {
    const color = category ? PASTEL_COLORS[colorIndex % PASTEL_COLORS.length] : { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-100", chip: "bg-gray-100/50" };

    return (
        <div className={`flex flex-col h-full rounded-2xl sm:rounded-3xl border-2 transition-all p-4 sm:p-6 ${color.bg} ${color.border} ${isOver ? 'ring-4 ring-indigo-500 ring-offset-2' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${color.chip} ${color.text}`}>
                        {category ? <Tag className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${color.text}`}>
                            {category ? category.name : "Unorganized"}
                        </h3>
                        <p className={`text-xs font-medium opacity-60`}>
                            {bookmarks.length} {bookmarks.length === 1 ? 'link' : 'links'}
                        </p>
                    </div>
                </div>
                {category && (
                    <button
                        onClick={async () => {
                            if (confirm(`Delete category "${category.name}"?`)) {
                                await deleteCategory(category.id);
                            }
                        }}
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all text-gray-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 space-y-3 min-h-[100px]">
                {bookmarks.map((bookmark) => (
                    <DraggableBookmarkItem key={bookmark.id} bookmark={bookmark} />
                ))}
                {bookmarks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-black/5 rounded-2xl flex items-center justify-center text-gray-400 text-xs font-medium">
                        Drag links here
                    </div>
                )}
            </div>
        </div>
    );
}

function DraggableBookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: bookmark.id,
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
    };

    const dndProps = isMounted ? { ...attributes, ...listeners } : {};

    const domain = new URL(bookmark.url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...dndProps}
            className={`group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm border border-black/5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-black/5">
                <img src={faviconUrl} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs font-bold text-gray-900 truncate leading-tight">
                    {bookmark.title || bookmark.url}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">
                    {domain}
                </p>
            </div>
            <GripVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

export default function OrganizeClient({ initialBookmarks, initialCategories, userId }: OrganizeClientProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`realtime_organize_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log("Organize realtime change:", payload);

                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark;
                        toast.success("New bookmark added externally", {
                            description: newBookmark.title || newBookmark.url
                        });
                        setBookmarks(current => {
                            if (current.some(b => b.id === newBookmark.id)) return current;
                            return [newBookmark, ...current];
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedBookmark = payload.new as Bookmark;
                        setBookmarks(current =>
                            current.map(b => b.id === updatedBookmark.id ? { ...b, ...updatedBookmark } : b)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = payload.old.id;
                        toast.info("A bookmark was removed");
                        setBookmarks(current =>
                            current.filter(b => b.id !== deletedId)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    // Sync state with props when they change (server revalidation)
    useEffect(() => {
        setBookmarks(current => {
            const serverIds = new Set(initialBookmarks.map(b => b.id));
            const recentlyAdded = current.filter(b => !serverIds.has(b.id));

            return [...recentlyAdded, ...initialBookmarks].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        });
    }, [initialBookmarks]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const filteredBookmarks = useMemo(() => {
        if (!searchQuery) return bookmarks;
        return bookmarks.filter(b =>
            b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.url.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [bookmarks, searchQuery]);

    const bookmarksByCategory = useMemo(() => {
        const map: Record<string, Bookmark[]> = { "unorganized": [] };
        categories.forEach(c => map[c.id] = []);

        filteredBookmarks.forEach(b => {
            if (b.category_id && map[b.category_id]) {
                map[b.category_id].push(b);
            } else {
                map["unorganized"].push(b);
            }
        });
        return map;
    }, [filteredBookmarks, categories]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    };

    const findContainer = (id: string) => {
        if (id === "unorganized") return "unorganized";
        if (id.startsWith("cat-")) return id;

        // If it's a bookmark ID, find which category it belongs to
        const bookmark = bookmarks.find(b => b.id === id);
        if (bookmark) {
            return bookmark.category_id ? `cat-${bookmark.category_id}` : "unorganized";
        }
        return null;
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const bookmarkId = active.id.toString();
        const overId = over.id.toString();

        const container = findContainer(overId);
        if (!container) return;

        let newCategoryId: string | null = null;
        if (container === "unorganized") {
            newCategoryId = null;
        } else {
            newCategoryId = container.replace("cat-", "");
        }

        const originalBookmark = bookmarks.find(b => b.id === bookmarkId);
        if (originalBookmark?.category_id === newCategoryId) return;

        // Optimistic update
        setBookmarks(prev => prev.map(b =>
            b.id === bookmarkId ? { ...b, category_id: newCategoryId } : b
        ));

        const result = await updateBookmarkCategory(bookmarkId, newCategoryId);
        if (result.error) {
            setBookmarks(prev => prev.map(b =>
                b.id === bookmarkId ? { ...b, category_id: originalBookmark?.category_id || null } : b
            ));
        }
    };

    const activeBookmark = useMemo(() =>
        bookmarks.find(b => b.id === activeId),
        [bookmarks, activeId]);

    return (
        <div className="h-full flex flex-col min-h-0">
            {/* Header Section */}
            <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-6 bg-white/50 backdrop-blur-sm border-b border-black/5 shrink-0">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-1 sm:mb-2">
                                Organize <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Your Web</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 font-medium line-clamp-1 sm:line-clamp-none">Drag links into pastel columns to categorize.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative group flex-1 sm:flex-none">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 pl-11 pr-6 py-3 bg-white border border-black/5 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-sm font-medium text-sm"
                                />
                            </div>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl sm:rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10 text-sm whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isAdding && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4"
                            >
                                <Tag className="w-5 h-5 text-indigo-500" />
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none font-bold text-indigo-900 placeholder:text-indigo-300"
                                    placeholder="Enter category name..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter' && newName.trim()) {
                                            const res = await createCategory(newName.trim());
                                            if (!res.error) {
                                                setNewName("");
                                                setIsAdding(false);
                                            }
                                        } else if (e.key === 'Escape') {
                                            setIsAdding(false);
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-100 rounded-xl transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        if (newName.trim()) {
                                            const res = await createCategory(newName.trim());
                                            if (!res.error) {
                                                setNewName("");
                                                setIsAdding(false);
                                            }
                                        }
                                    }}
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all text-sm"
                                >
                                    Create
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Board Section */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-8 lg:p-12 bg-[#F8FAFC]">
                <div className="flex flex-col md:flex-row gap-6 sm:gap-10 h-full min-w-0 md:min-w-max max-w-full pb-8 md:pb-0">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Unorganized Column */}
                        <div className="w-full md:w-80 h-auto md:h-full shrink-0 min-h-[150px]">
                            <DroppableContainer id="unorganized">
                                <SortableContext items={bookmarksByCategory["unorganized"].map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    <CategoryCard
                                        category={null}
                                        bookmarks={bookmarksByCategory["unorganized"]}
                                        colorIndex={0}
                                    />
                                </SortableContext>
                            </DroppableContainer>
                        </div>

                        {/* Category Columns */}
                        {categories.map((category, index) => (
                            <div key={category.id} className="w-full md:w-80 h-auto md:h-full shrink-0 min-h-[150px]">
                                <DroppableContainer id={`cat-${category.id}`}>
                                    <SortableContext items={bookmarksByCategory[category.id].map(b => b.id)} strategy={verticalListSortingStrategy}>
                                        <CategoryCard
                                            category={category}
                                            bookmarks={bookmarksByCategory[category.id] || []}
                                            colorIndex={index + 1}
                                        />
                                    </SortableContext>
                                </DroppableContainer>
                            </div>
                        ))}

                        <DragOverlay dropAnimation={{
                            sideEffects: defaultDropAnimationSideEffects({
                                styles: {
                                    active: {
                                        opacity: '0.5',
                                    },
                                },
                            }),
                        }}>
                            {activeBookmark ? (
                                <div className="scale-105 rotate-2 transition-transform">
                                    <DraggableBookmarkItem bookmark={activeBookmark} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Add More Shadow Column */}
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full md:w-80 h-40 md:h-full rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 sm:gap-4 text-gray-400 hover:border-indigo-300 hover:text-indigo-400 hover:bg-indigo-50/30 transition-all group shrink-0"
                    >
                        <div className="p-3 sm:p-4 rounded-xl bg-gray-50 group-hover:bg-indigo-100 transition-colors">
                            <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="font-bold text-sm sm:text-base">New Category</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useDroppable } from "@dnd-kit/core";

function DroppableContainer({ id, children }: { id: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className="h-full relative group/droppable">
            {children}
            <AnimatePresence>
                {isOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="absolute inset-0 bg-indigo-500/10 rounded-[2.5rem] pointer-events-none ring-4 ring-indigo-500 ring-inset z-20 transition-all duration-200"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
