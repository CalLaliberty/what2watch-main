"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// React Icons
import { FiInfo, FiCompass } from "react-icons/fi";
// UI Imports
import { MainSearchBar } from "@/app/ui/mainSearchBar";

export default function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar flex items-center justify-between px-4 py-2">
      {/* Left: Logo */}
      <div className="logo flex-shrink-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 mx-4">
        <MainSearchBar />
      </div>

      {/* Right: Desktop menu links */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link
          href="/about"
          className="flex items-center gap-1 text-gray-100 hover:text-gray-300 transition"
        >
          <FiInfo className="text-3xl transition hover:text-red-600 hover:drop-shadow-[0_0_20px_rgba(229,9,20,0.6)]" />
        </Link>
        <Link
          href="/discover"
          className="flex items-center gap-1 text-gray-100 hover:text-gray-300 transition"
        >
          <FiCompass className="text-3xl transition hover:text-red-600 hover:drop-shadow-[0_0_20px_rgba(229,9,20,0.6)]" />
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden ml-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6 text-gray-100"
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
        <div
          className="absolute top-14 left-0 w-full text-gray-100 border-t border-gray-700 md:hidden z-20 mt-6"
          style={{
            background: "linear-gradient(to bottom right, #0d1b2a, #1b263b)",
          }}
        >
          <ul className="flex flex-col items-center space-y-2 py-4">
            <li>
              <Link
                href="/"
                className="block hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center gap-2 hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FiInfo className="text-lg" />
                About
              </Link>
            </li>
            <li>
              <Link
                href="/discover"
                className="flex items-center gap-2 hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                <FiCompass className="text-lg" />
                Discover
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
