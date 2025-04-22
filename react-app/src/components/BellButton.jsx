import React, {useCallback, useEffect, useRef, useState} from "react";
import {initialToastState} from "../utils/Utility.js";
import axios from "axios";
import {FETCH_RESTAURANT, WEBSOCKET_URL} from "../utils/config.js";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {MdRoomService} from "react-icons/md";
import Toast from "../utils/Toast.jsx";

const BellButton = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(initialToastState);

    const [isRinging, setIsRinging] = useState(false);
    const [isScaled, setIsScaled] = useState(false);
    const [tableNumber, setTableNumber] = useState(0);
    const audioRef = useRef(null);
    const [restaurantId, setRestaurantId] = useState("");

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
            }, 10000);
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

    const stopRinging = () => {
        setIsRinging(false);
        setIsScaled(true);
        setTimeout(() => {
            setTableNumber(0);
            setIsScaled(false);
        }, 2000);
    }

    return (
        <main className="relative">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}

            <button
                onClick={stopRinging}
                className={`
                              fixed md:bottom-20 bottom-8 md:right-10 right-5 w-18 h-18 rounded-full bg-black border-[6px] border-gray-300 
                              flex flex-col items-center justify-center text-yellow-400 z-10
                              transform transition-transform duration-300 text-2xl font-extrabold
                              ${isScaled ? "scale-150" : "scale-100"}
                            `}
            >
                {tableNumber > 0 ? tableNumber : <MdRoomService className="text-2xl" />}
            </button>
        </main>
    )
}

export default BellButton;