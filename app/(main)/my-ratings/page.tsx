// page with user ratings

"use client"; // client-side rendering

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

// Movie object from backend scheme
interface RatedMovie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
  user_rating: number;
}

export default function MyRatingsPage() {
  const { data: session, status } = useSession();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRatings = async () => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ratings"); // proxy api call - fetching ratings
      
      if (!res.ok) throw new Error("Failed to fetch ratings"); // backend error
      
      const data = await res.json(); // error during data fetching
      setRatedMovies(data);
    } catch (err) {
      console.error(err);
      setError("Could not load your ratings.");
    } finally {
      setIsLoading(false);
    }
  };

  // user status handling
  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      fetchRatings();
    } else {
      setRatedMovies([]); 
      setIsLoading(false);
    }
  }, [session?.user?.email, status]); 

  // page content
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Ratings</h2>

      {isLoading ? ( // loading
        <div className="text-gray-500 py-10 text-center">Loading your collection...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          {ratedMovies.length === 0 ? ( // no rated movies yet
            <div className="text-gray-400 text-center py-20">
              {status === "authenticated" 
                ? "You haven't rated any movies yet. Go explore and click the Heart!"
                : "Please log in to see your ratings."}
            </div>
          ) : ( // rated movies grid
            <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
              {ratedMovies.map((movie) => (
                 <div key={movie.id} className="relative group">
                   <MovieCard 
                      {...movie} 
                      onRatingChange={() => fetchRatings()}
                   />
                 </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}