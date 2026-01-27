import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        <form className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username/Email"
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          
          <button className="w-full bg-transparent border border-gray-400 py-2 rounded-lg hover:bg-gray-50 transition mt-2">
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/register" className="text-sm text-gray-500 hover:text-blue-600">
            Already have an account? Sign In!
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-4 w-full flex justify-between px-8 text-xs text-gray-400">
        <span>info & contact</span>
        <span>report an issue</span>
      </div>
    </div>
  );
}