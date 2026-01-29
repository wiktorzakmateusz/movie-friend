"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
}

export default function MyRatingsPage() {

  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch("/api/movies"); 
        
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

    fetchRatings();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Recently rated</h2>

      {isLoading ? (
        <div className="text-gray-500">Loading your ratings...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 mb-8">
          {ratedMovies.map((movie) => (
             <div key={movie.id} className="relative group">
               <MovieCard {...movie} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
}