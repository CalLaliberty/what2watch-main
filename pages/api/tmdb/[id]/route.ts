import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.TMDB!;
  const { id } = params;

  let detailsRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
  );

  let isMovie = true;

  if (detailsRes.status === 404) {
    detailsRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    isMovie = false;
  }

  if (!detailsRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch details", id },
      { status: 500 }
    );
  }

  const data = await detailsRes.json();
  return NextResponse.json({ ...data, isMovie });
}
