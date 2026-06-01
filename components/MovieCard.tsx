// component of movie card with poster, title, rating handling

"use client"; // client-side rendering

import { useState, useEffect, MouseEvent } from "react";
import { Heart, HeartOff, Star, Trash2, Lightbulb, StarOff, Ban } from "lucide-react"; // icons
import Link from "next/link";
import Image from "next/image";

// Movie object from backend scheme
interface MovieProps {
  id: number;
  title: string;
  poster: string;
  imdb_rating?: number;
  user_rating?: number | null;
  ignore?: boolean;
  onRatingChange?: () => void;
  onExplain?: () => void;
  onUnignore?: (id: number) => void;
  onHide?: (id: number) => void;
  onNegativeFeedback?: (id: number) => void;
}

export default function MovieCard({
  id,
  title,
  poster,
  user_rating: initialUserRating,
  ignore,
  onRatingChange,
  onExplain,
  onUnignore,
  onHide,
  onNegativeFeedback
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

  // deleting rating handler (also used to unhide/unblock by removing the -1 rating)
  const handleDeleteRating = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsUpdating(true);
    const previousRating = myRating;

    try {
      setMyRating(undefined);

      // call to proxy api - deleting a rating
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

  // hiding movie handler
  const handleHide = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUpdating(true);
    
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: id, rating: -1 }),
      });

      const res = await fetch(`/api/ratings/${id}/ignore`, {
        method: "PATCH",
        body: JSON.stringify({ ignore: true }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to ignore movie");

      if (onHide) {
        onHide(id);
      } else if (onRatingChange) {
        onRatingChange();
      }
      
    } catch (err) {
      console.error("Failed to hide/ignore movie:", err);
      alert("Could not hide the movie.");
    } finally {
      setIsUpdating(false);
    }
  };

  // negative feedback handling
  const handleNegativeFeedback = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsUpdating(true);
    
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id: id, rating: -1 }),
      });

      const res = await fetch(`/api/ratings/${id}/ignore`, {
        method: "PATCH",
        body: JSON.stringify({ ignore: false }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to update ignore flag");

      if (onNegativeFeedback) {
        onNegativeFeedback(id);
      } else if (onRatingChange) {
        onRatingChange();
      }
      
    } catch (err) {
      console.error("Failed to incorporate negative feedback:", err);
      alert("Could not incorporate negative feedback on a movie.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isNegativeRating = myRating === -1;
  const isHidden = isNegativeRating && ignore === true;
  const isBlocked = isNegativeRating && ignore === false;
  const isIgnored = ignore === true && !isNegativeRating;
  const isRated = myRating !== undefined && myRating !== null && myRating > 0;
  

  // content
  return (
    <div className="movie-card flex flex-col gap-2 w-48 group relative">
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

          <div className="absolute top-2 left-2 z-30 flex items-start gap-1.5">
            
            {/* unhide button */}
            {isHidden && (
              <button 
                onClick={handleDeleteRating}
                disabled={isUpdating}
                className="flex items-center gap-1.5 p-1.5 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-gray-400 hover:text-gray-100 rounded-full shadow-md transition-all overflow-hidden group/unignore disabled:opacity-50"
                title="Unhide movie"
              >
                <HeartOff className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium pr-1 hidden group-hover/unignore:block whitespace-nowrap">
                  Unhide
                </span>
              </button>
            )}

            {/* unblock button */}
            {isBlocked && (
              <button 
                onClick={handleDeleteRating}
                disabled={isUpdating}
                className="flex items-center gap-1.5 p-1.5 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-gray-400 hover:text-gray-100 rounded-full shadow-md transition-all overflow-hidden group/unignore disabled:opacity-50"
                title="Unblock movie"
              >
                <Ban className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium pr-1 hidden group-hover/unignore:block whitespace-nowrap">
                  Unblock
                </span>
              </button>
            )}

            {/* unignore button */}
            {isIgnored && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onUnignore) onUnignore(id);
                }}
                className="flex items-center gap-1.5 p-1.5 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-gray-400 hover:text-gray-100 rounded-full shadow-md transition-all overflow-hidden group/unignore"
                title="Restore to recommendations"
              >
                <StarOff className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium pr-1 hidden group-hover/unignore:block whitespace-nowrap">
                  Unignore
                </span>
              </button>
            )}

            {/* explain button */}
            {onExplain && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onExplain();
                }}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                title="Explain recommendation"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="absolute top-2 right-2 z-30 flex flex-col items-end gap-1.5">

            {/* current rating if available */}
            {isRated && (
              <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-white text-white" />
                {myRating}
              </div>
            )}

            {/* negative feedback button - only showed if not rated */}
            {!isRated && !isNegativeRating && (
              <button 
                onClick={handleNegativeFeedback}
                disabled={isUpdating}
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md disabled:opacity-50"
                title="Block similar movies"
              >
                <Ban className="w-4 h-4 text-white hover:text-red-400 transition-colors" />
              </button>
            )}
          </div>

          {/* hover rating adding */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
            
            {/* dynamic text description of rating */}
            <span className={`text-sm font-bold mb-2 transition-colors ${
              hoverRating > 0 ? "text-yellow-400" : "text-white"
            }`}>
              {hoverRating > 0 
                ? getRatingLabel(hoverRating) 
                : isNegativeRating 
                  ? "Change rating?" 
                  : "What's your rating?"}
            </span>

            {/* stars */}
            <div 
              className="flex flex-wrap justify-center gap-0.4 mb-3" 
              onMouseLeave={() => setHoverRating(0)}
            >
              {[...Array(10)].map((_, i) => {
                const starValue = i + 1;
                const activeRating = myRating && myRating > 0 ? myRating : 0;
                const isActive = starValue <= (hoverRating || activeRating);
                
                return (
                  <button
                    key={starValue}
                    aria-label={`Rate ${starValue} stars`}
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
          disabled={isUpdating}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
          title="Hide Movie"
        >
          <HeartOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}