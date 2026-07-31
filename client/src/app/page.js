import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <main className="text-center max-w-3xl mx-auto">
        {/* العناوين الترحيبية */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Welcome to <span className="text-blue-600">Task Management</span> System
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          A production-ready platform to organize your projects, track your tasks, and boost your team's productivity efficiently.
        </p>

        {/* أزرار التنقل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="w-full sm:w-auto">
            <span className="inline-flex justify-center items-center px-8 py-3 w-full rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200">
              Login to Account
            </span>
          </Link>
          
          <Link href="/register" className="w-full sm:w-auto">
            <span className="inline-flex justify-center items-center px-8 py-3 w-full rounded-lg font-semibold bg-white text-blue-600 border border-gray-200 hover:bg-gray-50 shadow-md transition-colors duration-200">
              Create New Account
            </span>
          </Link>
        </div>
      </main>

      {/* تذييل بسيط (Footer) */}
      <footer className="absolute bottom-6 text-center text-gray-500 text-sm">
        <p>Built with Node.js & Next.js</p>
      </footer>
    </div>
  );
}