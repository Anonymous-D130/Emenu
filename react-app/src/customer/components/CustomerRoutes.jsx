import {Routes, Route, useSearchParams, useParams} from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import SelectTable from "../pages/SelectTable.jsx";
import Food from "../pages/Food.jsx";
import NotFound from "../../pages/NotFound.jsx";
import customerActivity from "../utils/CustomerActivity.js";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {FETCH_RESTAURANT_INFO, REGISTER_CUSTOMER} from "../../utils/config.js";
import {initialToastState} from "../../utils/Utility.js";
import Toast from "../../utils/Toast.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";

const CustomerRoutes = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [searchParams] = useSearchParams();
    const { pageName } = useParams();
    const tableNo = searchParams.get('tableNumber');
    const [tableNumber, setTableNumber] = useState(tableNo || 1);
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [showErrorPage, setShowErrorPage] = useState(false);

    customerActivity(customer);

    const fetchRestaurantInfo = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_RESTAURANT_INFO(pageName));
            setRestaurant(response.data);
        } catch (error) {
            console.log("Error fetching restaurant: ", error);
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, [pageName]);

    const registerCustomer = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.post(REGISTER_CUSTOMER(pageName), { tableNumber });
            localStorage.setItem("customer", JSON.stringify(response.data));
            setCustomer(response.data);
        } catch (error) {
            console.log(error);
            setToast({ message: error.response?.data?.message || error.message, type: "error" });
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, [pageName, tableNumber]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("customer"));
        if (!stored || stored?.pageName !== pageName) {
            localStorage.removeItem("customer");
            setCustomer(null);
            registerCustomer().then(r => r);
        }
    }, [pageName, registerCustomer, tableNumber]);

    useEffect(() => {
        if (pageName) fetchRestaurantInfo().then(r => r);
    }, [fetchRestaurantInfo, pageName]);

    useEffect(() => {
        if(pageName) fetchRestaurantInfo().then(r => r);
    }, [fetchRestaurantInfo, pageName]);

    useEffect(() => {
        setShowErrorPage(!pageName || hasError);
    }, [hasError, pageName]);

    return (
        <main className="flex min-h-screen bg-gray-100 justify-center items-center">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {showErrorPage ? <ErrorPage/> :
            <div className="max-w-md w-full">
                <Routes>
                    <Route path="/" element={<HomePage restaurant={restaurant} />} />
                    <Route path="/tables" element={<SelectTable setHasError={setHasError} tableNumber={tableNumber} setTableNumber={setTableNumber} restaurant={restaurant} setToast={setToast} setLoading={setLoading} />} />
                    <Route path="/foods" element={<Food setHasError={setHasError} setToast={setToast} restaurant={restaurant} tableNumber={tableNumber} />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </div>}
        </main>
    );
};

export default CustomerRoutes;
