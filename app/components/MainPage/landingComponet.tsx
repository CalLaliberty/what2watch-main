"use client";

// LandingComponent.tsx
// React imports
import React from "react";
import Link from "next/link";

// Component Imports
import TrendingNow from "./trendingNow";
import { MovieSearchBar } from "@/app/ui/mainSearchBar";
export default function LandingComponent() {
  return (
    <>
      <section className="w-full px-4 py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Discover What to Watch Next
          </h1>
          <MovieSearchBar />
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            What2Watch helps you find the perfect movie or TV show to stream,
            rent, or buy — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link href="/discover">
              <span className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition">
                Start Exploring
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TrendingNow component rendered outside of the section styling */}
      <TrendingNow />
    </>
  );
}
