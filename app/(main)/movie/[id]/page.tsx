// page with movie information

"use client"; // client-side rendering

import { useState, useEffect, MouseEvent } from "react";
import { useParams } from "next/navigation"; 
import { Play, Heart, HeartOff, Loader2, Star, Trash2 } from "lucide-react"; // icons
import Link from "next/link";

// Movie object from backend scheme
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
  user_rating?: number | null;
}

export default function MovieDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [predictedRating, setPredictedRating] = useState<number | null>(null);

  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        // call to proxy api - movie info
        const res = await fetch(`/api/movies/${id}`);

        if (!res.ok) throw new Error("Failed to load movie"); // error in backend
        
        const data = await res.json();
        setMovie(data);
        setMyRating(data.user_rating === null ? undefined : data.user_rating);

        try {
          // call to proxy api - rating prediction
          const predictionRes = await fetch(`/api/recommendations/${id}/`);
          if (predictionRes.ok) { // error in backend
            const predictionData = await predictionRes.json();
            
            if (predictionData.predicted_rating) {
              const Rating = Number(predictionData.predicted_rating);
              setPredictedRating(Rating); 
            }
          }
        } catch (predErr) { // error during data fetching
          console.error("Could not load prediction:", predErr);
        }

      } catch (err) {
        console.error(err);
        setError("Could not load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // helper to get text label based on score
  const getRatingLabel = (score: number) => {
    if (score <= 2) return "Very Bad";
    if (score <= 4) return "Bad";
    if (score <= 6) return "Average";
    if (score <= 8) return "Good";
    return "Very Good";
  };

  // rating adding handler
  const handleRate = async (e: MouseEvent, score: number) => {
    e.preventDefault();
    if (!movie) return;
    
    setIsUpdating(true);
    const previousRating = myRating;

    try {
      setMyRating(score); // optimistic UI update
      await fetch("/api/ratings", { // call to proxi api - adding user rating
        method: "POST",
        body: JSON.stringify({ movie_id: movie.id, rating: score }),
      });
    } catch (error) {
      console.error(error);
      setMyRating(previousRating); // revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  // rating deleting handler
  const handleDeleteRating = async (e: MouseEvent) => {
    e.preventDefault();
    if (!movie) return;

    setIsUpdating(true);
    const previousRating = myRating;

    try {
      setMyRating(undefined); // optimistic UI update
      await fetch(`/api/ratings/${movie.id}`, { // call to proxi api - deleting user rating
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      setMyRating(previousRating); // revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  // placeholders
  const handleWishlist = () => console.log("Wishlist coming soon");
  const handleHide = () => console.log("Hide movie coming soon");

  const isRated = myRating !== undefined && myRating !== null;

  if (isLoading) { // simplified UI in case of loading
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !movie) { // simplified UI in case of loading error / movie does not exist
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <p className="text-gray-600 mb-6">{error || "Movie not found"}</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Home</Link>
      </div>
    );
  }

  // page UI
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          {/* movie title */}
          {movie.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* left column: poster & actions */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col items-center lg:items-start">
              
              <div className="w-64 h-96 relative rounded-lg shadow-lg overflow-hidden mb-6 bg-gray-200 group">
                {movie.poster ? ( // poster
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Poster</div>
                )}

                 {/* hover rating adding*/}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                  
                  {/* dynamic text description of rating */}
                  <span className={`text-base font-bold mb-3 transition-colors ${
                    hoverRating > 0 ? "text-yellow-400" : "text-white"
                  }`}>
                    {hoverRating > 0 
                      ? getRatingLabel(hoverRating) 
                      : "What's your rating?"}
                  </span>

                  {/* stars */}
                  <div 
                    className="flex flex-wrap justify-center gap-1.4 mb-4" 
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[...Array(10)].map((_, i) => {
                      const starValue = i + 1;
                      const isActive = starValue <= (hoverRating || myRating || 0);
                      
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
                            className={`w-5 h-5 ${
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
                      className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-full transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              {/* action buttons: wishlist & hide */}
              <div className="flex justify-center w-64 gap-6">
                  <button 
                    onClick={handleWishlist}
                    className="p-4 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-pink-500 hover:bg-pink-50 hover:border-pink-100 transition"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                  
                  <button 
                    onClick={handleHide}
                    className="p-4 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                    title="Hide Movie"
                  >
                    <HeartOff className="w-6 h-6" />
                  </button>
              </div>
          </div>

          {/* middle column: details */}
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
                    
                    {/* user rating badge (if rated) */}
                    {isRated && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                          <Star className="w-5 h-5 fill-current" /> {myRating}
                        </div>
                        <span className="text-xs text-blue-400 font-medium">Your Rating</span>
                      </div>
                    )}
                    
                    {/* imdb rating */}
                    {movie.imdb_rating && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                          <Star className="w-5 h-5 fill-current" /> {movie.imdb_rating}
                        </div>
                        <span className="text-xs text-gray-400">IMDb Rating</span>
                      </div>
                    )}
                  </div>
                  {/* cast */}
                  </div> 
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm"><span className="font-medium text-gray-900">Cast:</span> {movie.actors || "N/A"}</p>
                  </div>
              </div>
              {/* description */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {movie.plot || "No description available."}
                  </p>
              </div>
          </div>

          {/* right column: actions & predictions */}
          <div className="hidden lg:flex w-56 flex-col space-y-3">
              {/* trailer (in development) */}
              <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> Watch Trailer
              </button>
              
              {/* prediction of rating */}
              {predictedRating !== null && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center mt-4 shadow-sm">
                    <span className="block text-xs text-blue-600 uppercase font-bold tracking-wider mb-1">Predicted</span>
                    <div className="flex items-center justify-center gap-1">
                        <span className="block text-3xl font-bold text-blue-900">{predictedRating}</span>
                        <Star className="w-6 h-6 fill-blue-900 text-blue-900" />
                    </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}