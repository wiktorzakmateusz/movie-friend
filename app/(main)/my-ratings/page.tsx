// page with user ratings

"use client"; // client-side rendering

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { StarOff, Star} from "lucide-react";  // icons

// Movie object from backend scheme
interface RatedMovie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
  user_rating: number;
  ignore?: boolean;
}

export default function MyRatingsPage() {
  const { data: session, status } = useSession();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIgnoredOnly, setShowIgnoredOnly] = useState(false); // state for ignore toggle
  const hasIgnoredMovies = ratedMovies.some(movie => movie.ignore); // checks if any movies are ignored
  
  // toggle filter
  const displayedMovies = showIgnoredOnly 
    ? ratedMovies.filter(movie => movie.ignore) 
    : ratedMovies;

  useEffect(() => {
    if (!hasIgnoredMovies && showIgnoredOnly) {
      setShowIgnoredOnly(false);
    }
  }, [hasIgnoredMovies, showIgnoredOnly]);

  // fetching ratings
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

  // unignoring movie
  const handleUnignore = async (movieId: number) => {
    try {
      const res = await fetch(`/api/ratings/${movieId}/ignore`, {
        method: "PATCH",
        body: JSON.stringify({ ignore: false }), 
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to unignore movie");

      fetchRatings();
    } catch (err) {
      console.error(err);
      alert("Could not unignore the movie.");
    }
  };

  // page content
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-blue-900 text-center md:text-left">
          Here are movies you've rated:
        </h2>

        {/* ignored movies toggle switch */}
        {hasIgnoredMovies && (
          <button
            onClick={() => setShowIgnoredOnly(!showIgnoredOnly)}
            className="flex items-center justify-center w-[220px] gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {showIgnoredOnly ? (
              <Star className="w-4 h-4 text-gray-400" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-400" />
            )}
            
            <span className="text-sm font-medium">
              {showIgnoredOnly ? "Show all movies" : "Show ignored movies"}
            </span>
            
          </button>
        )}
      </div>

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
              {displayedMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard 
                    {...movie} 
                    onRatingChange={() => fetchRatings()}
                    onUnignore={handleUnignore}
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