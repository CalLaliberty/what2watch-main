import React from "react";
import Image from "next/image";
import HeroBanner from "./componets/heroBanner";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Details {
  id: number;
  title?: string;
  name?: string; // TV shows use name
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
  runtime?: number; // movies
  episode_run_time?: number[]; // TV shows
  credits: {
    cast: CastMember[];
  };
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const API_KEY = process.env.TMDB!;
  const { id } = await params;

  // Fetch movie details or fallback to TV show
  let detailsRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`,
    { next: { revalidate: 3600 } }
  );

  let isMovie = true;

  if (detailsRes.status === 404) {
    detailsRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`,
      { next: { revalidate: 3600 } }
    );
    isMovie = false;
  }

  if (!detailsRes.ok) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load details for id: {id}
      </div>
    );
  }

  const details: Details = await detailsRes.json();

  const trailer = details.videos.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  const date = isMovie ? details.release_date : details.first_air_date;
  const runtime = isMovie ? details.runtime : details.episode_run_time?.[0];

  return (
    <div className="movie-page">
      <HeroBanner
        backdropPath={details.backdrop_path}
        rating={details.vote_average}
      />
      <main className="movie-details">
        {/* Poster */}
        {details.poster_path && (
          <div className="movie-poster">
            <Image
              src={`https://image.tmdb.org/t/p/w342${details.poster_path}`}
              alt={details.title || details.name || "Poster"}
              width={272} // w342 ratio approx 272x408 (2:3)
              height={408}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}

        {/* Details */}
        <section className="details-text">
          <h1 className="title">{details.title || details.name}</h1>

          <p className="rating">
            ⭐ {details.vote_average.toFixed(1)} / 10 ({details.vote_count}{" "}
            votes)
          </p>

          <p className="genres">
            {details.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="release-runtime">
            {date
              ? new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown release date"}{" "}
            • {runtime ? `${runtime} min` : "Runtime N/A"}
          </p>

          <p className="overview">{details.overview}</p>

          {/* Cast */}
          <div className="cast-section">
            <h2>Main Cast</h2>
            <div className="cast-list">
              {details.credits.cast.slice(0, 5).map((cast) => (
                <div
                  key={cast.id}
                  className="cast-member"
                  title={`${cast.name} as ${cast.character}`}
                >
                  {cast.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                      alt={cast.name}
                      width={112} // w185 ratio approx 112x180 (7:11.25)
                      height={180}
                      className="cast-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <p className="cast-name">{cast.name}</p>
                  <p className="cast-character">{cast.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trailer */}
          {trailer && (
            <div className="trailer-section">
              <h2>Trailer</h2>
              <div className="trailer-video">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${details.title || details.name} Trailer`}
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
