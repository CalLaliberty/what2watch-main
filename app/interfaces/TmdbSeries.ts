// interfaces/TmdbSeries.ts
export interface TmdbSeries {
  id: number;
  imdb_id?: string | null;
  name: string;
  original_name?: string;
  overview?: string;
  first_air_date?: string; // YYYY-MM-DD
  episode_run_time?: number[]; // array of episode runtimes in minutes
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
  media_type: "tv";
}
