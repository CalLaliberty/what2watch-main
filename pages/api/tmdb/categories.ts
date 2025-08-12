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

// The response for each category can contain movies or series, so type the array elements as either:
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
        results[title] = data.results || [];
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}
