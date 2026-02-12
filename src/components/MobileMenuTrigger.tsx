"use client";

import { LayoutDashboard, Settings } from "lucide-react";

interface MobileMenuTriggerProps {
    icon: "dashboard" | "settings";
}

export default function MobileMenuTrigger({ icon }: MobileMenuTriggerProps) {
    const Icon = icon === "dashboard" ? LayoutDashboard : Settings;

    return (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
                className="h-14 w-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
                <Icon className="w-6 h-6" />
            </button>
        </div>
    );
}
