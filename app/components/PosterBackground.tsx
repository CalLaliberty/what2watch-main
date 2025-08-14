"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ModifiersPlugin from "gsap/all";

gsap.registerPlugin(ModifiersPlugin);

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

interface TMDBItem {
  id: number;
  poster_path: string | null;
}

export default function PosterBackground({
  speed = 25,
  rows = 4,
}: {
  speed?: number;
  rows?: number;
}) {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [items, setItems] = useState<TMDBItem[]>([]);
  const timelines = useRef<gsap.core.Timeline[]>([]);

  // Fetch trending posters
  useEffect(() => {
    async function fetchPosters() {
      try {
        const res = await fetch("/api/tmdb/categories");
        const data = await res.json();

        // Match API keys exactly
        const trending: TMDBItem[] = data["Trending Now"] || [];
        const topRatedMovies: TMDBItem[] = data["Top Rated Movies"] || [];
        const topRatedTV: TMDBItem[] = data["Top Rated TV Shows"] || [];
        const popularMovies: TMDBItem[] = data["Popular Movies"] || [];
        const popularTV: TMDBItem[] = data["Popular TV Shows"] || [];

        // Merge them together & remove null posters
        const merged = [
          ...trending,
          ...topRatedMovies,
          ...topRatedTV,
          ...popularMovies,
          ...popularTV,
        ].filter((item) => item.poster_path);

        // Remove duplicates
        const unique = Array.from(
          new Map(merged.map((m) => [m.id, m])).values()
        );

        setItems(unique);
      } catch (err) {
        console.error("Failed to fetch posters", err);
      }
    }
    fetchPosters();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    // Kill old timelines
    timelines.current.forEach((tl) => tl.kill());
    timelines.current = [];

    for (let row = 0; row < rows; row++) {
      const container = containerRefs.current[row];
      if (!container) continue;

      container.innerHTML = "";

      const rowItems = [...items, ...items]; // duplicate for seamless scroll
      rowItems.forEach((item) => {
        const img = document.createElement("img");
        img.src = `${IMAGE_BASE_URL}${item.poster_path}`;
        img.alt = "movie poster";
        img.className = "h-full w-auto object-contain flex-shrink-0";
        container.appendChild(img);
      });

      const totalWidth = container.scrollWidth / 2;
      const moveLeft = row % 2 === 0; // even rows move left, odd rows move right

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(container, {
        x: moveLeft ? `-=${totalWidth}` : `+=${totalWidth}`, // alternate direction
        duration: totalWidth / speed,
        ease: "linear",
        modifiers: {
          x: (x: string) => {
            const val = parseFloat(x);
            return moveLeft
              ? `${val % totalWidth}px`
              : `${(val % totalWidth) - totalWidth}px`; // wrap correctly for right
          },
        },
      });

      timelines.current.push(tl);
    }

    return () => timelines.current.forEach((tl) => tl.kill());
  }, [items, speed, rows]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: "1px",
        filter: "blur(1px)", // blur everything inside
        opacity: 0.5, // optional transparency
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            containerRefs.current[i] = el;
          }}
          className="flex h-full will-change-transform"
        />
      ))}
    </div>
  );
}
