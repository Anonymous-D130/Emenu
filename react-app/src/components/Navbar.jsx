import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Avatar } from "@mui/material"; // Optional for a profile avatar

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-semibold text-white">
                            Get eMenu
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className="text-lg hover:text-purple-300">Home</Link>
                        <Link to="/about" className="text-lg hover:text-purple-300">About</Link>
                        <Link to="/services" className="text-lg hover:text-purple-300">Services</Link>
                        <Link to="/contact" className="text-lg hover:text-purple-300">Contact</Link>
                    </div>

                    {/* User Profile (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Avatar />
                        <span className="text-white">Sreedhar</span>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-gray-300 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-gray-800 text-white`}>
                <div className="px-4 py-2 space-y-2">
                    <Link to="/" className="block text-lg hover:text-purple-300">Home</Link>
                    <Link to="/about" className="block text-lg hover:text-purple-300">About</Link>
                    <Link to="/services" className="block text-lg hover:text-purple-300">Services</Link>
                    <Link to="/contact" className="block text-lg hover:text-purple-300">Contact</Link>
                    {/* Optionally include user profile */}
                    <div className="flex items-center space-x-2 mt-4">
                        <Avatar />
                        <span>Sreedhar</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
