import type { NextApiRequest, NextApiResponse } from "next";

const OMDB_API_KEY = process.env.OMDB;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search } = req.query;

  if (!search || typeof search !== "string") {
    return res.status(400).json({ error: "Missing or invalid search query" });
  }

  if (!OMDB_API_KEY) {
    return res.status(500).json({ error: "OMDB API key not configured" });
  }

  try {
    const omdbRes = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
        search
      )}&type=movie`
    );

    if (!omdbRes.ok) {
      return res
        .status(omdbRes.status)
        .json({ error: "Failed to fetch from OMDB" });
    }

    const data = await omdbRes.json();

    if (data.Response === "False") {
      return res.status(200).json({ Search: [] });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("OMDB API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
