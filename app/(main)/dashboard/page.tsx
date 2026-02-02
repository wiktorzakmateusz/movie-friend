"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import FilterSidebar from "@/components/FilterSidebar";
import { SlidersHorizontal, Loader2 } from "lucide-react"; 

// 1. Define the interface matching your Backend Data
// Note: Ensure these field names match exactly what your Python backend sends (snake_case)
interface Movie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number; // Optional because some movies might not have ratings
  genre?: string;
}

export default function Dashboard() {
  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Fetch Data from Proxy on Load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // We call our Next.js API route, not the external Python URL
        const res = await fetch("/api/movies");

        if (!res.ok) {
          throw new Error("Failed to load recommendations");
        }

        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError("Could not load recommendations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      
      {/* Sidebar Component */}
      <FilterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 p-8">
        
        {/* Header Section */}
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
        
        {/* Content Section (Loading / Error / Grid) */}
        {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
                <p className="text-gray-500 font-medium">Finding the best movies for you...</p>
            </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-xl border border-red-100 p-8">
                <p className="text-red-500 font-medium mb-2">Oops!</p>
                <p className="text-gray-600">{error}</p>
            </div>
        ) : (
            <>
              {movies.length === 0 ? (
                 <div className="text-center py-20 text-gray-500">
                    No movies found. Try adjusting your filters!
                 </div>
              ) : (
                 <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {movies.map((movie) => (
                        <MovieCard 
                            key={movie.id} 
                            // Spread syntax passes all properties (title, poster, etc.)
                            // Make sure MovieCard accepts 'imdb_rating' or map it manually here
                            {...movie} 
                        />
                    ))}
                 </div>
              )}

              <div className="flex justify-center mt-8">
                  <button className="px-6 py-2 border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition">
                      I don't like these :(
                  </button>
              </div>
            </>
        )}
      </main>
    </div>
  );
}