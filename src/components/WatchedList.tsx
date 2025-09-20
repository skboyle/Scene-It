import type { WatchedMovie } from "@/types";

interface WatchedListProps {
  watched: WatchedMovie[];
  onDeletedWatched: (id: string) => void;
}

export function WatchedList({ watched, onDeletedWatched }: WatchedListProps) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>⭐️ {movie.imdbRating.toFixed(1)}</p>
            <p>🌟 {movie.userRating.toFixed(1)}</p>
            <p>⏳ {Number.isFinite(movie.runtime) ? `${movie.runtime.toFixed(0)} min` : "N/A"}</p>
            <button className="btn-delete" onClick={() => onDeletedWatched(movie.imdbID)}>🅧</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
