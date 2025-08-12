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
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  first_air_date?: string;
  episode_run_time?: number[];
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

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const API_KEY = process.env.TMDB!;
  const { id } = await params;

  // Fetch TV show details from TMDB API
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load series details for id: {id}
      </div>
    );
  }

  const details: Details = await res.json();

  const trailer = details.videos.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  const date = details.first_air_date;
  const runtime = details.episode_run_time?.[0];

  return (
    <div className="series-page">
      <HeroBanner
        backdropPath={details.backdrop_path}
        rating={details.vote_average}
      />
      <main className="series-details">
        {/* Poster */}
        {details.poster_path && (
          <div className="series-poster">
            <Image
              src={`https://image.tmdb.org/t/p/w342${details.poster_path}`}
              alt={details.name || "Poster"}
              width={272}
              height={408}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}

        {/* Details */}
        <section className="details-text">
          <h1 className="title">{details.name}</h1>

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
            • {runtime ? `${runtime} min per episode` : "Runtime N/A"}
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
                      width={112}
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
                  title={`${details.name} Trailer`}
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
