import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import MobileMenuTrigger from "@/components/MobileMenuTrigger";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Fetch bookmarks and categories for the user
    const [bookmarksRes, categoriesRes] = await Promise.all([
        supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        supabase
            .from("categories")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
    ]);

    const initialBookmarks = bookmarksRes.data || [];
    const categories = categoriesRes.data || [];

    // Simple greeting logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const username = user.email?.split("@")[0] || "there";

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar
                userEmail={user.email}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MobileMenuTrigger icon="dashboard" />
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 lg:px-12">
                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* Header */}
                        <header className="space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 capitalize">{username}</span>
                                </h1>
                                <p className="text-gray-500 font-medium">Welcome back to your workspace.</p>
                            </div>
                            <div className="pt-2">
                                <AddBookmarkForm />
                            </div>
                        </header>

                        {/* Content */}
                        <BookmarkList
                            initialBookmarks={initialBookmarks}
                            userId={user.id}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
