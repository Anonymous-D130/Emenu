import React, {useCallback, useEffect, useState} from "react";
import SetUpRestaurant from "../components/SetUpRestaurant.jsx";
import {initialToastState, validateRestaurantDetails} from "../utils/Utility.js";
import Toast from "../utils/Toast.jsx";
import axios from "axios";
import {FETCH_RESTAURANT, REGISTER_RESTAURANT} from "../utils/config.js";

const initialRestaurantState = {
    name: "",
    mobile: "",
    pageName: "",
    logo: null,
    welcomeScreen: null,
};

const Settings = () => {
    const token = localStorage.getItem("token");
    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);

    const fetchRestaurant = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(FETCH_RESTAURANT, {headers: {Authorization: `Bearer ${token}`}});
            setRestaurant(response.data);
        } catch (error) {
            console.error("Error while fetching: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
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

    const handleUpdateRestaurant = () => {
        const result = validateRestaurantDetails(restaurant);
        if (!result.valid) {
            setToast({ message: result.message, type: "error" });
            return;
        }
        registerRestaurant().then(r => r);
    }

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15 relative">
            {loading &&
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div
                        className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>}
            {toast.message &&
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({message: "", type: ""})}/>}
            <SetUpRestaurant restaurant={restaurant} setRestaurant={setRestaurant} setToast={setToast}/>
            <div className="w-full p-4 flex bg-[#fff] shadow-2xl rounded-2xl rounded-t-none">
                <button
                    onClick={handleUpdateRestaurant}
                    disabled={loading}
                    className={`w-full p-3 ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-semibold rounded-xl shadow-md transition duration-200`}
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </main>
    );
};

export default Settings;
