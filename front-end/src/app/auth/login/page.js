"use client"; // To ensure this runs on the client side

import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/SubHeader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter(); // Initialize useRouter for client-side redirects

  const handleSubmit = async (e) => {
    console.log("front-end/src/app/auth/login/page.js - handleSubmit");
    e.preventDefault();
    try {
      // Form action dispatch
      const response = await signIn({
        username,
        password,
      });
      console.log(response);
      console.log(
        "set cookies in the browser, e.g., idToken, refreshToken and signInDetails",
      );
      if (!response.isSignedIn) {
        throw new Error("Failed to sign in");
      }
      // Handle successful login
      console.log("Logged in successfully", response);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <main>
      <SubHeader currentPage="/auth/login"></SubHeader>
      <div className="px-4 md:px-0">
        <div className="w-full md:w-1/3">
          <form className="py-2 text-sm" onSubmit={handleSubmit}>
            {errorMessage && (
              <p className="mb-4 text-red-500">{errorMessage}</p>
            )}
            <div className="mb-2">
              <label htmlFor="username" className="block text-gray-700">
                username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-customOrangeLogo px-4 py-2 text-white transition duration-200 hover:bg-black"
            >
              login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
