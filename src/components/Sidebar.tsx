"use client";

import Link from "next/link";
import { Link2, Bookmark, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
    userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Desktop default
        if (window.innerWidth >= 768) {
            setIsCollapsed(false);
        }

        const handleToggle = () => setIsCollapsed(prev => !prev);
        window.addEventListener('toggle-sidebar', handleToggle);

        // Welcome notification
        if (userEmail && !sessionStorage.getItem('welcome_shown')) {
            toast.success(`Welcome back, ${userEmail.split('@')[0]}!`, {
                description: "You're now logged into Linqs"
            });
            sessionStorage.setItem('welcome_shown', 'true');
        }

        return () => window.removeEventListener('toggle-sidebar', handleToggle);
    }, [userEmail]);

    const menuItems = [
        { icon: Bookmark, label: "Bookmarks", href: "/dashboard" },
        { icon: LayoutGrid, label: "Organize", href: "/dashboard/organize" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];

    // Close sidebar on mobile when a link is clicked
    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            setIsCollapsed(true);
        }
    };

    return (
        <aside
            style={{ width: isCollapsed ? '80px' : '280px' }}
            className={`h-screen bg-white border-r border-gray-100 z-50 flex flex-col transition-[width,transform] duration-200 ease-in-out shadow-sm
                max-md:fixed max-md:left-0 max-md:top-0 max-md:w-[280px]
                ${isCollapsed ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'}
                md:relative
            `}
        >
            {/* Logo Section */}
            <div className="p-6 h-20 flex items-center justify-between">
                <Link
                    href="/"
                    onClick={handleLinkClick}
                    className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isCollapsed ? 'mx-auto' : ''}`}
                >
                    <div className={`bg-black rounded-lg flex items-center justify-center text-white shrink-0 transition-all ${isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}`}>
                        <Link2 className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-lg tracking-tight text-gray-900 whitespace-nowrap animate-in fade-in duration-200">
                            Linqs
                        </span>
                    )}
                </Link>
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
            <nav className="flex-grow px-3 py-6 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${pathname === item.href
                            ? "bg-gray-900 text-white shadow-sm"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <item.icon className={`w-5 h-5 shrink-0 ${pathname === item.href ? "text-indigo-400" : "group-hover:text-indigo-600"}`} />
                        {!isCollapsed && (
                            <span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-200">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section: User & Sign Out */}
            <div className={`p-4 border-t border-gray-100 transition-all ${isCollapsed ? 'items-center' : ''}`}>
                {!isCollapsed && userEmail && (
                    <div className="px-3 py-2 mb-2 animate-in fade-in duration-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">User</p>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                {userEmail.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {userEmail.split('@')[0]}
                            </p>
                        </div>
                    </div>
                )}
                {isCollapsed && userEmail && (
                    <div className="h-10 w-10 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm mb-4">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                )}

                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        {!isCollapsed && (
                            <span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-200">
                                Sign out
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </aside>
    );
}
