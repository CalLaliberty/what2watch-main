// pages/api/tmdb/trending.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.TMDB;
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch TMDB data" });
    }

    const data = await response.json();

    // ✅ only return the array of results
    return res.status(200).json(data.results);
  } catch (error) {
    console.error("Error fetching TMDB trending data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
