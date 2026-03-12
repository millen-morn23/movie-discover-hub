import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { posterUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import { GENRES } from "@/types/movie";

interface Props {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const genre = GENRES.find((g) => movie.genre_ids?.includes(g.id))?.name;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)]"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl(movie.poster_path, "w342")}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-background/70 p-2 backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite ? "fill-primary text-primary" : "text-foreground/70"
          }`}
        />
      </button>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold leading-tight">{movie.title}</h3>
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <span>{year}</span>
        </div>
        {genre && (
          <span className="mt-2 inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {genre}
          </span>
        )}
      </div>
    </motion.div>
  );
}
