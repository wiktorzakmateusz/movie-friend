"use client"; 

import { useState, useEffect } from "react";
import { Heart, HeartOff, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  imdb_rating, 
  user_rating: initialUserRating,
  onRatingChange 
}: MovieProps) {
  
  const [myRating, setMyRating] = useState<number | undefined>(
    initialUserRating === null ? undefined : initialUserRating
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMyRating(initialUserRating === null ? undefined : initialUserRating);
  }, [initialUserRating]);

  const handleRate = async () => {
    setIsUpdating(true);
    try {
      setMyRating(10);
      
      await fetch("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ movie_id: id, rating: 10 }),
      });
      if (onRatingChange) onRatingChange();
    } catch (error) {
      console.error(error);
      setMyRating(undefined);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRating = async () => {
    setIsUpdating(true);
    // 1. Keep track of the old value in case we need to revert
    const previousRating = myRating; 
    
    try {
      // Optimistic update (remove star immediately)
      setMyRating(undefined);
      
      const res = await fetch(`/api/ratings/${id}`, {
        method: "DELETE",
      });

      // 2. CHECK RES.OK! 
      // If the backend says 404 or 401, throw an error to trigger the catch block
      if (!res.ok) {
        throw new Error("Failed to delete rating");
      }

      if (onRatingChange) onRatingChange();
    } catch (error) {
      console.error(error);
      // 3. Revert the UI if it failed
      setMyRating(previousRating); 
      alert("Could not remove rating. You might not be the owner.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isRated = myRating !== undefined && myRating !== null;

  return (
    <div className="flex flex-col gap-2 w-48 group relative">
      
      <Link href={`/movie/${id}`} className="block relative">
        <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-200">
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
            
            {/* Badge Logic */}
            {isRated ? (
                 <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white text-white" />
                    {myRating} (You)
                </div>
            ) : imdb_rating ? (
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {imdb_rating}
                </div>
            ) : null}
        </div>
      </Link>
      
      <p className="font-medium text-center truncate px-1 text-gray-800" title={title}>
        {title}
      </p>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-1">
        <button 
            onClick={handleRate}
            disabled={isUpdating || isRated}
            className={`p-2 rounded-full transition ${
                isRated 
                ? "bg-red-50 text-red-500 cursor-default" 
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title="Rate / Like"
        >
          <Heart className={`w-5 h-5 ${isRated ? "fill-current" : ""}`} />
        </button>
        
        <button 
            onClick={handleDeleteRating}
            disabled={isUpdating || !isRated}
            className={`p-2 rounded-full transition ${
              !isRated 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
            title="Remove Rating"
        >
          <HeartOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}