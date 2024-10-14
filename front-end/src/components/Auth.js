"use client"; // For client-side component

import { signOut } from "aws-amplify/auth";

export default function Auth({ loggedInUser }) {
  async function handleLogout() {
    try {
      await signOut();
      window.location.reload(); // Refresh the page after logging out, and middleware, once it sees that there is no logged in user, will redirect to /auth/login
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="mt-2 flex items-center justify-between border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm">
      <p>
        Logged in as: <span className="font-bold">{loggedInUser}</span>
      </p>
      <button
        onClick={handleLogout}
        className="border-1 rounded-md border border-red-600 px-4 py-2 text-red-600 transition duration-200 hover:bg-red-600 hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}
