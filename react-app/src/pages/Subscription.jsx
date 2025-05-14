import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    ACTIVATE_TRIAL,
    COMPANY_NAME,
    FETCH_PLANS,
    FETCH_USER_SUBSCRIPTION, INITIATE_MONTHLY_PAYMENT, RAZORPAY_CURRENCY,
    RAZORPAY_KEY,
    UPGRADE_PLAN_PAYMENT,
    VERIFY_PAYMENT
} from "../utils/config.js";
import { initialToastState } from "../utils/Utility.js";
import Toast from "../utils/Toast.jsx";
import BillingToggle from "../utils/BillingToggle.jsx";
import {CircularProgress} from "@mui/material";

const InfoCard = ({ icon, label, value, color = "text-gray-800" }) => (
    <div className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <span className="text-purple-600 text-xl">{icon}</span>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`font-semibold ${color}`}>{value}</p>
        </div>
    </div>
);

const initialSubscriptionState = {
    subscription: {
        id: "",
        startDate: "",
        "endDate": "",
        status: null,
        expired: false,
        plan: {
            id: "",
            title: "",
            price: 0,
            duration: 0,
            description: "",
            features: []
        }
    }
};

const Subscription = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const [subscription, setSubscription] = useState(initialSubscriptionState);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({message: "", type: ""});
    const [billingType, setBillingType] = useState("annual");
    const [paymentLoading, setPaymentLoading] = useState(false);

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_PLANS, {headers: { Authorization: `Bearer ${token}` },});
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setToast({
                message: error.response ? error.response.data.message : error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPlans().then(p => p);
    }, [fetchPlans]);

    const fetchSubscription = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_USER_SUBSCRIPTION, {headers: { Authorization: `Bearer ${token}` }});
            setSubscription(response.data);
        } catch (error) {
            console.error("Error fetching subscription:", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token, setToast]);

    useEffect(() => {
        fetchSubscription().then(s => s);
    }, [fetchSubscription]);

    const getSubscriptionProgress = () => {
        if (!subscription?.startDate || !subscription?.endDate) {
            return { percentage: 0, daysRemaining: 0 };
        }

        const start = new Date(subscription.startDate);
        const end = new Date(subscription.endDate);
        const now = new Date();

        const totalDuration = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const remaining = end.getTime() - now.getTime();

        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

        return { percentage, daysRemaining };
    };

    const { percentage, daysRemaining } = getSubscriptionProgress();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentSuccess = async (response) => {
        const body = {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
        }
        try {
            const verification = await axios.post(VERIFY_PAYMENT, body, {
                headers: {Authorization: `Bearer ${token}`}
            });

            if (verification.status !== 200) {
                throw new Error(verification.data.message || "Verification failed");
            }

            setToast({message: "Subscription successful! " + verification.data.message, type: "success"});
            window.location.reload();
        } catch (err) {
            console.error("Payment verification failed:", err);
            setToast({
                message: err.response ? err.response.data.message : err.message || "Payment verification error",
                type: "error"
            });
        }
    }

    const createRazorpayOptions = (orderId, amount) => ({
        key: RAZORPAY_KEY,
        amount,
        currency: RAZORPAY_CURRENCY,
        name: COMPANY_NAME,
        description: "Subscription Payment",
        order_id: orderId,
        prefill: {
            name: user?.name || "",
            email: user?.email || "",
        },
        handler: handlePaymentSuccess,
    });

    const handlePlanUpgrade = async (selectedPlan) => {
        setPaymentLoading(selectedPlan);
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setToast({ message: "Failed to load Razorpay SDK. Check your internet connection.", type: "error" });
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post(UPGRADE_PLAN_PAYMENT(selectedPlan), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const order = data?.data;
            if (!order?.razorpay_order_id || !order?.amount) {
                throw new Error("Invalid Razorpay order response.");
            }

            const razorpayOptions = createRazorpayOptions(order.razorpay_order_id, order.amount);
            const rzp = new window.Razorpay(razorpayOptions);
            rzp.open();
        } catch (error) {
            console.error("Subscription/payment initiation failed:", error);
            setToast({message: error.response ? error.response.data.message : error.message || "Failed to initiate payment", type: "error",});
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Your Subscription</h2>

            <div className="flex justify-center px-4">
                {subscription ? (
                    <div
                        className={`w-full max-w-3xl bg-white p-8 rounded-3xl shadow-lg transition-all border-2 ${
                            subscription.status === "ACTIVE"
                                ? "border-purple-500 shadow-purple-200"
                                : "border-gray-300"
                        }`}
                    >
                        {/* Plan Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {subscription.plan?.title}
                                    <span className="ml-3 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        Current Plan
                                    </span>
                                </h3>
                                <p className="text-md font-semibold text-gray-700">{subscription.plan?.description}</p>
                            </div>
                            <div className="text-right sm:text-left">
                                <p className="text-xl font-extrabold text-purple-700">₹{subscription.plan?.price}</p>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                            {subscription.plan?.features.map((feature, index) => (
                                <li key={index} className="text-gray-800 font-medium text-sm flex items-center gap-2">
                                    ✅ {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Subscription Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm text-gray-800">
                            <InfoCard icon="📅" label="Start Date" value={new Date(subscription.startDate).toLocaleDateString()} />
                            <InfoCard icon="📆" label="End Date" value={new Date(subscription.endDate).toLocaleDateString()} />
                            <InfoCard
                                icon="✔️"
                                label="Status"
                                value={subscription.status}
                                color={subscription.status === "ACTIVE" ? "text-green-600" : "text-red-500"}
                            />
                            <InfoCard
                                icon="⏰"
                                label="Expired"
                                value={subscription.expired ? "Yes" : "No"}
                                color={subscription.expired ? "text-red-500" : "text-green-600"}
                            />
                        </div>

                        {/* Progress & Countdown */}
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700">Plan Usage: {percentage.toFixed(0)}%</label>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-1 overflow-hidden">
                                <div
                                    className="bg-purple-600 h-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                ⏳ <span className="font-semibold">{daysRemaining}</span> day{daysRemaining !== 1 && "s"} left until expiry.
                            </p>
                        </div>

                        {/* Button */}
                        <button
                            disabled
                            className="w-full py-3 rounded-xl text-base font-semibold bg-purple-300 text-white cursor-not-allowed"
                        >
                            CURRENT PLAN
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-md">No active subscription found.</p>
                )}
            </div>

            {/* All Available Plans */}
            {plans
                .filter(plan => plan.id !== subscription?.plan?.id && plan.price > subscription?.plan?.price)
                .length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mt-12 mb-6">Available Plans To Upgrade</h2>
                    <BillingToggle billingType={billingType} setBillingType={setBillingType} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans
                            .filter(plan => plan.id !== subscription?.plan?.id && plan.price > subscription?.plan?.price)
                            .map(plan => (
                                <div
                                    key={plan.id}
                                    className="p-5 rounded-2xl shadow-md border-2 bg-white flex flex-col justify-between border-gray-200 hover:shadow-lg transition"
                                >
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-bold text-gray-800">{plan?.title}</h3>
                                        {billingType === "monthly" && <p className="text-lg font-bold text-purple-700">₹{plan?.price}</p>}
                                        {billingType === "annual" &&<div className="flex items-center space-x-2">
                                            {plan?.price > plan?.disPrice && <p className="text-lg font-semibold text-gray-400 line-through">₹{plan?.price}</p>}
                                            <p className="text-lg font-bold text-purple-700">₹{plan?.disPrice}</p>
                                        </div>}
                                        <p className="text-md font-semibold text-gray-700">{plan?.description}</p>
                                        <ul className="mt-4 text-sm space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-md text-gray-800">
                                                    ✅ {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => handlePlanUpgrade(plan?.id)}
                                        className={`w-full mt-6 py-2 text-white font-semibold rounded-lg transition-colors ${
                                            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                                        } flex items-center justify-center`}
                                        disabled={paymentLoading}
                                    >
                                        {paymentLoading === plan?.id ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Subscribe'
                                        )}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </main>
    );

};

export default Subscription;
