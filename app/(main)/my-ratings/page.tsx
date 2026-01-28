import MovieCard from "@/components/MovieCard";

export default function MyRatingsPage() {
  const ratedMovies = [
    { id: "101", title: "Movie 1" },
    { id: "102", title: "Movie 2" },
    { id: "103", title: "Movie 3" },
    { id: "104", title: "Movie 4" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Recently rated</h2>

      {/* Horizontal Scroll List */}
      <div className="flex gap-6 overflow-x-auto pb-4 mb-8">
        {ratedMovies.map((movie) => (
           // Using a wrapper to match the 'possibility to delete' annotation
           <div key={movie.id} className="relative group">
             <MovieCard {...movie} />
           </div>
        ))}
      </div>
    </div>
  );
}