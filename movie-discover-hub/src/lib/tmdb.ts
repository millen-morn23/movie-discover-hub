import type { Movie, MovieDetail } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
  return res.json();
}

export async function getPopularMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  return tmdbFetch("/movie/popular", { page: String(page) });
}

export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  return tmdbFetch("/search/movie", { query, page: String(page) });
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "videos" });
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function backdropUrl(path: string | null): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/w1280${path}`;
}
