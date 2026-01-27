"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

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
        <span className="text-sm text-gray-500">Username</span>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}