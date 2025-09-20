export interface Movie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  imdbRating: number;
  runtime: number;
  plot?: string;
  released?: string;
  actors?: string;
  director?: string;
  genre?: string;
  userRating?: number;
}

export interface WatchedMovie extends Movie {
  userRating: number;
  countRatingDecision?: number;
}