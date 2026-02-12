"use client";

import Link from "next/link";
import { Link2, LayoutDashboard, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        // Desktop default
        if (window.innerWidth >= 768) {
            setIsCollapsed(false);
        }

        const handleToggle = () => setIsCollapsed(prev => !prev);
        window.addEventListener('toggle-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-sidebar', handleToggle);
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: "Bookmarks", href: "/dashboard" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        { icon: HelpCircle, label: "Help & Support", href: "#" },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 80 : 280,
                x: 0
            }}
            className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 shadow-sm
                max-md:w-[280px] max-md:fixed max-md:shadow-2xl
                ${isCollapsed ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'}
            `}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2 overflow-hidden"
                        >
                            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                                <Link2 className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-gray-900 whitespace-nowrap">
                                Linqs
                            </span>
                        </motion.div>
                    )}
                    {isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mx-auto"
                        >
                            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <Link2 className="w-6 h-6" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Collapse Toggle (Desktop) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 h-6 w-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-50 max-md:hidden"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3 text-gray-400" /> : <ChevronLeft className="w-3 h-3 text-gray-400" />}
            </button>

            {/* Mobile Close Button */}
            <button
                onClick={() => setIsCollapsed(true)}
                className="absolute right-4 top-6 p-2 bg-gray-50 rounded-xl md:hidden"
            >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>

            {/* Navigation Links */}
            <nav className="flex-grow px-3 py-6 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${item.label === "Bookmarks"
                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <item.icon className={`w-5 h-5 shrink-0 ${item.label === "Bookmarks" ? "text-indigo-400" : "group-hover:text-indigo-600"}`} />
                        {!isCollapsed && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section: User & Sign Out */}
            <div className="p-4 border-t border-gray-100 space-y-4">
                {!isCollapsed && userEmail && (
                    <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">User</p>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {userEmail.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {userEmail.split('@')[0]}
                            </p>
                        </div>
                    </div>
                )}

                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                    >
                        <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Sign out
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </motion.aside>
    );
}
