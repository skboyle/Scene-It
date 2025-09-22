import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { WatchedMovie } from "@/types";
import { MovieList } from "@/components/MovieList";
import { MovieDetails } from "@/components/MovieDetails";
import { WatchedSummary } from "@/components/WatchedSummary";
import { WatchedList } from "@/components/WatchedList";
import { Box } from "@/components/Box";
import { Loader } from "@/components/Loader";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>([], "watched");

  function handleSelectMovie(id: string) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((watched) => {
      const exists = watched.some((m) => m.imdbID === movie.imdbID);
      if (exists) return watched;
      return [...watched, movie];
    });
  }

  function handleDeleteWatched(id: string) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>Popcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies?.length || 0}</strong> results
        </p>
      </nav>

      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <p className="error">❌ {error}</p>}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList 
                watched={watched} 
                onDeletedWatched={handleDeleteWatched} 
                onSelectMovie={handleSelectMovie}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
