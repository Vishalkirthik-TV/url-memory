import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
        <nav className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex flex-shrink-0 items-center">
                        <h1 className="text-xl font-bold text-gray-900">Bookmarks</h1>
                    </div>
                    <div className="flex items-center">
                        {user && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">{user.email}</span>
                                <form action={signOut}>
                                    <button className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
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
