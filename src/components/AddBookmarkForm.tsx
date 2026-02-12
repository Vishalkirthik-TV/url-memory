"use client";

import { addBookmark } from "@/app/actions";
import { useRef, useState } from "react";
import { Plus, Link as LinkIcon, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function clientAction(formData: FormData) {
        setIsSubmitting(true);
        const result = await addBookmark(formData);
        setIsSubmitting(false);

        if (result?.error) {
            setError(result.error);
        } else {
            setError(null);
            formRef.current?.reset();
        }
    }

    return (
        <div className="w-full">
            <form ref={formRef} action={clientAction} className="relative group">
                <div className="relative flex flex-col gap-4 p-2 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-black/5 focus-within:shadow-md transition-all duration-300">

                    {/* URL Input Area */}
                    <div className="relative flex items-center px-4 pt-2">
                        <LinkIcon className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="url"
                            name="url"
                            required
                            placeholder="Paste a URL (e.g. https://twitter.com)"
                            className="w-full py-4 pl-3 bg-transparent border-none outline-none text-base text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mx-4" />

                    {/* Title Input Area */}
                    <div className="relative flex items-center px-4 pb-2">
                        <Type className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Name this bookmark"
                            className="w-full py-4 pl-3 bg-transparent border-none outline-none text-base text-gray-900 placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="absolute right-4 shrink-0 bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md shadow-gray-200"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-12 left-0 right-0"
                        >
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
