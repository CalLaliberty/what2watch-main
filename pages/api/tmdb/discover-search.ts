import type { NextApiRequest, NextApiResponse } from "next";

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

const TMDB_API_KEY = process.env.TMDB as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search } = req.query;

  if (!search || typeof search !== "string") {
    return res.status(400).json({ error: "Missing or invalid search query" });
  }

  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB API key not configured" });
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?` +
        `api_key=${TMDB_API_KEY}` +
        `&query=${encodeURIComponent(search)}` +
        `&include_adult=false&language=en-US&page=1`
    );

    if (!tmdbRes.ok) throw new Error(`TMDB error: ${tmdbRes.status}`);

    const tmdbData: { results?: TMDBItem[] } = await tmdbRes.json();

    const results = (tmdbData.results ?? []).filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );

    return res.status(200).json({ Search: results });
  } catch (error) {
    console.error("TMDB API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
