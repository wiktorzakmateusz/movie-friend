import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">

      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Username" className="w-full border border-gray-400 rounded-lg px-4 py-3" />
          <input type="email" placeholder="Email" className="w-full border border-gray-400 rounded-lg px-4 py-3" />
          <input type="password" placeholder="Password" className="w-full border border-gray-400 rounded-lg px-4 py-3" />
          <input type="password" placeholder="Password Again" className="w-full border border-gray-400 rounded-lg px-4 py-3" />
          
          <button className="w-full bg-transparent border border-gray-400 py-2 rounded-lg hover:bg-gray-50 transition mt-2">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Log In with Google
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 w-full flex justify-between px-8 text-xs text-gray-400">
        <span>info & contact</span>
        <span>report an issue</span>
      </div>
    </div>
  );
}