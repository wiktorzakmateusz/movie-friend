// component of movie card with poster, title, rating handling

"use client"; // client-side rendering

import { useState, useEffect, MouseEvent } from "react";
import { Heart, HeartOff, Star, Trash2 } from "lucide-react"; // icons
import Link from "next/link";
import Image from "next/image";

// Movie object from backend scheme
interface MovieProps {
  id: number;
  title: string;
  poster: string;
  imdb_rating?: number;
  user_rating?: number | null;
  onRatingChange?: () => void;
}

export default function MovieCard({
  id,
  title,
  poster,
  user_rating: initialUserRating,
  onRatingChange,
}: MovieProps) {
  const [myRating, setMyRating] = useState<number | undefined>(
    initialUserRating === null ? undefined : initialUserRating
  );
  
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMyRating(initialUserRating === null ? undefined : initialUserRating);
  }, [initialUserRating]);

  // helper to get text label based on score
  const getRatingLabel = (score: number) => {
    if (score <= 2) return "Very Bad";
    if (score <= 4) return "Bad";
    if (score <= 6) return "Average";
    if (score <= 8) return "Good";
    return "Very Good";
  };

  // adding rating handler
  const handleRate = async (e: MouseEvent, score: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUpdating(true);
    const previousRating = myRating;
    
    try {
      setMyRating(score);
      
      // call to proxi api - adding a rating
      await fetch("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ movie_id: id, rating: score }),
      });
      if (onRatingChange) onRatingChange();
    } catch (error) {
      console.error(error);
      setMyRating(previousRating);
    } finally {
      setIsUpdating(false);
    }
  };

  // deleting rating handler
  const handleDeleteRating = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsUpdating(true);
    const previousRating = myRating;

    try {
      setMyRating(undefined);

      // call to proxi api - deleting a rating
      const res = await fetch(`/api/ratings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete rating");
      if (onRatingChange) onRatingChange();
    } catch (error) {
      console.error(error);
      setMyRating(previousRating);
      alert("Could not remove rating.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // placeholder for wishlist
  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Wishlist functionality coming soon");
  };

  // placeholder for movie hiding
  const handleHide = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hide movie functionality coming soon");
  };

  const isRated = myRating !== undefined && myRating !== null;

  // content
  return (
    <div className="flex flex-col gap-2 w-48 group relative">
      {/* link to the movie page */}
      <Link href={`/movie/${id}`} className="block relative cursor-pointer"> 
        <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-200">
          
          {/* poster */}
          {poster && poster !== "N/A" ? (
            <Image
              src={poster}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
              No Poster
            </div>
          )}

          {/* current rating if available */}
          {isRated && (
            <div className="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-white text-white" />
              {myRating}
            </div>
          )}

          {/* hover rating adding */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
            
            {/* dynamic text description of rating */}
            <span className={`text-sm font-bold mb-2 transition-colors ${
              hoverRating > 0 ? "text-yellow-400" : "text-white"
            }`}>
              {hoverRating > 0 
                ? getRatingLabel(hoverRating) 
                : "What's your rating?"}
            </span>

            {/* stars */}
            <div 
              className="flex flex-wrap justify-center gap-0.4 mb-3" 
              onMouseLeave={() => setHoverRating(0)}
            >
              {[...Array(10)].map((_, i) => {
                const starValue = i + 1;
                const isActive = starValue <= (hoverRating || myRating || 0);
                
                return (
                  <button
                    key={starValue}
                    onClick={(e) => handleRate(e, starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    disabled={isUpdating}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isActive
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* remove rating button */}
            {isRated && (
              <button
                onClick={handleDeleteRating}
                disabled={isUpdating}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-full transition"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>
        </div>
      </Link>

      <p className="font-medium text-center truncate px-1 text-gray-800" title={title}>
        {title}
      </p>

      {/* action buttons: wishlist & hide */}
      <div className="flex justify-center gap-4 mt-1">
        <button
          onClick={handleWishlist}
          className="p-2 rounded-full text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition"
          title="Add to Wishlist (Coming Soon)"
        >
          <Heart className="w-5 h-5" />
        </button>

        <button
          onClick={handleHide}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          title="Hide Movie (Coming Soon)"
        >
          <HeartOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}