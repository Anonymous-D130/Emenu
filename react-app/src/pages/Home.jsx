import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto text-center py-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to ScanToMenu</h2>
                <p className="text-lg text-gray-600">A simple, fast, and digital restaurant menu solution.</p>
                <div className="mt-8">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;