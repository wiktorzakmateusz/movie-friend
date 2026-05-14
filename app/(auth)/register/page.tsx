// register page

"use client"; // client-side rendering

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  // tracks whether the registration request is currently processing
  const [isLoading, setIsLoading] = useState(false); 
  
  // fields change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // registering handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // disables sign in button

    // second password check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // proxy api call
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

      // failed registration & errors handling
      if (!res.ok) { 
        let errorMessage = "Registration failed";

        if (Array.isArray(data.message)) {
          errorMessage = data.message
            .map((err: any) => err.msg || JSON.stringify(err))
            .join(", ");
        } 
        else if (typeof data.message === 'object') {
          errorMessage = JSON.stringify(data.message);
        } 
        else if (data.message) {
          errorMessage = data.message;
        }
        throw new Error(errorMessage);
      }

      // auto login
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.error) { // if fails to login, move to /login
        router.push("/login");
      } else { // move to main page
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
      setIsLoading(false); // enables sign in button
    }
  };

  // page UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        {/* displays error if there is one */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input // nickname
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
            <input // email
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
            <input // password
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
            <input // password confirmation
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <button // sign up button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-900 text-white font-medium py-3 rounded-lg hover:bg-blue-800 transition mt-2 
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* login link */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 transition">
            Already have an account? <span className="font-semibold">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}