"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // <--- 1. Import this
import MovieCard from "@/components/MovieCard";

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
  const { data: session, status } = useSession(); // <--- 2. Get session info
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRatings = async () => {
    // Safety: Do not fetch if no user is logged in
    if (status !== "authenticated") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ratings");
      
      if (!res.ok) throw new Error("Failed to fetch ratings");
      
      const data = await res.json();
      setRatedMovies(data);
    } catch (err) {
      console.error(err);
      setError("Could not load your ratings.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Effect depends on session changes
  useEffect(() => {
    if (status === "loading") return; // Wait for NextAuth to check cookie

    if (status === "authenticated") {
      fetchRatings();
    } else {
      // If unauthenticated (logged out), WIPE the data immediately
      setRatedMovies([]); 
      setIsLoading(false);
    }
    
  // 4. This dependency array is the key fix. 
  // It runs whenever the user's email changes (switching accounts) or status updates.
  }, [session?.user?.email, status]); 

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Ratings</h2>

      {isLoading ? (
        <div className="text-gray-500 py-10 text-center">Loading your collection...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          {ratedMovies.length === 0 ? (
            <div className="text-gray-400 text-center py-20">
              {status === "authenticated" 
                ? "You haven't rated any movies yet. Go explore and click the Heart!"
                : "Please log in to see your ratings."}
            </div>
          ) : (
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