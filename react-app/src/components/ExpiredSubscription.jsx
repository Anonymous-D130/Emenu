import SetupSubscription from "./SetupSubscription.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    COMPANY_NAME,
    INITIATE_PAYMENT,
    RAZORPAY_CURRENCY,
    RAZORPAY_KEY,
    VERIFY_PAYMENT
} from "../utils/config.js";
import {initialToastState} from "../utils/Utility.js";
import {useNavigate} from "react-router-dom";
import Toast from "../utils/Toast.jsx";

const ExpiredSubscription = () => {
    const token = localStorage.getItem("token");
    const [toast, setToast] = useState(initialToastState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const [selectedPlan, setSelectedPlan] = useState(null);

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
            setTimeout(() => navigate("/restaurant/dashboard"), 300);
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

    const handleSubmit = async () => {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setToast({ message: "Failed to load Razorpay SDK. Check your internet connection.", type: "error" });
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(INITIATE_PAYMENT(selectedPlan), {}, {
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
            setLoading(false);
        }
    };

    useEffect(() => {
        if(selectedPlan) handleSubmit().then(r => r);
    }, [selectedPlan]);
    
    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <div>
                <div className="p-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                        Renew Your Subscription
                    </h2>
                    <p className="text-sm text-center text-gray-500">
                        To continue accessing all premium features, please renew your subscription by selecting a plan below.
                    </p>
                </div>
                <SetupSubscription selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} includeTrial={false}/>
            </div>
        </main>
    );
}

export default ExpiredSubscription;