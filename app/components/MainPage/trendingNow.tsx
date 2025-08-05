"use client";

import React, { useEffect, useState } from "react";
import { OmdbMovie } from "@/app/interfaces/OmdbMovie"; // adjust path as needed
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const trendingTitles = [
  "The Fantastic Four: First Steps",
  "Ballerina",
  "Mission: Impossible - The Final Reckoning",
  "F1: The Movie",
  "Sinners",
  "Stranger Things",
  "Happy Gilmore 2",
  "Jurassic World: Rebirth",
  "Andor",
  "The White Lotus",
];

export default function TrendingNow() {
  const [movies, setMovies] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const results: OmdbMovie[] = [];

        for (const title of trendingTitles) {
          const res = await fetch(
            `/api/Omdb/get-content?title=${encodeURIComponent(title)}`
          );
          const data: OmdbMovie = await res.json();
          if (data.Response === "True") {
            results.push(data);
          }
        }

        setMovies(results);
      } catch (err) {
        console.error("Failed to fetch trending content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="w-full px-4 py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Trending Now</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Stay updated with the latest trends in movies and TV shows.
        </p>

        {loading ? (
          <p className="text-gray-400 text-center">
            Loading trending titles...
          </p>
        ) : (
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Pagination, Autoplay]}
            className="pb-10"
          >
            {movies.map((movie, index) => (
              <SwiperSlide key={movie.imdbID}>
                <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition hover:scale-105 duration-300 flex flex-col h-[520px]">
                  <img
                    src={
                      movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"
                    }
                    alt={movie.Title}
                    className="w-full h-64 object-cover flex-shrink-0"
                  />
                  <div className="p-5 flex flex-col flex-grow overflow-hidden">
                    <h3 className="text-xl font-bold mb-1 truncate">
                      {index + 1}. {movie.Title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {movie.Year} • {movie.Type}
                    </p>
                    <p className="text-sm text-gray-300 overflow-auto">
                      {movie.Plot}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/trending"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
          >
            View Trending
          </a>
          <a
            href="/popular"
            className="inline-block border border-blue-500 text-blue-500 px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 hover:text-white transition"
          >
            See Popular
          </a>
        </div>
      </div>
    </section>
  );
}
