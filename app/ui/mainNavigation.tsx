"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { MainSearchBar } from "@/app/ui/mainSearchBar";

export default function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="logo">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={65}
            height={65}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Search bar - takes most space on desktop */}
      <div className="search-container">
        <MainSearchBar />
      </div>

      {/* Right: Desktop menu links */}
      <div className="menu">
        <Link href="/" className="text-gray-100 hover:text-gray-300 transition">
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-100 hover:text-gray-300 transition"
        >
          About
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="mobile-hamburger"
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

      {/* Mobile Menu + Search */}
      {menuOpen && (
        <div
          className="absolute top-14 left-0 w-full text-gray-100 border-t border-gray-700 md:hidden z-20 mt-6"
          style={{
            background: "linear-gradient(to bottom right, #0d1b2a, #1b263b)",
          }}
        >
          <ul className="flex flex-col items-center space-y-2 py-2">
            <li className="w-full text-center py-2">
              <Link
                href="/"
                className="block hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="w-full text-center py-2">
              <Link
                href="/about"
                className="block hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>

          {/* Mobile Search Bar - full width with padding */}
          <div className="px-4 pb-4">
            <MainSearchBar />
          </div>
        </div>
      )}
    </nav>
  );
}
