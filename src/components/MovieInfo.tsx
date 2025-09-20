interface MovieInfoProps {
  plot: string;
  actors: string;
  director: string;
}

export function MovieInfo({ plot, actors, director }: MovieInfoProps) {
  return (
    <section>
      <p>Synopsis: <em>{plot}</em></p>
      <p>Starring: {actors}</p>
      <p>Director: {director}</p>
    </section>
  );
}
