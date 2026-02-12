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
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <AddBookmarkForm />
                </div>
                <div className="space-y-4">
                    <BookmarkList initialBookmarks={bookmarks ?? []} />
                </div>
            </main>
        </div>
    );
}
