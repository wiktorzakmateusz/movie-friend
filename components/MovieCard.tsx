import { Heart, HeartOff } from "lucide-react";
import Link from "next/link";

interface MovieProps {
  id: string;
  title: string;
  posterUrl?: string; // Optional for now
}

export default function MovieCard({ id, title }: MovieProps) {
  return (
    <div className="flex flex-col gap-2 w-48 group">
      {/* Poster Area */}
      <Link href={`/movie/${id}`}>
        <div className="w-full h-72 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center text-gray-400">
          Poster
        </div>
      </Link>
      
      {/* Title */}
      <p className="font-medium text-center truncate">{title}</p>

      {/* Actions (Heart & Hide) */}
      <div className="flex justify-center gap-4 mt-1">
        <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
          <Heart className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
          <HeartOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}