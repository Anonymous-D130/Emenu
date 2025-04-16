import React from "react";
import { FaCheck } from "react-icons/fa6";

const NavigationButtons = ({ onPrevious, onNext, currentStep, handleSubmit, paymentLoading }) => {
    return (
        <div className="fixed md:bottom-0 bottom-3 left-0 w-full bg-white shadow-md p-4 flex justify-center z-100">
            <div className="flex justify-between w-full md:px-60 mx-auto">
                {/* Back Button */}
                <button
                    onClick={onPrevious}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg text-md font-semibold transition-all ${
                        currentStep === 1
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-purple-200 text-black hover:bg-purple-700 hover:text-white"
                    }`}
                >
                    ← PREVIOUS
                </button>

                {/* Next Button */}
                <button
                    disabled={paymentLoading && currentStep === 4}
                    onClick={currentStep === 4 ? handleSubmit : onNext}
                    className={`text-white px-10 py-3 rounded-lg text-md font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2
                    ${paymentLoading && currentStep === 4? "bg-indigo-400" : "bg-indigo-600"}`}
                >
                    {currentStep === 4 ? (
                        <>
                            {paymentLoading ? (
                                "SUBMITTING...."
                            ) : (
                                <>
                                    SUBMIT <FaCheck />
                                </>
                            )}
                        </>
                    ) : (
                        "NEXT →"
                    )}
                </button>
            </div>
        </div>
    );
};

export default NavigationButtons;
