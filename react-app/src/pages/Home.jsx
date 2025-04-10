import React, {useState} from "react";
import home from "../assets/home.png";
import logo from "../assets/logo.png";
import {FaBell, FaQrcode, FaSyncAlt, FaTags} from "react-icons/fa";
import {FaUtensils} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const features = [
    {
        icon: <FaQrcode className="text-purple-600 text-2xl" />,
        title: "Scan & Order in One Tap",
        desc: "No app download needed!",
    },
    {
        icon: <FaSyncAlt className="text-blue-600 text-2xl" />,
        title: "Live Menu Updates",
        desc: "Change items, prices & offers anytime.",
    },
    {
        icon: <FaBell className="text-yellow-600 text-2xl" />,
        title: "Ring the Bell Feature",
        desc: "Customers can notify waiters instantly!",
        cta: true,
    },
    {
        icon: <FaUtensils className="text-green-600 text-2xl" />,
        title: "Place Order Seamlessly",
        desc: "Customers can order directly from their table!",
    },
    {
        icon: <FaTags className="text-pink-600 text-2xl" />,
        title: "Offer Zone",
        desc: "Highlight discounts & special deals easily!",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-4 px-6 shadow-sm relative">
                {/* Logo */}
                <a href="/" className="cursor-pointer text-2xl font-bold text-purple-700 flex items-center space-x-2">
                    <img src={logo} alt="logo" />
                </a>

                {/* Desktop Nav Links */}
                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center space-x-6 font-medium">
                        <a href="#features" className="hover:text-purple-600">Features</a>
                        <a href="#how" className="hover:text-purple-600">How It Works</a>
                        <a href="#pricing" className="hover:text-purple-600">Pricing</a>
                        <a href="#testimonials" className="hover:text-purple-600">Testimonials</a>
                        <a href="#contact" className="hover:text-purple-600">Contact Us</a>
                    </div>

                    {/* Buttons */}
                    <div className="hidden md:flex space-x-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-purple-700 bg-purple-200 rounded-lg font-semibold px-4 py-2 hover:text-white hover:bg-purple-500"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition"
                        >
                            Start Free Trial
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-purple-700 focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2}
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md z-20 flex flex-col items-start px-6 py-4 space-y-4 md:hidden">
                        <a href="#features" className="hover:text-purple-600 w-full">Features</a>
                        <a href="#how" className="hover:text-purple-600 w-full">How It Works</a>
                        <a href="#pricing" className="hover:text-purple-600 w-full">Pricing</a>
                        <a href="#testimonials" className="hover:text-purple-600 w-full">Testimonials</a>
                        <a href="#contact" className="hover:text-purple-600 w-full">Contact Us</a>
                        <hr className="w-full border-t" />
                        <button
                            onClick={() => {
                                navigate("/login");
                                setIsMenuOpen(false);
                            }}
                            className="text-purple-700 bg-purple-200 w-full rounded-lg font-semibold px-4 py-2 hover:text-white hover:bg-purple-500"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                navigate("/register");
                                setIsMenuOpen(false);
                            }}
                            className="bg-purple-600 text-white w-full px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition"
                        >
                            Start Free Trial
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="text-center p-10">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Digital Menu in Seconds!</h1>
                <p className="text-gray-600 text-lg">Create a mobile-friendly menu & take orders instantly!</p>
                <div className="flex justify-center items-center">
                    <img src={home} alt="Demo" className="rounded-lg w-full max-w-5xl" />
                </div>
            </section>

            {/* Features */}
            <section className="py-5 px-6 bg-white text-center">
                <h2 className="text-gray-800 font-bold text-xl md:text-3xl mb-12">
                    Restaurants | Hotels | Cafes | Bars | Food Courts
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr max-w-6xl mx-auto text-left">
                    {features.map(({ icon, title, desc, cta }) => (
                        <div
                            key={title}
                            className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 ${
                                title === "Ring the Bell Feature" ? "md:row-span-2 md:p-15" : ""
                            }`}
                        >
                            <div className="flex flex-col h-full space-y-4">
                                <div className="bg-gray-100 rounded-full p-3 shadow-sm w-fit">
                                    {icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {desc}
                                </p>
                                {cta && (
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="hidden md:flex mb-auto bg-purple-600 text-white px-4 py-2 mt-auto rounded-md text-sm hover:bg-purple-700 transition w-full sm:w-fit"
                                    >
                                        Get Started for Free
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;