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
        <div className="flex items-center justify-center w-24 text-gray-400 font-bold tracking-widest">
          ...
        </div>
      </div>

      <div className="text-gray-400 text-center text-xl font-bold my-4">
        [...]
      </div>

      {/* Stats Diagram Placeholder */}
      <div className="w-full max-w-sm border-2 border-black rounded-lg p-4 h-32 flex items-center justify-center mx-auto md:mx-0">
        <span className="text-sm italic">diagram/statistics</span>
      </div>
    </div>
  );
}