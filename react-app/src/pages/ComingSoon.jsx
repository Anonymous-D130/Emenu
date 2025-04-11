import React from "react";
import { FaClock } from "react-icons/fa";

const ComingSoon = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-yellow-100 to-yellow-300 px-6">
            <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <FaClock className="text-yellow-500 text-5xl animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
                <p className="text-gray-600 text-lg mb-6">
                    We're working hard to bring you something amazing. Stay tuned!
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300">
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;