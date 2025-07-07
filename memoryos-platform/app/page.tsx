import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full">
        <img src="/logo.png" alt="MemoryOS Logo" className="w-20 h-20 mb-6" />
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Welcome to MemoryOS
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Your second brain – structured and searchable memory management for
          AI.
        </p>
        <Link
          href="/memory"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Enter the App
        </Link>
      </div>
    </div>
  );
}
