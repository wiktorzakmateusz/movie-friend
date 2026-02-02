"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { Play, Heart, HeartOff, Loader2, Star } from "lucide-react";
import Link from "next/link";

interface MovieDetail {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
  plot?: string;
  director?: string;
  actors?: string;
  runtime?: string;
  user_rating?: number | null; // Allow null here
}

export default function MovieDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Add Rating State
  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error("Failed to load movie");
        
        const data = await res.json();
        setMovie(data);
        
        // 2. Initialize rating state from the fetched data
        setMyRating(data.user_rating === null ? undefined : data.user_rating);
      } catch (err) {
        console.error(err);
        setError("Could not load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // 3. Add Rate Handler (Like)
  const handleRate = async () => {
    if (!movie) return;
    setIsUpdating(true);
    try {
      setMyRating(10); // Optimistic UI update
      await fetch("/api/ratings", {
        method: "POST",
        body: JSON.stringify({ movie_id: movie.id, rating: 10 }),
      });
      // Optionally refresh movie data here if needed, but optimistic is fine
    } catch (error) {
      console.error(error);
      setMyRating(undefined); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Add Delete Handler (Unlike)
  const handleDeleteRating = async () => {
    if (!movie) return;
    setIsUpdating(true);
    try {
      setMyRating(undefined); // Optimistic UI update
      await fetch(`/api/ratings/${movie.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      setMyRating(10); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper boolean
  const isRated = myRating !== undefined && myRating !== null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <p className="text-gray-600 mb-6">{error || "Movie not found"}</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          {movie.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Poster & Actions */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col items-center lg:items-start">
              <div className="w-64 h-96 relative rounded-lg shadow-lg overflow-hidden mb-6 bg-gray-200">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Poster</div>
                )}
              </div>
              
              {/* 5. Wire up the buttons */}
              <div className="flex justify-center w-64 gap-4">
                  <button 
                    onClick={handleRate}
                    disabled={isUpdating || isRated}
                    className={`p-4 border rounded-full shadow-sm transition ${
                      isRated 
                        ? "bg-red-50 border-red-100 text-red-500 cursor-default" 
                        : "bg-white border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isRated ? "fill-current" : ""}`} />
                  </button>
                  
                  <button 
                    onClick={handleDeleteRating}
                    disabled={isUpdating || !isRated}
                    className={`p-4 bg-white border border-gray-200 rounded-full shadow-sm transition ${
                      !isRated 
                        ? "text-gray-300 cursor-not-allowed" 
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                  >
                    <HeartOff className="w-6 h-6" />
                  </button>
              </div>
          </div>

          {/* Middle Column: Details */}
          <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium text-gray-900">Year:</span> {movie.year}</p>
                      <p><span className="font-medium text-gray-900">Genre:</span> {movie.genre || "N/A"}</p>
                      <p><span className="font-medium text-gray-900">Duration:</span> {movie.runtime || "N/A"}</p>
                      <p><span className="font-medium text-gray-900">Director:</span> {movie.director || "Unknown"}</p>
                    </div>
                  <div className="flex flex-col items-end gap-3">
                    
                    {/* 6. Use 'myRating' state here instead of 'movie.user_rating' so it updates instantly */}
                    {isRated && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                          <Star className="w-5 h-5 fill-current" /> {myRating}
                        </div>
                        <span className="text-xs text-blue-400 font-medium">Your Rating</span>
                      </div>
                    )}
                    
                    {movie.imdb_rating && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                          <Star className="w-5 h-5 fill-current" /> {movie.imdb_rating}
                        </div>
                        <span className="text-xs text-gray-400">IMDb Rating</span>
                      </div>
                    )}
                  </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm"><span className="font-medium text-gray-900">Cast:</span> {movie.actors || "N/A"}</p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {movie.plot || "No description available."}
                  </p>
              </div>
          </div>

          {/* Right Column: Actions */}
          <div className="hidden lg:flex w-56 flex-col space-y-3">
              <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> Watch Trailer
              </button>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center mt-4">
                  <span className="block text-xs text-blue-600 uppercase font-bold tracking-wider mb-1">Match</span>
                  <span className="block text-3xl font-bold text-blue-900">94%</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}