import { useState, useEffect } from "react";

const KEY = import.meta.env.VITE_OMDB_API_KEY;

export interface MovieDetail {
  Title: string;
  Poster: string;
  Year: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
}

export function useMovieDetails(selectedId: string) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    if (selectedId) getMovieDetails();
  }, [selectedId]);

  return { movie, isLoading };
}
