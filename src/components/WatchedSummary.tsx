import type { WatchedMovie } from "@/types";

interface WatchedSummaryProps {
  watched: WatchedMovie[];
}

const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export function WatchedSummary({ watched }: WatchedSummaryProps) {
  const avgImdbRating = average(watched.map((m) => m.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((m) => m.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>#️⃣ {watched.length} movies</p>
        <p>⭐️ {avgImdbRating.toFixed(1)}</p>
        <p>🌟 {avgUserRating.toFixed(1)}</p>
        <p>⏳ {avgRuntime.toFixed(0)} min</p>
      </div>
    </div>
  );
}

