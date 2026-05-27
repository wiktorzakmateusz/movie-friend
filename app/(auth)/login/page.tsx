// login page

"use client"; // client-side rendering

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // fields change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // log in handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // sending login credentials to api
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) { // incorrect credentials
      setError("Invalid email or password");
    } else { // correct credentials
      router.push("/dashboard"); // move to main page
      router.refresh();
    }
  };

  // page UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-300 rounded-2xl p-10 shadow-sm">
        
        {/* displays error if there is one */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>} 

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input // email
            name="email"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input // password
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />

          {/* log in button */}
          <button type="submit" className="w-full bg-transparent border border-gray-400 py-2 rounded-lg hover:bg-gray-50 transition mt-2">
            Log In
          </button>
        </form>

        {/* sign in link */}
        <div className="mt-6 text-center">
          <Link href="/register" className="text-sm text-gray-500 hover:text-blue-600">
            Don't have an account? Sign Up!
          </Link>
        </div>
      </div>
    </div>
  );
}