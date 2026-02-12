import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your saved links and resources.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Add Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <AddBookmarkForm />
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-2">
                        <BookmarkList initialBookmarks={bookmarks ?? []} />
                    </div>
                </div>
            </main>
        </div>
    );
}
