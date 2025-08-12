// interfaces/TmdbMovie.ts
export interface TmdbMovie {
  id: number;
  imdb_id?: string | null;
  title: string;
  original_title?: string;
  overview?: string;
  release_date?: string; // YYYY-MM-DD
  runtime?: number; // in minutes
  genres?: { id: number; name: string }[];
  status?: string;
  tagline?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  original_language?: string;
  adult?: boolean;
  homepage?: string;
  production_companies?: {
    id: number;
    logo_path?: string | null;
    name: string;
    origin_country: string;
  }[];
  media_type: "movie";
}
