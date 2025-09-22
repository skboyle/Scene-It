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

export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | "">("");
  const [imgError, setImgError] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.some((m) => m.imdbID === selectedId);
  const watchedUserRating = watched.find((m) => m.imdbID === selectedId)?.userRating;

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();

      if (data.Response === "False") {
        console.error("OMDb Error:", data.Error);
        setIsLoading(false);
        return;
      }

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
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        ratings: data.Ratings,
        metascore: data.Metascore,
        imdbVotes: data.imdbVotes,
        type: data.Type,
        dvd: data.DVD,
        boxOffice: data.BoxOffice,
        production: data.Production,
        website: data.Website,
      };

      setMovie(mapped);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (movie?.title) document.title = `${movie.title} | Popcorn!`;
    return () => {
      document.title = "Popcorn!";
    };
  }, [movie?.title]);

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
          <p>{movie.released} &bull; {movie.runtime} min</p>
          <p>{movie.genre}</p>
          <p>{movie.language} • {movie.country}</p>
          <p>Awards: {movie.awards}</p>
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
              {userRating > 0 && <button className="btn-add" onClick={handleAdd}>Add to list</button>}
            </>
          ) : (
            <p>You rated this movie {watchedUserRating} stars ⭐️</p>
          )}
        </div>

        <p>Synopsis: <em>{movie.plot}</em></p>
        <p>Starring: {movie.actors}</p>
        <p>Director: {movie.director}</p>
        <p>Production: {movie.production}</p>
        <p>DVD Release: {movie.dvd}</p>
        <p>Box Office: {movie.boxOffice}</p>
        {movie.website && <p>Website: <a href={movie.website} target="_blank">{movie.website}</a></p>}
        {movie.ratings && movie.ratings.length > 0 && (
          <div>
            <h4>Other Ratings:</h4>
            <ul>
              {movie.ratings.map(r => (
                <li key={r.Source}>{r.Source}: {r.Value}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
