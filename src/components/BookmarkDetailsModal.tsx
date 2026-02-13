"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Copy, Calendar, Globe, Heart } from "lucide-react";

interface Bookmark {
    id: string;
    url: string;
    title: string | null;
    description?: string | null;
    is_favorite: boolean;
    created_at: string;
}

interface BookmarkDetailsModalProps {
    bookmark: Bookmark | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookmarkDetailsModal({ bookmark, isOpen, onClose }: BookmarkDetailsModalProps) {
    if (!bookmark) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookmark.url);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    const getFaviconUrl = (url: string) => {
        const domain = getDomain(url);
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header Area */}
                        <div className="flex justify-between items-start p-8 pb-0">
                            <div className="h-20 w-20 rounded-2xl bg-gray-50 p-4 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                    src={getFaviconUrl(bookmark.url)}
                                    alt="Icon"
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <Globe className="w-10 h-10 text-gray-200 hidden" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1 pr-4">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {bookmark.title || "Untitled Link"}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Globe className="w-4 h-4" />
                                        <span className="truncate">{getDomain(bookmark.url)}</span>
                                    </div>
                                </div>
                                {bookmark.is_favorite && (
                                    <div className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-red-100 shrink-0">
                                        <Heart className="w-3 h-3 fill-current" />
                                        FAVORITE
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {bookmark.description && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Summary</h3>
                                        <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                                            {bookmark.description}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Added on</span>
                                            <span className="text-xs font-medium text-gray-700" suppressHydrationWarning>{formatDate(bookmark.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">URL</span>
                                            <span className="text-xs font-medium text-gray-700 truncate">{bookmark.url}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold rounded-2xl transition-all active:scale-95"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-2xl transition-all active:scale-95"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open Link
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
