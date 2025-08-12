"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  mediaType: "movie" | "series";
}

export function MainSearchBar() {
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
        `/api/tmdb/search-content?search=${encodeURIComponent(searchTerm)}`
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

  function clearInput() {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  }

  return (
    <div className="main-searchbar" ref={containerRef}>
      {/* Search Icon */}
      <div className="main-searchbar__icon main-searchbar__icon--left">
        <FiSearch size={20} />
      </div>

      <input
        type="text"
        className="main-searchbar__input"
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
          className="main-searchbar__icon main-searchbar__icon--right"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="main-searchbar__icon main-searchbar__icon--spinner">
          <FiLoader size={20} />
        </div>
      )}

      {showDropdown && (
        <div className="main-searchbar__dropdown">
          {!isLoading && results.length === 0 && (
            <div className="main-searchbar__no-results">No results found</div>
          )}
          <ul>
            {results.map((movie) => (
              <li key={movie.imdbID} className="main-searchbar__result">
                <Link
                  href={`/${movie.mediaType === "movie" ? "movie" : "series"}/${
                    movie.imdbID
                  }`}
                  className="main-searchbar__result-link"
                  onClick={() => setShowDropdown(false)}
                  tabIndex={0}
                >
                  {movie.Poster !== "N/A" ? (
                    <div className="main-searchbar__result-image-wrapper">
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
                    <div className="main-searchbar__result-no-image">N/A</div>
                  )}
                  <div>
                    <p className="main-searchbar__result-title">
                      {movie.Title}
                    </p>
                    <p className="main-searchbar__result-year">{movie.Year}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
