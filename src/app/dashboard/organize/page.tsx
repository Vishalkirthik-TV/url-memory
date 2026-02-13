import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import OrganizeClient from "@/components/OrganizeClient";
import MobileMenuTrigger from "@/components/MobileMenuTrigger";

export default async function OrganizePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Fetch bookmarks and categories
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

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar userEmail={user.email} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MobileMenuTrigger icon="dashboard" />
                <OrganizeClient
                    initialBookmarks={bookmarksRes.data || []}
                    initialCategories={categoriesRes.data || []}
                    userId={user.id}
                />
            </main>
        </div>
    );
}
