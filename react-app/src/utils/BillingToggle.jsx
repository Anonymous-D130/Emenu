import React from "react";

const BillingToggle = ({ billingType, setBillingType }) => {
    return (
        <div className="flex justify-center items-center mb-8">
            <button
                onClick={() => setBillingType("monthly")}
                className={`text-md font-semibold cursor-pointer mr-4 transition-colors duration-200 ${
                    billingType === "monthly" ? "text-purple-600" : "text-gray-500"
                }`}
            >
                Monthly
            </button>

            <label className="relative inline-block w-14 h-7 cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer hidden"
                    checked={billingType === "annual"}
                    onChange={() =>
                        setBillingType((prev) =>
                            prev === "monthly" ? "annual" : "monthly"
                        )
                    }
                />
                <div className="block w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors duration-300 px-1"></div>
                <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-7"></div>
            </label>

            <button
                onClick={() => setBillingType("annual")}
                className={`text-md font-semibold cursor-pointer ml-4 transition-colors duration-200 ${
                    billingType === "annual" ? "text-purple-600" : "text-gray-500"
                }`}
            >
                Annual
            </button>
        </div>
    );
};

export default BillingToggle;