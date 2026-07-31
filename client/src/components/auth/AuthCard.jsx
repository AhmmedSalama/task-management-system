import Link from 'next/link';

const AuthCard = ({ title, subtitle, children, linkText, linkHref, linkLabel }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {linkLabel}{' '}
            <Link href={linkHref} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              {linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;