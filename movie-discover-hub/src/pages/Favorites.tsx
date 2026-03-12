import { Heart, Film } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import MovieCard from "@/components/MovieCard";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites, removeFavorite, isFavorite, addFavorite } = useFavorites();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Favorites</h1>
        <span className="rounded-lg bg-secondary px-2.5 py-0.5 text-sm text-secondary-foreground">
          {favorites.length}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Film className="mb-3 h-10 w-10" />
          <p className="text-lg font-medium">No favorites yet</p>
          <p className="mb-4 text-sm">Start adding movies you love!</p>
          <Link to="/" className="text-primary hover:underline">
            Discover movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {favorites.map((movie) => (
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
      )}
    </div>
  );
}
