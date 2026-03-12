import { useState, useCallback } from "react";
import type { Movie } from "@/types/movie";

const STORAGE_KEY = "movie-explorer-favorites";

function loadFavorites(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  const save = (movies: Movie[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    setFavorites(movies);
  };

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.some((m) => m.id === id), [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
