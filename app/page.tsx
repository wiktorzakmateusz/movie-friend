// initial page of the app

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-50">
      
      <div className="mb-8"> 
        <Image  // logo
          src="/logo.png" 
          alt="Movie Friend logo" 
          width={250} 
          height={250} 
          className="rounded-full shadow-lg"
          priority
        />
      </div>

      {/* welcome text */}
      <h1 className="text-4xl font-bold mb-4 text-blue-900">Welcome to Movie Friend</h1>
      <p className="text-xl text-gray-600 mb-8 font-handwriting">
        Show me your taste and I'll find you a movie.
      </p>
      
      {/* Login link */}
      <Link href="/login">
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Log In
        </button>
      </Link>
      
      {/* footer */}
      <div className="absolute bottom-4 w-full flex justify-between px-8 text-xs text-gray-400">
        <span>info & contact</span>
        <span>report an issue</span>
      </div>
    </main>
  );
}