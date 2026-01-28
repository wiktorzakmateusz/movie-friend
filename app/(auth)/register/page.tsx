"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      // 2. Send data to FastAPI
      const response = await fetch("${API_URL}/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      // 3. Success! Redirect to Login
      // alert("Account created! Please log in.");
      router.push("/login");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        
        {/* Error Message Display */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nickname"
            type="text"
            placeholder="Username"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Password Again"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-transparent border border-gray-400 py-2 rounded-lg hover:bg-gray-50 transition mt-2"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Log In with Google
          </button>
        </div>
        
        <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600">
                Already have an account? Log In!
            </Link>
        </div>
      </div>
    </div>
  );
}