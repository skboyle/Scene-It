import StarRating from "@/components/StarRating";

interface MovieRatingProps {
  isWatched: boolean;
  userRating: number | "";
  watchedUserRating?: number;
  onRate: (rating: number) => void;
  onAdd: () => void;
}

export function MovieRating({ isWatched, userRating, watchedUserRating, onRate, onAdd }: MovieRatingProps) {
  return (
    <div className="rating">
      {!isWatched ? (
        <>
          <StarRating maxRating={10} size={24} onSetRating={onRate} />
          {userRating > 0 && (
            <button className="btn-add" onClick={onAdd}>Add to list</button>
          )}
        </>
      ) : (
        <p>You rated this movie {watchedUserRating} stars ⭐️</p>
      )}
    </div>
  );
}
