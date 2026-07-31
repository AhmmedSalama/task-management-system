import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Task Management System',
  description: 'Production-ready task board application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}