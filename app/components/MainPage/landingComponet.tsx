"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { OmdbMovie } from "@/app/interfaces/OmdbMovie"; // adjust path if needed

export default function LandingComponent() {
  const [movie, setMovie] = useState<OmdbMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `/api/Omdb/get-content?title=The Fantastic Four: First Steps`
        );
        const data: OmdbMovie = await res.json();
        if (data.Response === "True") {
          setMovie(data);
        }
      } catch (err) {
        console.error("Failed to load movie", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);

  return (
    <section className="w-full px-4 py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Discover What to Watch Next
        </h1>
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
          <Link href="/about">
            <span className="inline-block border border-blue-500 text-blue-500 px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 hover:text-white transition">
              Learn More
            </span>
          </Link>
        </div>

        {!loading && movie && (
          <div className="mt-8 p-6 rounded-xl bg-gray-800 shadow-lg flex flex-col items-center sm:flex-row text-left gap-6 max-w-3xl mx-auto">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-40 h-auto rounded-lg shadow"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                {movie.Title} ({movie.Year})
              </h2>
              <p className="text-sm text-gray-400 mb-2 italic">
                {movie.Genre} | Rated {movie.Rated}
              </p>
              <p className="text-gray-300 text-sm">{movie.Plot}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
