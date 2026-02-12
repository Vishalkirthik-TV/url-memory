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
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                Add New Bookmark
            </h2>
            <form ref={formRef} action={clientAction} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="Google"
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="https://google.com"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Bookmark
                </button>
            </form>
        </div>
    );
}
