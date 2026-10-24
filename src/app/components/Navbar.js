// src/app/components/Navbar.js
export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-navy">
            Bank Of<span className="text-red">America</span>
          </span>
        </div>

        {/* Middle: links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li><a href="#" className="text-sm font-medium text-text-grey hover:text-red">Personal</a></li>
          <li><a href="#" className="text-sm font-medium text-text-grey hover:text-red">Business</a></li>
          <li><a href="#" className="text-sm font-medium text-text-grey hover:text-red">Loans</a></li>
          <li><a href="#" className="text-sm font-medium text-text-grey hover:text-red">About</a></li>
        </ul>

        {/* Right: buttons */}
        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-sm font-semibold text-navy hover:text-red sm:block">
            Log In
          </a>
          <a
            href="#"
            className="rounded-md bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
          >
            Open Account
          </a>
        </div>
      </nav>
    </header>
  );
}