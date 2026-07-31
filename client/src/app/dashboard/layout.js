"use client";

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      {/* السايد بار */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col lg:pl-64 w-full">
        {/* هيدر الموبايل اللي فيه زرار فتح القائمة */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={22} />
            </button>
            <span className="text-lg font-bold text-gray-900">TMS App</span>
          </div>
        </header>

        {/* محتوى الصفحات */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}