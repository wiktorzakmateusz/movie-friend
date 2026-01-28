"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. We only use signIn. 
    // This triggers the logic we wrote in 'api/auth/[...nextauth]/route.ts'
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // We handle redirection manually below
    });

    // 2. Handle the result from NextAuth
    if (res?.error) {
      // res.error comes from the 'return null' in your authorize() callback
      setError("Invalid email or password");
    } else {
      // Success! NextAuth has set the cookie. We just need to move to the dashboard.
      router.push("/dashboard");
      router.refresh(); // Optional: ensures the new session is recognized immediately
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />

          <button className="w-full bg-transparent border border-gray-400 py-2 rounded-lg hover:bg-gray-50 transition mt-2">
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/register" className="text-sm text-gray-500 hover:text-blue-600">
            Don't have an account? Sign Up!
          </Link>
        </div>
      </div>
    </div>
  );
}