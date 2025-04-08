import React from "react";
import Navbar from "../components/Navbar";

const Splash = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto text-center py-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Our Digital Menu</h2>
                <p className="text-lg text-gray-600">Scan, Order, and Enjoy!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <div className="p-6 bg-white shadow-lg rounded-md">
                        <h3 className="text-2xl font-semibold text-gray-800">Easy Setup</h3>
                        <p className="text-gray-600">Create a digital menu in minutes.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-md">
                        <h3 className="text-2xl font-semibold text-gray-800">Contactless Ordering</h3>
                        <p className="text-gray-600">Customers can scan and order without touching a menu.</p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-md">
                        <h3 className="text-2xl font-semibold text-gray-800">Fast & Secure</h3>
                        <p className="text-gray-600">Quick response and smooth experience.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Splash;
