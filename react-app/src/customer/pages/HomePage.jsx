import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {FETCH_RESTAURANT_INFO, REGISTER_CUSTOMER} from "../../utils/config.js";
import {initialToastState} from "../../utils/Utility.js";
import Toast from "../../utils/Toast.jsx";
import ErrorPage from "./ErrorPage.jsx";
import customerActivity from "../utils/CustomerActivity.js";

const HomePage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const tableNumber = searchParams.get('tableNumber');
    const navigate = useNavigate();
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [customer, setCustomer] = useState(null);

    customerActivity(customer);

    const registerCustomer = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.post(REGISTER_CUSTOMER(restaurantId), { tableNumber });
            localStorage.setItem("customer", JSON.stringify(response.data));
            setCustomer(response.data);
            setHasError(false);
        } catch (error) {
            console.log(error);
            setHasError(true);
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [restaurantId, tableNumber]);

    const fetchRestaurantInfo = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_RESTAURANT_INFO(restaurantId));
            setRestaurant(response.data);
            setHasError(false);
        } catch (error) {
            console.log("Error fetching restaurant: ", error);
            setHasError(true);
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        if (!restaurantId || !tableNumber) return;

        const stored = JSON.parse(localStorage.getItem("customer"));
        if (!stored || stored.restaurantId !== restaurantId) {
            localStorage.removeItem("customer");
            setCustomer(null);
            registerCustomer().then(r => r);
        }
    }, [registerCustomer, restaurantId, tableNumber]);

    useEffect(() => {
        if (restaurantId) fetchRestaurantInfo().then(r => r);
    }, [fetchRestaurantInfo, restaurantId]);
    
    useEffect(() => {
        if(restaurantId) fetchRestaurantInfo().then(r => r);
    }, [fetchRestaurantInfo, restaurantId]);

    const showErrorPage = !restaurantId || !tableNumber || hasError;

    if (showErrorPage) {
        return (
            <ErrorPage
                loading={loading}
                toast={toast}
                setToast={setToast}
            />
        );
    }

    return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-start relative">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {/* Header Section */}
            <div className="w-full bg-white text-black pt-5 flex flex-col items-center rounded-b-3xl z-5">
                <h2 className="text-2xl font-semibold">Welcome to</h2>
                <div className="bg-yellow-400 px-4 w-full flex items-center justify-center rounded-b-3xl">
                    <img src={restaurant?.logo} alt="logo" className="h-35 max-w-screen" />
                </div>
            </div>

            {/* Main Image and Video Section */}
            <div className="flex-1 w-full flex flex-col items-center justify-end relative">
                <img
                    src={restaurant?.welcomeScreen}
                    alt="Delicious Food"
                    className="w-full h-[calc(100vh-150px)] object-cover absolute overflow-hidden -top-10 left-0 z-[1]"
                />

                <div className="z-10 flex flex-col items-center mb-30">
                    <button
                        onClick={() => window.open('https://pexels.com')}
                        className="bg-white rounded-full p-4 shadow-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-8 h-8 text-black"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-5.197-3.027A1 1 0 008 9.027v5.946a1 1 0 001.555.832l5.197-3.027a1 1 0 000-1.664z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate(`/customer/order/restaurant/tables?restaurantId=${restaurantId}&tableNumber=${tableNumber}&logo=${restaurant?.logo}`)}
                        className="mt-4 text-lg text-white font-bold"
                    >Skip Intro</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;