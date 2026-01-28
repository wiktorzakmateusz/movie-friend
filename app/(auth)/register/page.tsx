"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Used for auto-login after registration

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Client-side Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call internal Next.js API Route (The Proxy)
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Registration failed";

        // 1. Check if the backend sent a list of validation errors (FastAPI/Pydantic style)
        if (Array.isArray(data.message)) {
             // Combine all validation messages into one string
             errorMessage = data.message
               .map((err: any) => err.msg || JSON.stringify(err))
               .join(", ");
        } 
        // 2. Check if it's a generic object error
        else if (typeof data.message === 'object') {
             errorMessage = JSON.stringify(data.message);
        } 
        // 3. Otherwise, it's a normal string
        else if (data.message) {
             errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }

      // 3. Auto-Login (UX Improvement)
      // Immediately sign the user in so they land on the dashboard
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.error) {
        // If auto-login fails for some reason, send them to login page
        router.push("/login");
      } else {
        // Success! Go to dashboard
        router.push("/dashboard");
        router.refresh();
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              name="nickname"
              type="text"
              placeholder="Nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-900 text-white font-medium py-3 rounded-lg hover:bg-blue-800 transition mt-2 
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 transition">
            Already have an account? <span className="font-semibold">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}