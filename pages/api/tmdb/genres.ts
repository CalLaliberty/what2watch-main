// pages/api/tmdb/genres.ts
import type { NextApiRequest, NextApiResponse } from "next";

const TMDB_API_KEY = process.env.TMDB;
const BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query; // "movie" or "tv"

  if (!type || (type !== "movie" && type !== "tv")) {
    return res.status(400).json({ error: "Invalid or missing type" });
  }

  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB API key not configured" });
  }

  try {
    const url = `${BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${type} genres`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch genres", error);
    return res.status(500).json({ error: "Failed to fetch genres" });
  }
}
