import { Heart, HeartOff, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // 1. Import Next.js Image component

interface MovieProps {
  id: number; // Changed from string to number to match your backend ID
  title: string;
  poster: string; // This matches the 'poster' field from your backend
  imdb_rating?: number; // Optional rating
}

export default function MovieCard({ id, title, poster, imdb_rating }: MovieProps) {
  return (
    <div className="flex flex-col gap-2 w-48 group relative">
      
      {/* Poster Area */}
      <Link href={`/movie/${id}`} className="block relative">
        <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-200">
            {poster && poster !== "N/A" ? (
                <Image 
                  src={poster}
                  alt={title}
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                // Fallback if no poster exists
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                    No Poster
                </div>
            )}
            
            {/* Rating Badge (Overlay) */}
            {imdb_rating && (
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {imdb_rating}
                </div>
            )}
        </div>
      </Link>
      
      {/* Title */}
      <p className="font-medium text-center truncate px-1 text-gray-800" title={title}>
        {title}
      </p>

      {/* Actions (Heart & Hide) */}
      <div className="flex justify-center gap-4 mt-1">
        <button 
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
            title="Like"
        >
          <Heart className="w-5 h-5" />
        </button>
        <button 
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
            title="Hide"
        >
          <HeartOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}