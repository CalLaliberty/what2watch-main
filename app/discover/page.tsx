"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./discover.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

type MediaType = "movie" | "tv";
type Genre = { id: number; name: string };

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids?: number[];
}

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState<MediaType | "all">("all");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | "all">("all");

  const categories = [
    "Trending Now",
    "Top Rated Movies",
    "Top Rated TV Shows",
    "Popular Movies",
    "Popular TV Shows",
    "New Releases",
    "Anime & Animated TV Shows",
    "Action & Adventure",
    "Comedy",
    "Crime & Thriller",
    "Documentaries",
    "Family & Kids",
    "Horror",
    "Romance",
    "Sci-Fi & Fantasy",
  ];

  const [categoryData, setCategoryData] = useState<Record<string, TMDBItem[]>>(
    {}
  );
  const [searchResults, setSearchResults] = useState<TMDBItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Fetch genres
  useEffect(() => {
    async function fetchGenres() {
      try {
        const resMovie = await fetch("/api/tmdb/genres?type=movie");
        const movieGenres = await resMovie.json();

        const resTv = await fetch("/api/tmdb/genres?type=tv");
        const tvGenres = await resTv.json();

        const allGenresMap: Record<number, Genre> = {};
        movieGenres.genres.forEach((g: Genre) => (allGenresMap[g.id] = g));
        tvGenres.genres.forEach((g: Genre) => (allGenresMap[g.id] = g));

        setGenres(Object.values(allGenresMap));
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    }
    fetchGenres();
  }, []);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await fetch("/api/tmdb/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategoryData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch search
  useEffect(() => {
    async function fetchSearch() {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        setLoadingSearch(true);
        const res = await fetch(
          `/api/tmdb/discover-search?search=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        let filteredResults = data.Search || [];
        if (mediaType !== "all") {
          filteredResults = filteredResults.filter(
            (item: TMDBItem) => item.media_type === mediaType
          );
        }
        if (selectedGenre !== "all") {
          filteredResults = filteredResults.filter((item: TMDBItem) =>
            item.genre_ids?.includes(selectedGenre as number)
          );
        }
        setSearchResults(filteredResults);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }
    fetchSearch();
  }, [searchTerm, mediaType, selectedGenre]);

  const handleScroll = (el: HTMLDivElement | null, dir: "left" | "right") => {
    if (!el) return;
    const scrollAmount = dir === "left" ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <main className={styles.container}>
      {/* Filters */}
      <section className={styles.filters}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search movies or TV shows..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as MediaType | "all")}
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <select
          className={styles.filterSelect}
          value={selectedGenre}
          onChange={(e) =>
            setSelectedGenre(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </section>

      {/* Search results or categories */}
      {searchTerm ? (
        <HorizontalSection
          title="Search Results"
          items={searchResults}
          handleScroll={handleScroll}
          loading={loadingSearch}
        />
      ) : (
        categories.map((cat) => (
          <HorizontalSection
            key={cat}
            title={cat}
            items={categoryData[cat] || []}
            handleScroll={handleScroll}
            loading={loadingCategories}
          />
        ))
      )}
    </main>
  );
}

// Drag scroll hook
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = ref.current.scrollLeft;
    ref.current.classList.add(styles.dragging);
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    const delta = e.clientX - startX.current;
    ref.current.scrollLeft = scrollStart.current - delta;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
    if (ref.current) ref.current.classList.remove(styles.dragging);
  };

  return { ref, onMouseDown, onMouseMove, onMouseUpOrLeave };
}

function HorizontalSection({
  title,
  items,
  handleScroll,
  loading,
}: {
  title: string;
  items: TMDBItem[];
  handleScroll: (el: HTMLDivElement | null, dir: "left" | "right") => void;
  loading: boolean;
}) {
  const {
    ref: scrollRef,
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
  } = useDragScroll<HTMLDivElement>();

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.categoryTitle}>{title}</h2>
      <div className={styles.scrollWrapper}>
        <button
          className={`${styles.scrollButton} ${styles.left}`}
          onClick={() => handleScroll(scrollRef.current, "left")}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>

        <div
          className={styles.horizontalScroll}
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
        >
          {loading ? (
            Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
          ) : items.length ? (
            items.map((item) => <Card key={item.id} item={item} />)
          ) : (
            <p>No results.</p>
          )}
        </div>

        <button
          className={`${styles.scrollButton} ${styles.right}`}
          onClick={() => handleScroll(scrollRef.current, "right")}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}

function Card({ item }: { item: TMDBItem }) {
  const title = item.title || item.name || "Untitled";
  const year =
    item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || "N/A";
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : "/images/What2WatchIcon-RMBG.svg";
  const mediaPath = item.media_type === "movie" ? "movie" : "series";

  return (
    <Link href={`/${mediaPath}/${item.id}`} className={styles.card}>
      <Image
        src={posterUrl}
        alt={title}
        width={150}
        height={225}
        className={styles.cardImage}
      />
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardYear}>{year}</div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className={`${styles.card} ${styles.skeletonCard}`}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonYear}></div>
    </div>
  );
}
