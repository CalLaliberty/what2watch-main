// pages/api/tmdb/item.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.TMDB;
  const { id, media_type } = req.query;

  if (!id || !media_type) {
    return res
      .status(400)
      .json({ error: "Missing id or media_type query parameter" });
  }

  // TMDB requires media_type to be either 'movie', 'tv', or 'person' for detail endpoints
  if (typeof media_type !== "string" || !["movie", "tv"].includes(media_type)) {
    return res
      .status(400)
      .json({ error: "Invalid media_type, must be 'movie' or 'tv'" });
  }

  const url = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${apiKey}&language=en-US`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch TMDB data for ${media_type} ${id}` });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching TMDB item data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
