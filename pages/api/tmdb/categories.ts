import type { NextApiRequest, NextApiResponse } from "next";
import type { TmdbMovie } from "@/app/interfaces/TmdbMovie";
import type { TmdbSeries } from "@/app/interfaces/TmdbSeries";

const TMDB_API_KEY = process.env.TMDB;
const BASE_URL = "https://api.themoviedb.org/3";

// Each category now has a path + type
const categories: Record<
  string,
  { path: string; type: "movie" | "tv" | "all" }
> = {
  "Trending Now": { path: "/trending/all/week", type: "all" },
  "Top Rated Movies": { path: "/movie/top_rated", type: "movie" },
  "Top Rated TV Shows": { path: "/tv/top_rated", type: "tv" },
  "Popular Movies": { path: "/movie/popular", type: "movie" },
  "Popular TV Shows": { path: "/tv/popular", type: "tv" },
  "New Releases": { path: "/movie/now_playing", type: "movie" },
  "Anime & Animated TV Shows": { path: "/discover/tv", type: "tv" },
  "Action & Adventure": { path: "/discover/movie", type: "movie" },
  Comedy: { path: "/discover/movie", type: "movie" },
  "Crime & Thriller": { path: "/discover/movie", type: "movie" },
  Documentaries: { path: "/discover/movie", type: "movie" },
  "Family & Kids": { path: "/discover/movie", type: "movie" },
  Horror: { path: "/discover/movie", type: "movie" },
  Romance: { path: "/discover/movie", type: "movie" },
  "Sci-Fi & Fantasy": { path: "/discover/movie", type: "movie" },
};

type TmdbItem = TmdbMovie | TmdbSeries;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, TmdbItem[]> | { error: string }>
) {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB API key not configured" });
  }

  try {
    const results: Record<string, TmdbItem[]> = {};

    await Promise.all(
      Object.entries(categories).map(async ([title, cat]) => {
        let url = `${BASE_URL}${cat.path}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

        // Genre filters
        switch (title) {
          case "Anime & Animated TV Shows":
            url += "&with_genres=16&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Action & Adventure":
            url +=
              "&with_genres=28,12&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Comedy":
            url += "&with_genres=35&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Crime & Thriller":
            url +=
              "&with_genres=80,53&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Documentaries":
            url += "&with_genres=99&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Family & Kids":
            url +=
              "&with_genres=10751&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Horror":
            url += "&with_genres=27&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Romance":
            url +=
              "&with_genres=10749&sort_by=popularity.desc&vote_count.gte=50";
            break;
          case "Sci-Fi & Fantasy":
            url +=
              "&with_genres=878,14&sort_by=popularity.desc&vote_count.gte=50";
            break;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${title}`);

        const data = (await response.json()) as { results: TmdbItem[] };

        // Set correct media_type for each item
        const resultsWithType: TmdbItem[] = data.results.map((item) => {
          // If category is "all", keep item's original media_type or default to "movie"
          if (cat.type === "all") {
            return {
              ...item,
              media_type: item.media_type || "movie",
            } as TmdbItem;
          }
          // If category is "movie", cast as TmdbMovie and set media_type to "movie"
          if (cat.type === "movie") {
            return {
              ...item,
              media_type: "movie",
            } as TmdbMovie;
          }
          // If category is "tv", cast as TmdbSeries and set media_type to "tv"
          return {
            ...item,
            media_type: "tv",
          } as TmdbSeries;
        });

        results[title] = resultsWithType;
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}
