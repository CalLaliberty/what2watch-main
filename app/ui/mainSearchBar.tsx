"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export function MovieSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchMovies(searchTerm: string) {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/Omdb/search-content?search=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.Search || []);
    } catch (error) {
      console.error("Failed to fetch movies", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceTimeout.current = setTimeout(() => {
      fetchMovies(query);
      setShowDropdown(true);
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSelect(movie: Movie) {
    setQuery(movie.Title);
    setShowDropdown(false);
    console.log("Selected movie:", movie);
  }

  function clearInput() {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  }

  return (
    <div className="relative w-full mx-auto mb-4" ref={containerRef}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <FiSearch size={20} />
      </div>

      <input
        type="text"
        className="w-full rounded-md border border-gray-600 bg-gray-900 px-10 py-2 pr-10 text-gray-200 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        placeholder="Search for movies or TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length || isLoading) setShowDropdown(true);
        }}
        aria-label="Search movies"
      />

      {/* Clear (X) Icon */}
      {query && (
        <button
          onClick={clearInput}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-10 text-gray-400 animate-spin">
          <FiLoader size={20} />
        </div>
      )}

      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
          {!isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No results found
            </div>
          )}
          <ul>
            {results.map((movie) => (
              <li
                key={movie.imdbID}
                className="cursor-pointer px-4 py-2 hover:bg-blue-600 hover:text-white"
                onClick={() => onSelect(movie)}
              >
                <div className="flex items-center gap-3">
                  {movie.Poster !== "N/A" ? (
                    <div className="relative w-14 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-gray-700">
                      <Image
                        src={movie.Poster}
                        alt={movie.Title}
                        fill
                        style={{ objectFit: "cover" }}
                        priority={false}
                        sizes="(max-width: 640px) 56px, 80px"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-20 flex-shrink-0 rounded-sm bg-gray-600 flex items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-200">{movie.Title}</p>
                    <p className="text-xs text-gray-400">{movie.Year}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
