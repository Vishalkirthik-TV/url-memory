"use client";

import { addBookmark } from "@/app/actions";
import { useRef, useState } from "react";

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        const result = await addBookmark(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setError(null);
            formRef.current?.reset();
        }
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="mb-5 text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Bookmark
            </h2>
            <form ref={formRef} action={clientAction} className="space-y-4">
                <div className="group">
                    <label htmlFor="title" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-colors duration-200"
                        placeholder="e.g. Google"
                    />
                </div>
                <div className="group">
                    <label htmlFor="url" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        URL
                    </label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-colors duration-200"
                        placeholder="https://..."
                    />
                </div>
                {error && (
                    <div className="rounded-md bg-red-50 p-3">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
                >
                    Save Bookmark
                </button>
            </form>
        </div>
    );
}
