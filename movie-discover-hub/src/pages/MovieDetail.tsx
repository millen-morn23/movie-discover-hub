import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Clock, Calendar, Heart, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { getMovieDetail, posterUrl, backdropUrl } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types/movie";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(Number(id)),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (isError || !movie)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        <p className="text-lg">Movie not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Go back
        </Link>
      </div>
    );

  const trailer = movie.videos?.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const fav = isFavorite(movie.id);
  const asMovie: Movie = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    overview: movie.overview,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    genre_ids: movie.genres.map((g) => g.id),
    popularity: movie.popularity,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-[40vh] w-full overflow-hidden sm:h-[50vh]">
          <img
            src={backdropUrl(movie.backdrop_path)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4">
        <div className={`${movie.backdrop_path ? "-mt-32" : "pt-8"} relative z-10`}>
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to discover
          </Link>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Poster */}
            <div className="w-full flex-shrink-0 md:w-72">
              <img
                src={posterUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl shadow-primary/10"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">{movie.title}</h1>
                {movie.tagline && (
                  <p className="mt-1 text-sm italic text-muted-foreground">{movie.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  {movie.vote_average.toFixed(1)}
                </span>
                {movie.runtime && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {movie.runtime} min
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {movie.release_date?.slice(0, 4)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge key={g.id} variant="secondary" className="rounded-lg">
                    {g.name}
                  </Badge>
                ))}
              </div>

              <p className="leading-relaxed text-muted-foreground">{movie.overview}</p>

              <Button
                onClick={() => (fav ? removeFavorite(movie.id) : addFavorite(asMovie))}
                variant={fav ? "default" : "outline"}
                className="gap-2 rounded-xl"
              >
                <Heart className={`h-4 w-4 ${fav ? "fill-primary-foreground" : ""}`} />
                {fav ? "In Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </div>

          {/* Trailer */}
          {trailer && (
            <div className="mt-12 pb-12">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Play className="h-5 w-5 text-primary" /> Trailer
              </h2>
              <div className="aspect-video overflow-hidden rounded-xl border border-border/50">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
