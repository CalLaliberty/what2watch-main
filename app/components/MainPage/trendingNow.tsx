"use client";

// TrendingNow.tsx
// React imports
import React, { useEffect, useState } from "react";
import Image from "next/image";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// UI imports
import LoadingSpinner from "@/app/ui/loadingSpinner";

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

export default function TrendingNow() {
  const [movies, setMovies] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/tmdb/trending");
        const data = await res.json();

        if (Array.isArray(data)) {
          setMovies(data);
        } else if (Array.isArray(data.results)) {
          setMovies(data.results);
        } else {
          console.error("Unexpected TMDB response:", data);
          setMovies([]);
        }
      } catch (err) {
        console.error("Failed to fetch trending data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="w-full px-4 pt-0 pb-12 sm:pb-20 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 border-t border-gray-700">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 mt-10">
          Trending Now
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Stay updated with the latest trends in movies and TV shows.
        </p>

        {loading ? (
          <LoadingSpinner />
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
              <SwiperSlide key={movie.id}>
                <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition hover:scale-105 duration-300 flex flex-col h-[520px]">
                  <div className="relative w-full h-64 bg-black flex items-center justify-center">
                    <Image
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={movie.title || movie.name || "Trending Item"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      style={{ objectFit: "contain", objectPosition: "top" }}
                      priority={index < 3}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow overflow-hidden">
                    <h3 className="text-xl font-bold mb-1 truncate">
                      {index + 1}. {movie.title || movie.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2 capitalize">
                      {movie.media_type} •{" "}
                      {movie.release_date || movie.first_air_date || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300 overflow-auto">
                      {movie.first_air_date || movie.release_date
                        ? movie.overview.length > 150
                          ? movie.overview.slice(0, 150) + "..."
                          : movie.overview
                        : "No description available."}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
