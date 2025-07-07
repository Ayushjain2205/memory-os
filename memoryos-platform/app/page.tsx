"use client";
import { useState } from "react";
import FilecoinStorage from "./FilecoinStorage";

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      {!showDemo ? (
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full mb-10">
          <img src="/logo.png" alt="MemoryOS Logo" className="w-20 h-20 mb-6" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome to MemoryOS
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            The programmable memory layer for your AI to think in context.
          </p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => setShowDemo(true)}
          >
            Get Started
          </button>
        </div>
      ) : (
        <FilecoinStorage />
      )}
    </div>
  );
}
