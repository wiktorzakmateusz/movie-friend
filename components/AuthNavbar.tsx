// component with navigation bar during authentication

import Link from "next/link";
import Image from "next/image";

export default function AuthNavbar() {
  return (
    <nav className="absolute top-0 w-full px-8 py-6 flex items-center bg-transparent">
      <Link href="/" className="flex items-center gap-3"> {/* back to home page wrapper */}
        <div className="relative w-12 h-12"> 
            <Image 
              src="/logo.png" 
              alt="Movie Friend Logo" 
              width={50} 
              height={50} 
              className="rounded-full object-cover shadow-sm"
            />
        </div>
        <span className="font-bold text-xl text-blue-900">Movie Friend</span>
      </Link>
    </nav>
  );
}