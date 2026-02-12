import { createClient } from "@/utils/supabase/server";
import LandingNavbar from "@/components/LandingNavbar";
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
            <LandingNavbar user={user} />
            <main className="mx-auto max-w-5xl mt-8 px-4 py-12 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 space-y-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                        {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{capitalizedUsername}</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Your personal space to curate and organize the web.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Add Bookmark Section */}
                    <section className="max-w-2xl mx-auto w-full relative z-10 transition-all duration-300">
                        <AddBookmarkForm />
                    </section>

                    {/* Bookmarks Grid */}
                    <section className="relative z-0">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">My Collection</h2>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {bookmarks?.length || 0} items
                            </span>
                        </div>
                        <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
                    </section>
                </div>
            </main>
        </div>
    );
}
