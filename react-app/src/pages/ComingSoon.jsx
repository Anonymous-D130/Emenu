import React from "react";
import { FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6 text-center">
            <div className="bg-white shadow-lg rounded-xl p-8 md:p-12">
                <div className="flex justify-center mb-6">
                    <FaClock className="text-purple-600 text-5xl animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold text-purple-700 mb-4">Coming Soon</h1>
                <p className="text-gray-600 text-md mb-6 leading-relaxed">
                    We're building something delicious for you. Stay tuned for the launch!
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;
