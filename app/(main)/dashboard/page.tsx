"use client"; // <--- Essential for interactivity

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import FilterSidebar from "@/components/FilterSidebar"; // Make sure to import it
import { SlidersHorizontal } from "lucide-react"; // Icon for the button

export default function Dashboard() {
  // 1. Create the state
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const recommendations = [
    { id: "1", title: "Inception" },
    { id: "2", title: "Interstellar" },
    { id: "3", title: "The Dark Knight" },
    { id: "4", title: "Dune" },
    { id: "5", title: "Tenet" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      
      {/* 2. Add the Sidebar Component here 
          Pass the state and the function to close it 
      */}
      <FilterSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 p-8">
        
        {/* Header Area with Filter Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-center md:text-left">Here are my picks:</h2>
            
            {/* 3. The Trigger Button */}
            <button 
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Sorting</span>
            </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-12">
            {recommendations.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
            ))}
        </div>

        <div className="flex justify-center">
            <button className="px-6 py-2 border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition">
                I don't like them :(
            </button>
        </div>
      </main>
    </div>
  );
}