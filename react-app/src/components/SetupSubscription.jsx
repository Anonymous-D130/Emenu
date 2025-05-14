import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {FETCH_PLANS} from "../utils/config.js";
import Toast from "../utils/Toast.jsx";
import {initialToastState} from "../utils/Utility.js";

const SetupSubscription = ({ selectedPlan, setSelectedPlan, includeTrial, setTrialDuration, billingType }) => {
    const token = localStorage.getItem("token");
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(initialToastState);

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_PLANS, {headers: {Authorization: `Bearer ${token}`}});
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPlans().then(r => r);
    },[fetchPlans])

    const handleSelectPlan = (plan, trial) => {
        if(!selectedPlan || selectedPlan !== plan) {
            setSelectedPlan(plan);
            setTrialDuration(trial);
        } else {
            setSelectedPlan(null);
            setTrialDuration(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>}
                {plans.map(({ id, title, price, disPrice, description, features, duration, trialDuration }) => (
                    <div
                        key={title}
                        className={`p-5 rounded-2xl shadow-md border-2 transition-all bg-white flex flex-col justify-between hover:shadow-lg cursor-pointer ${
                            selectedPlan === id ? "border-purple-500 shadow-purple-300" : "border-gray-200"
                        }`}
                        onClick={() => handleSelectPlan(id, trialDuration)}
                    >
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                            {billingType === "monthly" && (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <p className="text-2xl font-semibold text-purple-700">₹{price}</p>
                                        <p className="text-sm text-gray-400">/month</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Billed Monthly</p>
                                </div>
                            )}

                            {billingType === "annual" && (
                                <div className="flex items-center space-x-4">
                                    {price > disPrice && (
                                        <p className="text-sm font-semibold text-gray-500 line-through">₹{price}</p>
                                    )}
                                    <div className="flex items-center space-x-1">
                                        <p className="text-2xl font-semibold text-purple-700">₹{disPrice}</p>
                                        <p className="text-sm text-gray-400">/month</p>
                                    </div>
                                    <p className="text-xs text-gray-500">Billed Annually</p>
                                </div>
                            )}

                            <p className="text-md font-semibold text-gray-700">{description}</p>
                            <p className="text-sm font-medium text-gray-600">Duration: {Math.round((billingType === "annual" ? duration * 12 : duration) / 30)} months</p>
                            {includeTrial && trialDuration > 0 && <p className="text-sm font-medium text-purple-600">Includes {trialDuration} days free
                                trial</p>}
                            <ul className="mt-4 text-gray-600 text-sm space-y-2">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-md font-semibold text-gray-800">
                                        ✅ {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className={`w-full mt-5 py-2 rounded-lg text-lg font-semibold transition-all ${
                                selectedPlan === id
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            }`}
                            disabled={loading}
                        >
                            {selectedPlan === id ? "SELECTED" : "CHOOSE PLAN"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SetupSubscription;
