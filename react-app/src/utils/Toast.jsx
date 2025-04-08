import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer
    }, [message]);

    useEffect(() => {
        if (!isVisible) {
            onClose(); // Close the toast after it's hidden
        }
    }, [isVisible, onClose]);

    return (
        isVisible && (
            <div
                className={`fixed z-100000 top-4 left-1/2 transform -translate-x-1/2 p-4 max-w-xs sm:max-w-md w-full rounded-lg shadow-lg text-white transition-all duration-500 ease-in-out ${
                    type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {/* Add an icon based on the type */}
                        {type === 'success' ? (
                            <svg
                                className="w-6 h-6 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default Toast;
