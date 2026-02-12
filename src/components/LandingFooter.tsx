"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, Mail, ArrowRight, Link2 } from "lucide-react";

export default function LandingFooter() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
                                <Link2 className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-gray-900">
                                Linqs
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The intelligent way to organize your digital life.
                            Save, categorize, and access your favorite links from anywhere.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            {["Features", "Integrations", "Pricing", "Changelog", "Docs"].map((item) => (
                                <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            {["About", "Blog", "Careers", "Customers", "Brand"].map((item) => (
                                <li key={item}><a href="#" className="hover:text-black transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-gray-900 mb-6">Stay updated</h4>
                        <p className="text-sm text-gray-500 mb-4">
                            Subscribe to our newsletter for the latest updates and tips.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-black focus:ring-black"
                            />
                            <button className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Abstract Technologies. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-black transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
