"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Plus, Globe, Clock, MoreHorizontal } from "lucide-react";

export default function LandingDemo() {
    const [text, setText] = useState("");
    const [bookmarks, setBookmarks] = useState([
        { id: 1, title: "Next.js Documentation", url: "nextjs.org", date: "Just now" },
        { id: 2, title: "Vercel Deployment", url: "vercel.com", date: "2m ago" },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                // Reset
                setIsTyping(false);
                setText("");
                setBookmarks([
                    { id: 1, title: "Next.js Documentation", url: "nextjs.org", date: "2m ago" },
                    { id: 2, title: "Vercel Deployment", url: "vercel.com", date: "5m ago" },
                ]);

                // Wait before starting
                await new Promise(r => setTimeout(r, 1000));

                // Type URL
                setIsTyping(true);
                const targetText = "https://abstract.tech";
                for (let i = 0; i <= targetText.length; i++) {
                    setText(targetText.slice(0, i));
                    await new Promise(r => setTimeout(r, 50 + Math.random() * 30));
                }
                setIsTyping(false);

                // Wait before "click"
                await new Promise(r => setTimeout(r, 600));

                // Add item
                const newBookmark = {
                    id: 3,
                    title: "Abstract Tech",
                    url: "abstract.tech",
                    date: "Just now"
                };

                setText("");
                setBookmarks(prev => [newBookmark, ...prev]);

                // Show result for a while
                await new Promise(r => setTimeout(r, 4000));
            }
        };

        sequence();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto perspective-1000">
            <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
            >
                {/* Browser Header */}
                <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>

                {/* Simulated App Content */}
                <div className="p-8 min-h-[400px] bg-gray-50/50">
                    <div className="max-w-2xl mx-auto space-y-8">
                        {/* Simulated Add Form */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="text-xs font-semibold text-gray-500 uppercase">New Bookmark</div>
                                    <div className="relative h-10 w-full rounded-md border border-gray-200 bg-gray-50 flex items-center px-3 text-sm text-gray-800">
                                        {text}
                                        {isTyping && (
                                            <motion.div
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                                className="w-0.5 h-5 bg-indigo-600 ml-0.5"
                                            />
                                        )}
                                        {text === "" && !isTyping && <span className="text-gray-400">Paste URL here...</span>}
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        animate={text === "https://abstract.tech" ? { scale: [1, 1.05, 1], backgroundColor: "#4f46e5" } : { backgroundColor: "#111827" }}
                                        className="h-10 px-6 bg-gray-900 text-white text-sm font-medium rounded-md shadow-sm"
                                    >
                                        Save
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Simulated List */}
                        <div className="space-y-3">
                            {bookmarks.map((bookmark) => (
                                <motion.div
                                    key={bookmark.id}
                                    layout
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{bookmark.title}</h3>
                                            <p className="text-xs text-gray-500">{bookmark.url}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <span className="text-xs">{bookmark.date}</span>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
