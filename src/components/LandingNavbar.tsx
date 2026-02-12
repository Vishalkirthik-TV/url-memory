"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link2 } from "lucide-react";

export default function LandingNavbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
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
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">
                        Linqs
                    </span>
                </Link>

                <nav className="hidden md:flex gap-8">
                    {["Features", "Design", "Pricing", "FAQ"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 hover:text-black transition-colors hidden sm:block"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/login"
                        className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
