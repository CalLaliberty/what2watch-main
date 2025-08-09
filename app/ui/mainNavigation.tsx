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
      className="border-b border-gray-700 px-4 py-2 flex items-center justify-between text-gray-100"
      style={{
        background: "linear-gradient(to bottom right, #0d1b2a, #1b263b)",
      }}
    >
      {/* Logo placeholder */}
      <div className="w-[65px] h-[65px] rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
        <Image
          src="/images/What2WatchLogo-RMBG.png"
          alt="Logo"
          width={65}
          height={65}
          className="object-contain"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li>
          <Link
            href="/"
            className="text-gray-100 hover:text-gray-300 transition"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-gray-100 hover:text-gray-300 transition"
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
        <ul
          className="absolute top-14 left-0 w-full text-gray-100 border-t border-gray-700 flex flex-col items-center md:hidden z-10 mt-6"
          style={{
            background: "linear-gradient(to bottom right, #0d1b2a, #1b263b)",
          }}
        >
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
      )}
    </nav>
  );
}
