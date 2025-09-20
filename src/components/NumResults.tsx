import { Movie } from "@/App";

interface NumResultsProps {
  movies: Movie[];
}
export function NumResults({ movies }: NumResultsProps) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}
