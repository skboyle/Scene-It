import { useState, useEffect, useRef } from "react";
import StarRating from "@/components/StarRating";
import { useMovies } from "@/hooks/useMovies";
import { useKey } from "@/hooks/useKey";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

// --- Types ---
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface WatchedMovie extends Movie {
  runtime: number;
  imdbRating: number;
  userRating: number;
  countRatingDecision?: number;
}

const KEY = "ebd2755e";

const average = (arr: number[]): number =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

// --- Main App ---
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
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id: string) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
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
              <WatchedList watched={watched} onDeletedWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// --- Helper Components ---
interface ErrorMessageProps {
  message: string;
}
function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="error">
      <span>❌ </span>
      {message}
    </p>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

interface NavBarProps {
  children: React.ReactNode;
}
function NavBar({ children }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn</h1>
    </div>
  );
}

interface SearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
function Search({ query, setQuery }: SearchProps) {
  const inputEl = useRef<HTMLInputElement>(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current?.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

interface NumResultsProps {
  movies: Movie[];
}
function NumResults({ movies }: NumResultsProps) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}

interface MainProps {
  children: React.ReactNode;
}
function Main({ children }: MainProps) {
  return <main className="main">{children}</main>;
}

interface BoxProps {
  children: React.ReactNode;
}
function Box({ children }: BoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
}
function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

interface MovieProps {
  movie: Movie;
  onSelectMovie: (id: string) => void;
}
function Movie({ movie, onSelectMovie }: MovieProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      {!imgError ? (
        <img src={movie.Poster} alt={`${movie.Title} poster`} onError={() => setImgError(true)} />
      ) : (
        <div className="missing">Image not found</div>
      )}
      <h3>{movie.Title}</h3>
    </li>
  );
}

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
}
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Partial<Movie & { Runtime: string; imdbRating: string; Plot: string; Released: string; Actors: string; Director: string; Genre: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | "">("");
  const [imgError, setImgError] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const { Title: title, Poster: poster, Year: year, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie;

  function handleAdd() {
    if (!title || !poster || !runtime || !imdbRating) return;

    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      title,
      year: year ?? "",
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
      countRatingDecision: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (title) document.title = `${title} | Popcorn!`;
    return () => {
      document.title = "Popcorn!";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            {!imgError ? (
              <img src={poster} alt={`${title} poster`} onError={() => setImgError(true)} />
            ) : (
              <div className="missing">Image not found</div>
            )}

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDb Rating
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
                <p>
                  You rated this movie {watchedUserRating} stars ⭐️
                </p>
              )}
            </div>

            <p>Synopsis: <em>{plot}</em></p>
            <p>Starring: {actors}</p>
            <p>Director: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

interface WatchedSummaryProps {
  watched: WatchedMovie[];
}
function WatchedSummary({ watched }: WatchedSummaryProps) {
  const avgImdbRating = average(watched.map((m) => m.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((m) => m.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span> <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span> <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span> <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span> <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

interface WatchedListProps {
  watched: WatchedMovie[];
  onDeletedWatched: (id: string) => void;
}
function WatchedList({ watched, onDeletedWatched }: WatchedListProps) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span> <span>{movie.imdbRating.toFixed(1)}</span>
            </p>
            <p>
              <span>🌟</span> <span>{movie.userRating.toFixed(1)}</span>
            </p>
            <p>
              <span>⏳</span> <span>{movie.runtime.toFixed(0)} min</span>
            </p>
            <button className="btn-delete" onClick={() => onDeletedWatched(movie.imdbID)}>🅧</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface ToggleButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function ToggleButton({ isOpen, setIsOpen }: ToggleButtonProps) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
