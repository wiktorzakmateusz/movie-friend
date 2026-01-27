import { Play, Heart, HeartOff } from "lucide-react";

export default function MovieDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Movie Title</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Poster Column */}
        <div className="w-64 flex-shrink-0">
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                Poster
            </div>
            {/* Action Buttons below poster */}
            <div className="flex justify-center gap-4">
                <button className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-200"><Heart /></button>
                <button className="p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200"><HeartOff /></button>
            </div>
        </div>

        {/* Details Column */}
        <div className="flex-1 space-y-4">
            {/* Metadata */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
                <p><strong>Year:</strong> 2014</p>
                <p><strong>Duration:</strong> 126 min</p>
                <p><strong>Director:</strong> Jane Doe</p>
                <p><strong>Cast:</strong> Actor One, Actor Two</p>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </div>

            {/* "Where to watch" */}
            <p className="text-sm text-gray-500 italic">Where to watch (VOD)?</p>
        </div>

        {/* Right Action Column */}
        <div className="w-48 flex-col space-y-3 hidden md:flex">
            <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">IMDb rating</button>
            <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Trailer
            </button>
            <div className="border border-blue-200 bg-blue-50 py-2 rounded-lg text-center text-blue-800">
                Predicted Rating: 8.5
            </div>
            <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Find similar movie</button>
        </div>
      </div>
    </div>
  );
}