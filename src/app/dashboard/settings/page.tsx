import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProfileForm from "../../../components/ProfileForm";
import MobileMenuTrigger from "@/components/MobileMenuTrigger";

export default async function SettingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get current metadata
    const userMetadata = user.user_metadata || {};

    return (
        <div className="min-h-screen bg-gray-50/50 flex transition-all duration-300">
            <Sidebar userEmail={user.email} />

            <main className="flex-1 ml-0 md:ml-[280px] transition-all duration-300 px-4 py-8 md:py-12 sm:px-6 lg:px-8">
                <MobileMenuTrigger icon="settings" />

                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-12 space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Settings
                        </h1>
                        <p className="text-lg text-gray-500">
                            Manage your profile and account preferences.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Profile Section Card */}
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500 mt-1">This information will be displayed on your personal dashboard.</p>
                            </div>

                            <div className="p-8">
                                <ProfileForm initialMetadata={userMetadata} />
                            </div>
                        </section>

                        {/* Account Info (Read-only for now) */}
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</label>
                                    <p className="text-gray-900 font-medium mt-1">
                                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
