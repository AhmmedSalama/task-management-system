import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
        <FileQuestion className="w-12 h-12 text-blue-600" />
      </div>

      {/* 404 Text */}
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">
        404
      </h1>
      
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Page Not Found
      </h2>
      
      {/* Description */}
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        Oops! The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      {/* Action Button */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}