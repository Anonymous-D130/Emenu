import React, {useCallback, useEffect, useState} from "react";
import {DASHBOARD_DATA} from "./config/Api.js";
import axios from "axios";
import Toast from "../utils/Toast.jsx";
import DashboardStats from "./DashboardStats.jsx";

const AdminPanel = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({message: "", type: ""});

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(DASHBOARD_DATA, {headers: {Authorization: localStorage.getItem("token")}});
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setToast({
                message: error.response ? error.response.data.message : error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        fetchData().then(data => data);
    }, [fetchData]);

    return (
        <main className="flex-1 p-4 md:p-10 lg:p-12 mt-40 md:mt-20 overflow-x-auto">
            {/* Loading Spinner */}
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            {data.length > 0 ? (
                <DashboardStats data={data} />
            ) : (
                <p className="text-gray-500 text-center text-lg">No data Available</p>
            )}
        </main>
    );
}

export default AdminPanel;