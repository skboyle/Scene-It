// src/components/MovieDetails.tsx
import { useState, useEffect, useRef } from "react";
import type { Movie, WatchedMovie } from "@/types";
import StarRating from "@/components/StarRating";
import { useKey } from "@/hooks/useKey";
import { Loader } from "@/components/Loader";

const KEY = import.meta.env.VITE_OMDB_API_KEY;

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
}

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | "">("");
  const [imgError, setImgError] = useState(false);
  const countRef = useRef(0);

  // count how many times user changes rating
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.some((m) => m.imdbID === selectedId);
  const watchedUserRating = watched.find((m) => m.imdbID === selectedId)?.userRating;

  // Add movie to watched list
  function handleAdd() {
    if (!movie || !movie.title || !movie.poster) return;
    const newWatchedMovie: WatchedMovie = {
      ...movie,
      userRating: Number(userRating),
      countRatingDecision: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  // fetch movie details from OMDb
  useEffect(() => {
    async function getMovieDetails() {
      if (!KEY) {
        console.error("OMDb API key missing!");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();

        if (data.Response === "False") {
          console.error("OMDb Error:", data.Error);
          setMovie(null);
        } else {
          const mapped: Movie = {
            imdbID: data.imdbID,
            title: data.Title,
            year: data.Year,
            poster: data.Poster,
            imdbRating: Number(data.imdbRating) || 0,
            runtime: data.Runtime && data.Runtime !== "N/A" ? parseInt(data.Runtime, 10) : 0,
            plot: data.Plot,
            released: data.Released,
            actors: data.Actors,
            director: data.Director,
            genre: data.Genre,
          };
          setMovie(mapped);
        }
      } catch (err) {
        console.error(err);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();
  }, [selectedId]);

  // update document title
  useEffect(() => {
    if (movie?.title) document.title = `${movie.title} | Popcorn!`;
    return () => {
      document.title = "Popcorn!";
    };
  }, [movie?.title]);

  if (isLoading || !movie) return <Loader />;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        {!imgError ? (
          <img src={movie.poster} alt={`${movie.title} poster`} onError={() => setImgError(true)} />
        ) : (
          <div className="missing">Image not found</div>
        )}
        <div className="details-overview">
          <h2>{movie.title}</h2>
          <p>
            {movie.released} &bull; {movie.runtime} min
          </p>
          <p>{movie.genre}</p>
          <p>
            <span>⭐️</span> {movie.imdbRating} IMDb Rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  Add to list
                </button>
              )}
            </>
          ) : (
            <p>You rated this movie {watchedUserRating} stars ⭐️</p>
          )}
        </div>

        <p>Synopsis: <em>{movie.plot}</em></p>
        <p>Starring: {movie.actors}</p>
        <p>Director: {movie.director}</p>
      </section>
    </div>
  );
}
