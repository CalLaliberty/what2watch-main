import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 text-gray-700 py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-blue-500 mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/about" className="hover:text-blue-600 transition">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/discover" className="hover:text-blue-600 transition">
                                Discover
                            </Link>
                        </li>
                        <li>
                            <Link href="/watchlist" className="hover:text-blue-600 transition">
                                Watchlist
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-blue-600 transition">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Company Info */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-blue-500 mb-4">
                        About What2Watch
                    </h3>
                    <p className="mb-2">
                        What2Watch helps you find movies and TV shows and tells you where to
                        stream, rent, or buy them, all in one place!
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        Made by{" "}
                        <span className="text-gray-800 font-semibold">
                            Gauntlet Development
                        </span>{" "}
                        with ❤️ in 2025
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} What2Watch. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
