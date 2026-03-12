import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            My Blog
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Home
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
