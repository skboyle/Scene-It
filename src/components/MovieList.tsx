import type { Movie } from "../types";

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
}

export function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
          {movie.Poster ? (
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
          ) : (
            <div className="missing">Image not found</div>
          )}
          <h3>{movie.Title}</h3>
        </li>
      ))}
    </ul>
  );
}
