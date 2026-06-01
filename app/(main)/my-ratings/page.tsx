// page with user ratings

"use client"; // client-side rendering

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";
import { StarOff, Star, SlidersHorizontal, Loader2, X} from "lucide-react";  // icons

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

// Sidebar Filter
function RatingsFilterSidebar({ isOpen, onClose, activeFilter, setActiveFilter }: any) {
  const filters = [
    { id: "rated", label: "Rated Movies" },
    { id: "ignored", label: "Ignored Movies" },
    { id: "hidden", label: "Hidden Movies" },
    { id: "blocked", label: "Blocked Movies" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Filter Ratings</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => { setActiveFilter(filter.id); onClose(); }}
                className={`text-left px-4 py-2 rounded-md transition ${
                  activeFilter === filter.id 
                    ? "bg-blue-100 text-blue-700 font-semibold" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MyRatingsPage() {
  const { data: session, status } = useSession();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("rated"); // "rated" | "ignored" | "hidden" | "blocked"
  
  // toggle filter
  const displayedMovies = ratedMovies.filter(movie => {
    if (activeFilter === "ignored") return movie.user_rating !== -1 && movie.ignore === true;
    if (activeFilter === "hidden") return movie.user_rating === -1 && movie.ignore === true;
    if (activeFilter === "blocked") return movie.user_rating === -1 && movie.ignore === false; 
    return movie.user_rating !== -1;
  });

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
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      
      <RatingsFilterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <main className="flex-1 p-8">
        {/* header section matching dashboard exactly */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-blue-900 text-center md:text-left capitalize">
            Here are movies you've {activeFilter}:
          </h2>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
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
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {displayedMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id}
                    {...movie} 
                    onRatingChange={() => fetchRatings()}
                    onUnignore={handleUnignore}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}