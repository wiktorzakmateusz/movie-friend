// movie search page

"use client"; // client-side rendering

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Search, Loader2 } from "lucide-react"; // icons

// Movie object from backend scheme
interface Movie {
  id: number;
  title: string;
  poster: string;
  year: string;
  imdb_rating?: number;
  genre?: string;
  user_rating: number;
}

export default function SearchPage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [keyword, setKeyword] = useState("");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setError("");
    setMovies([]);

    try {
      // adding parameters to a request
      const params = new URLSearchParams();
      if (title.trim()) params.append("title", title);
      if (genre.trim()) params.append("genre", genre);
      if (keyword.trim()) params.append("keyword", keyword);

      const res = await fetch(`/api/search?${params.toString()}`); // call to proxy api - search

      if (!res.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // page content
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
            {/* header */}
            Find a Movie
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* title input */}
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Inception"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* genre input */}
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Genre</label>
              <input
                type="text"
                placeholder="e.g. Sci-Fi"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* keyword input */}
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Keyword</label>
              <input
                type="text"
                placeholder="e.g. Dream"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* search button */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed h-[50px]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* found movies grid */}
        <div className="mb-12">
          {error ? (
            <div className="text-center p-12 bg-red-50 rounded-xl border border-red-100 text-red-600">
              {error}
            </div>
          ) : isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Searching database...</p>
            </div>
          ) : movies.length > 0 ? (  // found movies
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          ) : hasSearched ? ( // no movies found
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No movies found matching your filters.</p>
              <button 
                onClick={() => {setTitle(""); setGenre(""); setKeyword("");}}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            // initial state before user searched
            <div className="text-center py-20 opacity-50">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Enter a filter above to start searching</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}