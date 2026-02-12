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

    // Helper for time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Get username from email (before the @)
    const username = user.email?.split('@')[0] || 'User';
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 space-y-2 text-center md:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {getGreeting()}, {capitalizedUsername}
                    </h1>
                    <p className="text-gray-500">
                        Manage your internet library.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    <section className="max-w-xl mx-auto w-full md:mx-0">
                        <AddBookmarkForm />
                    </section>

                    <section>
                        <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
                    </section>
                </div>
            </main>
        </div>
    );
}
