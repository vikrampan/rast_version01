export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome to RAST</h1>
        <p className="text-gray-400 mb-8">Remote Access Security Tool</p>
        <div className="space-x-4">
          <a
            href="/auth/signup"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </a>
          <a
            href="/auth/signin"
            className="inline-block border border-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}