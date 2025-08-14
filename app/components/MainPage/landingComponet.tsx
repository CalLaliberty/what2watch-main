"use client";

// LandingComponent.tsx
// React imports
import React from "react";
import Link from "next/link";

// Component Imports
import TrendingNow from "./trendingNow";
import "@/app/components/mainChatApp";
import MainChatApp from "../mainChatApp";
import PosterBackground from "../PosterBackground";
export default function LandingComponent() {
  return (
    <>
      <section className="relative w-full px-10 py-12  container-bg">
        {/* Poster background */}
        <PosterBackground speed={25} rows={4} />

        <div className="relative z-10 max-w-4xl mx-auto text-center bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Discover What to Watch Next
          </h1>
          <p className="text-lg md:text-xl text-gray-300 m-8">
            What2Watch helps you find the perfect movie or TV show to stream,
            rent, or buy — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-5">
            <Link href="/discover">
              <span className="inline-block button px-6 py-3 rounded-lg text-lg font-medium transition">
                Start Exploring
              </span>
            </Link>
          </div>
          <MainChatApp />
        </div>
      </section>

      <TrendingNow />
    </>
  );
}
