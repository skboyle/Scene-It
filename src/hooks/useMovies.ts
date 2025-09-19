import { useEffect, useState } from "react";

const KEY = 'ebd2755e';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface UseMoviesReturn {
  movies: Movie[];
  isLoading: boolean;
  error: string;
}

export function useMovies(query: string): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (query.length < 3) return;

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong with fetching the movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("No movies found.");

        const uniqueMovies: Movie[] = Array.from(
            new Map(data.Search.map((m: Movie) => [m.imdbID, m])).values()
        );

        setMovies(uniqueMovies || []);
        setError("");
        } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.name !== "AbortError") {
            setError(err.message);
            }
        } else {
            setError("An unknown error occurred");
        }
        } finally {
            setIsLoading(false); 
        }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
