"use client";

// React imports
import React, { useState } from "react";
// Nextjs imports
import Link from "next/link";
import Image from "next/image";

export default function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="border-b border-white/30 px-4 py-2 flex items-center justify-between text-white"
      style={{
        background: "linear-gradient(to bottom right, #1884fa, #8ed0ca)",
      }}
    >
      {/* Logo placeholder */}
      <div className="w-[65px] h-[65px] rounded-full bg-white overflow-hidden flex items-center justify-center">
        <Image
          src="/What2WatchLogo-removebg.png"
          alt="Logo"
          width={65}
          height={65}
          className="object-contain"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li>
          <Link href="/" className="text-white hover:text-gray-200 transition">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-white hover:text-gray-200 transition"
          >
            About
          </Link>
        </li>
      </ul>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul
          className="absolute top-14 left-0 w-full bg-gradient-to-br from-blue-600 to-teal-300 text-white border-t border-white/30 flex flex-col items-center md:hidden z-10 mt-6"
          style={{
            background: "linear-gradient(to bottom right, #1884fa, #8ed0ca)",
          }}
        >
          <li className="w-full text-center py-2">
            <Link
              href="/"
              className="block hover:text-gray-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="w-full text-center py-2">
            <Link
              href="/about"
              className="block hover:text-gray-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
