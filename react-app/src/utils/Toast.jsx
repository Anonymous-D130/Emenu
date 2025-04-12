import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', title, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        if (!isVisible) {
            const timeout = setTimeout(onClose, 500); // delay to allow fade-out animation
            return () => clearTimeout(timeout);
        }
    }, [isVisible, onClose]);

    const icon =
        type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        );

    return (
        <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-5 py-4 rounded-xl shadow-lg text-white max-w-sm w-full z-[10000] transition-all duration-500 ease-in-out
                ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}
            `}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start space-x-3">
                <div className="mt-1">{icon}</div>
                <div className="flex-1">
                    {title && <p className="font-bold text-sm mb-1">{title}</p>}
                    {Array.isArray(message) ? (
                        <ul className="text-sm list-disc list-inside space-y-1">
                            {message.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm">{message}</p>
                    )}
                </div>
                <button
                    className="ml-3 text-white hover:text-gray-200 focus:outline-none"
                    onClick={() => setIsVisible(false)}
                    aria-label="Close toast"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;
