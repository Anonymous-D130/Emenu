import React, {useCallback, useEffect, useState} from "react";
import Steps from "../components/Steps.jsx";
import SetupSubscription from "../components/SetupSubscription.jsx";
import SetUpRestaurant from "../components/SetUpRestaurant.jsx";
import SetUpMenu from "../components/SetUpMenu.jsx";
import GenerateQR from "../components/GenerateQR.jsx";
import NavigationButtons from "../components/NavigationButtons.jsx";
import axios from "axios";
import {
    COMPANY_NAME, FETCH_RESTAURANT,
    INITIATE_PAYMENT,
    RAZORPAY_CURRENCY,
    RAZORPAY_KEY,
    REGISTER_RESTAURANT,
    VERIFY_PAYMENT
} from "../utils/config.js";
import Toast from "../utils/Toast.jsx";
import {useNavigate} from "react-router-dom";
import {initialToastState} from "../utils/Utility.js";

const initialRestaurantState = {
    name: "",
    mobile: "",
    pageName: "",
    logo: null,
    welcomeScreen: null,
};

const CreateRestaurant = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(initialToastState);

    const fetchRestaurant = useCallback(async () => {
        try {
            const response = await axios.get(FETCH_RESTAURANT, {headers: {Authorization: `Bearer ${token}`}});
            setRestaurant(response.data);

        } catch (error) {
            console.error("Error while fetching: ", error);
        }
    }, [token]);

    useEffect(() => {
        fetchRestaurant().then(r => r);
    }, [fetchRestaurant]);

    const registerRestaurant = async () => {
        setLoading(true);
        try {
            const response = await axios.post(REGISTER_RESTAURANT, restaurant, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setToast({ message: response.data.message, type: "success" });
        } catch (error) {
            console.error("Error registering restaurant:", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !selectedPlan) {
            setToast({ message: "Please select a subscription plan before proceeding.", type: "error" });
            return;
        }

        if (currentStep === 2){
            if(!restaurant.name || !restaurant.mobile || !restaurant.pageName || !restaurant.logo || !restaurant.welcomeScreen) {
                setToast({message: "Please fill all required restaurant details before proceeding.", type: "error"});
                return;
            }
            registerRestaurant().then(r => r);
        }

        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

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
        if (currentStep !== 4) return;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setToast({ message: "Failed to load Razorpay SDK. Check your internet connection.", type: "error" });
            return;
        }

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
        }
    };

    return (
        <main className="flex-1 p-4 md:p-10 lg:p-12 mt-32 md:mt-6">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <Steps currentStep={currentStep} />
            <div className="pb-24">
                {currentStep === 1 && <SetupSubscription selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} includeTrial={true} />}
                {currentStep === 2 && <SetUpRestaurant restaurant={restaurant} setRestaurant={setRestaurant} setToast={setToast} />}
                {currentStep === 3 && <SetUpMenu setToast={setToast} />}
                {currentStep === 4 && <GenerateQR setToast={setToast} logo={restaurant.logo} name={restaurant.name}/>}
            </div>
            <NavigationButtons
                currentStep={currentStep}
                onNext={handleNext}
                onPrevious={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                handleSubmit={handleSubmit}
            />
        </main>
    );
}

export default CreateRestaurant;