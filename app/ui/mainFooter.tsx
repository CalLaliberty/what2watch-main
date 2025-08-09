import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="border-t border-gray-700 py-10"
      style={{
        background: "linear-gradient(to bottom right, #0d1b2a, #1b263b)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/discover"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                Discover
              </Link>
            </li>
            <li>
              <Link
                href="/watchlist"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                Watchlist
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-gray-100 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            About What2Watch
          </h3>
          <p className="mb-2 text-gray-300">
            What2Watch makes it easy to discover movies and TV shows and tells
            you where to stream, rent, or buy them — all in one place.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Made by{" "}
            <span className="font-semibold text-gray-100">
              Gauntlet Development
            </span>{" "}
            with ❤️ in 2025
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} What2Watch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
