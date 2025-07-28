"use client";

// React imports 
import React, { useState } from "react";
// Nextjs imports 
import Link from "next/link";
import Image from "next/image";

export default function MainNavigation() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            {/* Logo placeholder */}
            <div className="flex items-center">
                <Image src="/What2WatchLogo-removebg.png" alt="Logo" width={65} height={65} />
                {/* <span className="font-bold text-xl text-gray-800">What2Watch</span> */}
            </div>
            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
                <li>
                    <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
                </li>
                <li>
                    <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
                </li>
            </ul>
            {/* Mobile Hamburger */}
            <button
                className="md:hidden flex items-center"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <svg
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {/* Mobile Menu */}
            {menuOpen && (
                <ul className="absolute top-14 left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center md:hidden z-10">
                    <li className="w-full text-center py-2">
                        <Link href="/" className="block text-gray-700 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Home</Link>
                    </li>
                    <li className="w-full text-center py-2">
                        <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>About</Link>
                    </li>
                </ul>
            )}
        </nav>
    );
}