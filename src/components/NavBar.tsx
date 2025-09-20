import { Search } from "./Search";
import { NumResults } from "./NumResults";

import { Movie } from "@/App";

interface NavBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
}

export function NavBar({ query, setQuery, movies }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults movies={movies} />
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
