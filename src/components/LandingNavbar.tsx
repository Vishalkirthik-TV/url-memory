"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

import { toast } from "sonner";

interface LandingNavbarProps {
    user?: User | null;
}

export default function LandingNavbar({ user: propUser }: LandingNavbarProps) {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(propUser || null);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navItems = ["Features", "Design"];

    useEffect(() => {
        if (propUser) {
            setUser(propUser);
            return;
        }

        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                toast.success("Successfully logged out");
            } else if (event === 'SIGNED_IN' && session) {
                toast.success(`Welcome back, ${session.user.user_metadata?.full_name || session.user.email?.split('@')[0]}!`);
            }
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [propUser]);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-5"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-center h-14">
                {/* Logo Section */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 bg-black rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-black/10">
                            <Link2 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                            Linqs
                        </span>
                    </Link>
                </div>

                {/* Centered Navigation */}
                <nav
                    className="hidden md:flex flex-1 justify-center gap-2 items-center"
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {navItems.map((item, i) => (
                        <Link
                            key={item}
                            href={`/#${item.toLowerCase()}`}
                            onMouseEnter={() => setHoveredIndex(i)}
                            className="relative px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-all rounded-full"
                        >
                            {hoveredIndex === i && (
                                <motion.div
                                    layoutId="nav-highlight"
                                    className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Auth/Profile Section */}
                <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
                    {user ? (
                        <div className="flex items-center gap-3 sm:gap-6">
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Log out
                                </button>
                            </form>
                            <Link href="/dashboard" className="flex items-center gap-3 group">
                                <span className="hidden sm:block text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/login"
                                className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
