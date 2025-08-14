import type { NextApiRequest, NextApiResponse } from "next";
import type { TmdbMovie } from "@/app/interfaces/TmdbMovie";
import type { TmdbSeries } from "@/app/interfaces/TmdbSeries";

const TMDB_API_KEY = process.env.TMDB;
const BASE_URL = "https://api.themoviedb.org/3";

const categories: Record<string, string> = {
  "Trending Now": "/trending/all/week",
  "Top Rated Movies": "/movie/top_rated",
  "Top Rated TV Shows": "/tv/top_rated",
  "Popular Movies": "/movie/popular",
  "Popular TV Shows": "/tv/popular",
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
      Object.entries(categories).map(async ([title, path]) => {
        const url = `${BASE_URL}${path}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${title}`);

        const data = (await response.json()) as { results: TmdbItem[] };

        // Add media_type manually for non-trending categories
        const resultsWithType: TmdbItem[] = data.results.map((item) => {
          if (title.includes("Movie"))
            return { ...(item as TmdbMovie), media_type: "movie" };
          if (title.includes("TV"))
            return { ...(item as TmdbSeries), media_type: "tv" };
          return item as TmdbItem; // Trending already has media_type
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
