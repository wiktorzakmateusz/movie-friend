"use client";
import { useState } from "react";
import { X, Star } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_GENRES = [
  "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller"
];

export default function FilterSidebar({ isOpen, onClose }: SidebarProps) {
  // Local state for the inputs
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minYear, setMinYear] = useState<string>("2000");
  const [minRating, setMinRating] = useState<number>(3.0);

  // Toggle a genre in the array
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre) // Remove if exists
        : [...prev, genre]                // Add if doesn't exist
    );
  };

  return (
    <>
      {/* 1. Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. Sidebar Panel */}
      <aside 
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header
        <div className="flex justify-between items-center p-6 border-b shrink-0">
          <h3 className="font-bold text-lg">Filters & Sorting</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div> */}
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* --- FILTERS SECTION --- */}
          <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-4 tracking-wider">FILTERS</h4>
              
              <div className="space-y-6">
                  
                  {/* 1. Genre Filter (Multi-select) */}
                  <div>
                    <p className="font-medium text-sm mb-2 text-gray-700">Genre</p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_GENRES.map((genre) => (
                        <label key={genre} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600">
                          <input 
                            type="checkbox" 
                            checked={selectedGenres.includes(genre)}
                            onChange={() => handleGenreToggle(genre)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                          /> 
                          <span>{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 2. Year Filter (Number Input) */}
                  <div>
                    <label className="font-medium text-sm text-gray-700 mb-2 block">
                      Released after (Year)
                    </label>
                    <input 
                      type="number" 
                      min="1900" 
                      max="2026"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 3. Min Rating (Slider 0.5 - 5.0) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-sm text-gray-700">Min Rating</label>
                      <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-blue-600" /> {minRating}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="5.0" 
                      step="0.5"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0.5</span>
                      <span>5.0</span>
                    </div>
                  </div>

              </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- SORTING SECTION --- */}
          <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-3 tracking-wider">SORTING</h4>
              <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                      <input type="radio" name="sort" id="relevance" defaultChecked className="text-blue-600 focus:ring-blue-500"/>
                      <label htmlFor="relevance">Relevance</label>
                  </div>
                  <div className="flex items-center gap-2">
                      <input type="radio" name="sort" id="year_desc" className="text-blue-600 focus:ring-blue-500"/>
                      <label htmlFor="year_desc">Newest First</label>
                  </div>
                  <div className="flex items-center gap-2">
                      <input type="radio" name="sort" id="rating_desc" className="text-blue-600 focus:ring-blue-500"/>
                      <label htmlFor="rating_desc">Highest Rated</label>
                  </div>
              </div>
          </div>
        </div>

        {/* Footer Actions (Optional) */}
        <div className="p-6 border-t bg-gray-50 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}