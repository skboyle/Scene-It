import { useState } from "react";

interface MovieHeaderProps {
  title: string;
  poster: string;
  released: string;
  runtime: string;
  genre: string;
  imdbRating: string;
  onClose: () => void;
}

export function MovieHeader({ title, poster, released, runtime, genre, imdbRating, onClose }: MovieHeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <header>
      <button className="btn-back" onClick={onClose}>&larr;</button>
      {!imgError ? (
        <img src={poster} alt={`${title} poster`} onError={() => setImgError(true)} />
      ) : (
        <div className="missing">Image not found</div>
      )}
      <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p><span>⭐️</span> {imdbRating} IMDb Rating</p>
      </div>
    </header>
  );
}
