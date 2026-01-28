export default function SearchPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 items-center mt-10">
        
        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <input 
            type="text" 
            placeholder="Title" 
            className="border-2 border-gray-300 rounded-lg px-6 py-3 w-full md:w-64"
          />
          <input 
            type="text" 
            placeholder="Genre" 
            className="border-2 border-gray-300 rounded-lg px-6 py-3 w-full md:w-64"
          />
          <input 
            type="text" 
            placeholder="Keyword" 
            className="border-2 border-gray-300 rounded-lg px-6 py-3 w-full md:w-64"
          />
        </div>
      </div>
    </div>
  );
}