"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => pathname === path ? "text-red-500 font-bold" : "text-gray-600";

  return (
    <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
      {/* Logo Section */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="relative w-20 h-20"> 
            <Image 
              src="/logo.png"         
              alt="Movie Friend Logo" 
              width={80}              
              height={80}             
              className="rounded-full object-cover" 
            />
        </div>
        <span className="font-bold text-xl text-blue-900">Movie Friend</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-8">
        <Link href="/search" className={isActive("/search")}>Search</Link>
        <Link href="/dashboard" className={isActive("/dashboard")}>Recommendations</Link>
        <Link href="/my-ratings" className={isActive("/my-ratings")}>My ratings</Link>
      </div>

      {/* User & Options */}
      <div className="flex items-center gap-4">
        {status === "loading" ? (
           <span className="text-sm text-gray-400">Loading...</span>
        ) : session ? (
           <>
             {/* Show logged in user name */}
             <span className="text-sm text-gray-900 font-medium">
               {session.user?.name || session.user?.email}
             </span>
             
             {/* Logout Button */}
             <button 
               onClick={() => signOut({ callbackUrl: '/login' })}
               className="p-2 hover:bg-red-50 text-red-500 rounded-full transition"
               title="Sign Out"
             >
               <LogOut className="w-5 h-5" />
             </button>
           </>
        ) : (
           <Link href="/login" className="text-sm text-blue-600 hover:underline">
             Log In
           </Link>
        )}
        
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}