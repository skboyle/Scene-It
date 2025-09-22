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
  language?: string;
  country?: string;
  awards?: string;
  ratings?: { Source: string; Value: string }[];
  metascore?: string;
  imdbVotes?: string;
  type?: string;
  dvd?: string;
  boxOffice?: string;
  production?: string;
  website?: string;
  userRating?: number;
}

export interface WatchedMovie extends Movie {
  userRating: number;
  countRatingDecision?: number;
}
