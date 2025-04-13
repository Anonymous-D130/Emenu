import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import { Check } from "lucide-react";
import {FETCH_DASHBOARD, FETCH_RESTAURANT, WEBSOCKET_URL} from "../utils/config.js";
import { initialToastState } from "../utils/Utility.js";
import Toast from "../utils/Toast.jsx";
import {MdRoomService} from "react-icons/md";
import SockJS from "sockjs-client";
import {over} from "stompjs";

const Dashboard = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(initialToastState);
    const [isRinging, setIsRinging] = useState(false);
    const [isScaled, setIsScaled] = useState(false);
    const [tableNumber, setTableNumber] = useState(0);
    const audioRef = useRef(null);
    const [restaurantId, setRestaurantId] = useState("");
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        inProgressOrders: 0,
        rejectedOrders: 0,
        totalBillingAmount: 0,
        tablesFilled: [],
        totalTables: 0,
    });

    const {
        totalOrders,
        completedOrders,
        pendingOrders,
        inProgressOrders,
        rejectedOrders,
        totalBillingAmount,
        tablesFilled,
        totalTables,
    } = dashboardData;

    const availableTables = useMemo(() => totalTables - tablesFilled.length, [totalTables, tablesFilled]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(FETCH_DASHBOARD, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDashboardData(data);
        } catch (error) {
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDashboardData().then(d => d);
    }, [fetchDashboardData]);

    const fetchRestaurant = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_RESTAURANT, {headers: {Authorization: `Bearer ${token}`}});
            setRestaurantId(response.data.id);
        } catch (error) {
            console.log("Error fetching orders: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRestaurant().then(r => r);
    }, [fetchRestaurant]);

    useEffect(() => {
        const socket = new SockJS(WEBSOCKET_URL);
        const stompClient = over(socket);

        stompClient.connect({}, () => {
            if(restaurantId) {
                stompClient.subscribe(`/topic/ring-bell/${restaurantId}`, (msg) => {
                    const table = JSON.parse(msg.body);
                    setTableNumber(table);
                    setIsRinging(true);
                })
            }
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [restaurantId]);

    useEffect(() => {
        let interval;
        let timeout;

        if (isRinging) {
            if (!audioRef.current) {
                audioRef.current = new Audio("/alert.mp3");
            }
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            interval = setInterval(() => {
                setIsScaled(prev => !prev);
            }, 100);

            timeout = setTimeout(() => {
                setIsRinging(false);
                setTableNumber(0);
                clearInterval(interval);
                setIsScaled(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }, 5000);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isRinging]);

    return (
        <main className="grid gap-6 grid-cols-1 md:grid-cols-4 p-4 md:p-10 lg:p-12 mt-45 md:mt-15 w-full">
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(initialToastState)} />
            )}

            {/* Tables Card */}
            <section className="bg-white p-5 rounded-2xl shadow-md col-span-2 row-span-2">
                <h2 className="text-3xl font-bold mb-4 p-3">Tables</h2>
                <div className="flex gap-4 text-sm mb-4 p-3">
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 bg-yellow-400 rounded-full" />
                        Tables Filled ({tablesFilled.length})
                    </span>
                    <span className="flex items-center gap-2 text-gray-500">
                        <span className="h-3 w-3 bg-gray-300 rounded-full" />
                        Tables Available ({availableTables})
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                {Array.from({ length: totalTables }, (_, i) => {
                        const tableNum = i + 1;
                        const isFilled = tablesFilled.includes(tableNum);

                        return (
                            <div
                                key={tableNum}
                                className={`relative flex items-center justify-center h-24 rounded-xl transition-all w-35 ${
                                    isFilled ? "bg-[#FFC300] border-[3px] border-black" : "bg-[#F5F5F5]"
                                }`}
                            >
                                <div className="relative w-12 h-12 bg-white rounded-sm border border-gray-600 flex items-center justify-center z-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isFilled
                                                ? "bg-yellow-400 text-black"
                                                : "bg-[#d9d9d9] text-gray-700"
                                        }`}
                                    >
                                        <span className="font-bold text-lg">{tableNum}</span>
                                    </div>
                                </div>

                                {/* Seats */}
                                <div className="z-1">
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm" />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm" />
                                    <div className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm" />
                                    <div className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm" />
                                </div>

                                {isFilled && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-[4px] border-2 border-white">
                                        <Check size={14} color="white" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Orders Summary */}
            <section className="bg-white p-10 rounded-2xl shadow-md col-span-2">
                <h2 className="text-3xl font-bold mb-4">Orders</h2>
                <div className="text-4xl font-bold mb-2">{totalOrders}</div>
                <div className="text-sm text-gray-500 border-b pb-2 mb-4">Total Orders</div>
                <div className="flex justify-between text-center text-lg mx-2 gap-2">
                    {[
                        { label: "Completed", value: completedOrders, color: "text-green-600" },
                        { label: "Pending", value: pendingOrders, color: "text-yellow-500" },
                        { label: "In Progress", value: inProgressOrders, color: "text-blue-500" },
                        { label: "Rejected", value: rejectedOrders, color: "text-red-500" },
                    ].map(({ label, value, color }) => (
                        <div key={label}>
                            <div className={`font-bold text-2xl ${color}`}>{value}</div>
                            <div className={`text-sm text-gray-600 ${color}`}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Total Billing Amount */}
            <section className="bg-white p-5 rounded-2xl shadow-md col-span-2 flex flex-col justify-between max-h-100">
                <h2 className="text-xl font-semibold mb-4">Total Amount</h2>
                <div className="flex flex-col gap-1 items-center justify-center mb-auto pt-10">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                        ₹ {totalBillingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">Total Billing Amount</div>
                </div>
            </section>
            {/* Ringing button */}
            <div className="relative">
                <button
                    onClick={() => setIsRinging(false)}
                    className={`
                                  fixed md:bottom-20 bottom-8 md:right-10 right-5 w-18 h-18 rounded-full bg-black border-[6px] border-gray-300 
                                  flex flex-col items-center justify-center text-yellow-400 z-10
                                  transform transition-transform duration-300 text-2xl font-extrabold
                                  ${isScaled ? "scale-150" : "scale-100"}
                                `}
                >
                    {tableNumber > 0 ? tableNumber : <MdRoomService className="text-2xl" />}
                </button>
            </div>
        </main>
    );
};

export default Dashboard;
