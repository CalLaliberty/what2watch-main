// pages/api/Omdb/get-content.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = req.query;

  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const apiKey = process.env.OMDB;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`
    );

    if (!response.ok) {
      res.status(500).json({ error: "Failed to fetch from OMDB" });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Unexpected error" });
  }
}
