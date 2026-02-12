import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Link2 } from "lucide-react";

export default async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const signOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
                            <Link2 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Linqs</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500 hidden sm:block">{user.email}</span>
                                <form action={signOut}>
                                    <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
