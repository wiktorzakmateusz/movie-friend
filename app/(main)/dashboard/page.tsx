// main page with recomendations

"use client"; // client-side rendering

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import FilterSidebar from "@/components/FilterSidebar";
import { SlidersHorizontal, Loader2, X, Trash2 } from "lucide-react";  // icons

// Movie object from backend scheme
interface Movie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
}

// Interface for explanation of recommendations
interface Explanation {
  movie: Movie;
  weight: number;
}

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // a flag tracking if filter menu is visible 
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // states for explaining recommendations
  const [explainingMovie, setExplainingMovie] = useState<Movie | null>(null);
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState("");

  // fetching movie recommendations
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // call to proxy api
        const res = await fetch("/api/recommendations");

        if (!res.ok) { // error in backend
          throw new Error("Failed to load recommendations");
        }

        const data = await res.json();
        setMovies(data);

      } catch (err) { // error during data fetching
        console.error(err);
        setError("Could not load recommendations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);
  
  // fetching recommendation explenation
  useEffect(() => {
    if (!explainingMovie) {
      setExplanations([]); 
      return;
    }

    const fetchExplanations = async () => {
      setIsExplaining(true);
      setExplainError("");
      try {
        const res = await fetch(`/api/recommendations/${explainingMovie.id}/explain`);
        if (!res.ok) throw new Error("Failed to fetch explanation");
        
        const data = await res.json();
        setExplanations(data);
      } catch (err) {
        console.error(err);
        setExplainError("Could not load the explanation for this movie.");
      } finally {
        setIsExplaining(false);
      }
    };

    fetchExplanations();
  }, [explainingMovie]);

  // explanation pop-up width
  const modalWidthClass = 
    explanations.length >= 3 ? "max-w-4xl" : 
    explanations.length === 2 ? "max-w-2xl" : 
    "max-w-md";

  const gridColsClass = 
    explanations.length >= 3 ? "sm:grid-cols-3" : 
    explanations.length === 2 ? "sm:grid-cols-2" : 
    "sm:grid-cols-1";

  // updating ignore flag of a ratting
  const handleIgnore = async (movieId: number) => {
    try {
      const res = await fetch(`/api/ratings/${movieId}/ignore`, {
        method: "PATCH",
        body: JSON.stringify({ ignore: true }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Failed to ignore movie");

      setExplanations((prev) => prev.filter((item) => item.movie.id !== movieId));
      
    } catch (err) {
      console.error("Failed to ignore movie:", err);
      setError("Could not ignore the movie. Please try again.");
    }
  };

  // page content
  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      
      {/* sidebar component */}
      <FilterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 p-8">
        
        {/* header section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-blue-900 text-center md:text-left">
              Here are my picks:
            </h2>
            
            <button 
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition text-gray-700"
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Sorting</span>
            </button>
        </div>
        
        {/* content section (loading / error / grid) */}
        {isLoading ? ( // loading info
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
                <p className="text-gray-500 font-medium">Finding the best movies for you...</p>
            </div>
        ) : error ? ( // error
            <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-xl border border-red-100 p-8">
                <p className="text-red-500 font-medium mb-2">Oops!</p>
                <p className="text-gray-600">{error}</p>
            </div>
        ) : (
            <>
              {movies.length === 0 ? ( // no movies found
                 <div className="text-center py-20 text-gray-500">
                    No movies found. Try adjusting your filters!
                 </div>
              ) : ( // movies grid
                 <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {movies.map((movie) => (
                        <MovieCard 
                            key={movie.id}
                            {...movie} 
                            onExplain={() => setExplainingMovie(movie)}
                        />
                    ))}
                 </div>
              )}

              {/* "I dont like this" button (placeholder) */}
              <div className="flex justify-center mt-8">
                  <button className="px-6 py-2 border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition">
                      I don't like these :(
                  </button>
              </div>
            </>
        )}
      </main>

      {/* explaining recommendation pop-up */}
      {explainingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          
          {/* pop-up */}
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl relative transition-all duration-300 ease-in-out ${modalWidthClass}`}">
            
            {/* close button */}
            <button 
              onClick={() => setExplainingMovie(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* header */}
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Why was {explainingMovie.title} recommended?
            </h3>
            <p className="text-gray-500 mb-8 flex items-center gap-2">
              Because you interacted with these similar movies:
            </p>

            {/* predictors grid */}
            <div className="flex-1 flex flex-col">
              {isExplaining ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-gray-500 text-sm">Analyzing your history...</p>
                </div>
              ) : explainError ? (
                <div className="flex-1 flex items-center justify-center text-red-500">
                  {explainError}
                </div>
              ) : explanations.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Not enough historical data to explain this recommendation.
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-6">
                  {explanations.map((item) => (
                    <div 
                      key={item.movie.id} 
                      className="w-full sm:w-60 flex flex-col bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group shrink-0"
                      >
                      
                      {/* poster */}
                      <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                        {item.movie.poster ? (
                          <img 
                            src={item.movie.poster} 
                            alt={item.movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No Poster</div>
                        )}
                        
                        {/* ignore by Movie Friend button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleIgnore(item.movie.id);
                            }}
                            className="flex flex-col items-center justify-center gap-1.5 bg-gray-800/90 hover:bg-gray-700 text-gray-100 w-10/12 px-3 py-3 rounded-lg text-xs text-center leading-tight font-medium shadow-lg transition transform hover:scale-105"
                          >
                            <Trash2 className="w-5 h-5 mb-0.5" /> 
                            <span>Ignore by Movie Friend</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-semibold text-gray-900 line-clamp-1" title={item.movie.title}>
                          {item.movie.title}
                        </h4>
                        
                        {/* weight */}
                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-200">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">influence</span>
                          <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                            {(item.weight * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}