// component with filtering and sorting on /dashboard page

"use client"; // client-side rendering
import { useState } from "react";
import { X, Star } from "lucide-react"; // icons

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sortBy: "relevance" | "popular";
  setSortBy: (sort: "relevance" | "popular") => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

const AVAILABLE_GENRES = [
  "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller"
];

export default function FilterSidebar({ isOpen, onClose, sortBy, setSortBy, selectedGenre, setSelectedGenre 
}: SidebarProps) {

  // genre toggle
  const handleGenreToggle = (genre: string) => {
    // if the clicked genre is already selected, clears it, otherwise, sets it
    setSelectedGenre(selectedGenre === genre ? "" : genre);
  };

  return (
    <>
      {/* Open/Close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity" // semi-transparent black background
          onClick={onClose}
        />
      )}

      <aside // sliding animation
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
      {/* form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-4 tracking-wider">FILTERS</h4>
              
              <div className="space-y-6">
                  
                  {/* genre filter */}
                  <div>
                    <p className="font-medium text-sm mb-2 text-gray-700">Genre</p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_GENRES.map((genre) => (
                        <label key={genre} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600">
                          <input 
                            type="checkbox" 
                            checked={selectedGenre === genre}
                            onChange={() => handleGenreToggle(genre)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                          /> 
                          <span>{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* year filter */}
                  {/* <div>
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
                  </div> */}

                  {/* min rating slider */}
                  {/* <div>
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
                  </div> */}

              </div>
          </div>

          <hr className="border-gray-100" />

          {/* sorting options */}
          <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-3 tracking-wider">SORTING</h4>
              <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="sort" 
                        id="relevance" 
                        checked={sortBy === "relevance"}
                        onChange={() => setSortBy("relevance")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="relevance" className="cursor-pointer">Relevance</label>
                  </div>
                  {/* <div className="flex items-center gap-2">
                      <input type="radio" name="sort" id="year_desc" className="text-blue-600 focus:ring-blue-500"/>
                      <label htmlFor="year_desc">Newest First</label>
                  </div> */}
                  <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="sort" 
                        id="rating_desc" 
                        checked={sortBy === "popular"}
                        onChange={() => setSortBy("popular")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="rating_desc" className="cursor-pointer">Most popular</label>
                  </div>
              </div>
          </div>
        </div>

        {/* show results button */}
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