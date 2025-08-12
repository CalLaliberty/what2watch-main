import type { NextApiRequest, NextApiResponse } from "next";
import { TmdbMovie } from "@/app/interfaces/TmdbMovie";
import { TmdbSeries } from "@/app/interfaces/TmdbSeries";

const TMDB_API_KEY = process.env.TMDB;

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
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        search
      )}&include_adult=false&language=en-US&page=1`
    );

    if (!tmdbRes.ok) throw new Error(`TMDB error: ${tmdbRes.status}`);

    // The TMDB multi-search returns mixed media types
    const tmdbData: { results: (TmdbMovie | TmdbSeries)[] } =
      await tmdbRes.json();

    const results = (tmdbData.results || [])
      .filter(
        (item): item is TmdbMovie | TmdbSeries =>
          item.media_type === "movie" || item.media_type === "tv"
      )
      .map((item) => {
        if (item.media_type === "movie") {
          // item is TmdbMovie here
          return {
            imdbID: String(item.id),
            Title: item.title,
            Year: (item.release_date || "").slice(0, 4),
            Poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "N/A",
            mediaType: "movie",
          };
        } else {
          // item is TmdbSeries here
          return {
            imdbID: String(item.id),
            Title: item.name,
            Year: (item.first_air_date || "").slice(0, 4),
            Poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "N/A",
            mediaType: "series",
          };
        }
      });

    return res.status(200).json({ Search: results });
  } catch (error) {
    console.error("TMDB API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
