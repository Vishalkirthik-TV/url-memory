"use client";

import { updateProfile } from "../app/actions";
import { useState } from "react";
import { User, Mail, AtSign, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileFormProps {
    initialMetadata: any;
}

export default function ProfileForm({ initialMetadata }: ProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function clientAction(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);

        const result = await updateProfile(formData);
        setIsSubmitting(false);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <form action={clientAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        defaultValue={initialMetadata.full_name || ""}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all text-gray-900 placeholder:text-gray-400"
                    />
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <AtSign className="w-4 h-4 text-gray-400" />
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        defaultValue={initialMetadata.username || ""}
                        placeholder="e.g. johndoe"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Bio</label>
                <textarea
                    name="bio"
                    defaultValue={initialMetadata.bio || ""}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-gray-200 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving Changes...</span>
                        </div>
                    ) : (
                        "Save Profile"
                    )}
                </button>
            </div>
        </form>
    );
}
