import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Film } from "lucide-react";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import useDebounce from "@/hooks/useDebounce";

export default function Index() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const debouncedQuery = useDebounce(query, 400);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", debouncedQuery],
    queryFn: () =>
      debouncedQuery ? searchMovies(debouncedQuery) : getPopularMovies(),
  });

  const movies = useMemo(() => {
    let list = data?.results || [];

    if (genre !== "all") {
      list = list.filter((m) => m.genre_ids?.includes(Number(genre)));
    }

    switch (sortBy) {
      case "rating":
        list = [...list].sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "date":
        list = [...list].sort(
          (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
        break;
      case "title":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [data, genre, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Discover <span className="text-primary">Movies</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Search, explore, and save your favorite films
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar genre={genre} onGenreChange={setGenre} sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Section label */}
      <div className="mb-6 flex items-center gap-2">
        <Film className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {debouncedQuery ? `Results for "${debouncedQuery}"` : "Popular Movies"}
        </h2>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
          <p className="text-lg font-medium">Failed to load movies</p>
          <p className="text-sm">Check your API key and try again.</p>
        </div>
      )}

      {!isLoading && !isError && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Film className="mb-3 h-10 w-10" />
          <p className="text-lg font-medium">No movies found</p>
          <p className="text-sm">Try a different search or filter.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() =>
                isFavorite(movie.id) ? removeFavorite(movie.id) : addFavorite(movie)
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
