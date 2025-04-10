import React from "react";

const OrdersSkeleton = () => {
    return (
        <div className="space-y-4 p-4">
            {[...Array(2)].map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
                >
                    <div className="flex space-x-4">
                        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-300 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    );
};

export default OrdersSkeleton;