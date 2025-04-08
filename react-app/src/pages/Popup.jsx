import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Popup = () => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto text-center py-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Popup Example</h2>
                <button
                    onClick={() => setShowPopup(true)}
                    className="px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
                >
                    Show Popup
                </button>

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-2xl font-semibold text-gray-800">Order Confirmed!</h3>
                            <p className="text-gray-600">Your order is being prepared.</p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;
