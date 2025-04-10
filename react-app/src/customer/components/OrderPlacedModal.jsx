import { Modal } from "@mui/material";
import SockJS from "sockjs-client";
import Veg from "../../assets/veg.png";
import nonVeg from "../../assets/Non-veg.png";
import { formatEnumString } from "../../utils/Utility.js";

import {
    FaRegFaceGrinBeamSweat ,
    FaRegClock,
    FaUtensils,
    FaRegThumbsUp,
    FaRegFaceGrinBeam
} from "react-icons/fa6";

import {
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import { MdRoomService} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {WEBSOCKET_URL} from "../../utils/config.js";
import {over} from "stompjs";

const statusConfig = {
    PENDING: {
        icon: <FaRegClock />,
        color: "text-yellow-600",
        label: "Pending"
    },
    ACCEPTED: {
        icon: <FaRegFaceGrinBeam />,
        color: "text-green-600",
        label: "Accepted"
    },
    PREPARING: {
        icon: <FaUtensils />,
        color: "text-orange-600",
        label: "Preparing"
    },
    READY_FOR_PICKUP: {
        icon: <FaRegThumbsUp />,
        color: "text-purple-600",
        label: "Ready for Pickup"
    },
    COMPLETED: {
        icon: <FaCheckCircle />,
        color: "text-blue-600",
        label: "Completed"
    },
    REJECTED: {
        icon: <FaTimesCircle />,
        color: "text-red-600",
        label: "Rejected"
    }
};

const OrderPlacedModal = ({ open, handleClose, orders, ringBell, loading, bellLoading }) => {
    const [liveOrders, setLiveOrders] = useState(orders);

    useEffect(() => {
        setLiveOrders(orders);
    }, [orders]);

    useEffect(() => {
        const socket = new SockJS(WEBSOCKET_URL);
        const stompClient = over(socket);

        stompClient.connect({}, () => {
            console.log("✅ STOMP connected");
            stompClient.subscribe("/topic/order-status", (msg) => {
                const update = JSON.parse(msg.body);
                console.log("📨 Received update:", update);
                setLiveOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === update?.orderId
                            ? { ...order, status: update.status }
                            : order
                    )
                );
            });
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                <div className="bg-white rounded-2xl w-[90%] max-w-2xl p-4 shadow-xl max-h-[90vh] overflow-y-auto flex flex-col gap-4">
                    {/* Header */}
                    <div className="text-center mb-2 bg-gray-100 rounded-xl p-2">
                        <h2 className="text-2xl font-bold">All Orders</h2>
                        <p className="text-lg font-semibold text-gray-600">
                            Waiter will come for confirmation
                        </p>
                    </div>

                    {/* Orders List */}
                    {/* Loading State */}
                    {loading ? (
                        // Skeleton Placeholder
                        Array.from({ length: 2 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="animate-pulse border rounded-xl p-3 shadow-sm bg-gray-100 mb-2"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                                            <div className="h-4 bg-gray-300 rounded w-48"></div>
                                        </div>
                                        <div className="h-4 bg-gray-300 rounded w-10"></div>
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 mt-3"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Actual Orders
                        liveOrders.map((order) => {
                            const totalAmount = order.orderItems.reduce(
                                (sum, item) => sum + item.food?.offerPrice * item.quantity,
                                0
                            );
                            const status = order.status;
                            const statusInfo = statusConfig[status] || {
                                icon: <FaRegFaceGrinBeamSweat />,
                                color: "text-gray-400",
                                label: formatEnumString(status)
                            };

                            return (
                                <div
                                    key={order.id}
                                    className="border rounded-xl p-3 shadow-sm bg-gray-50 mb-2"
                                >
                                    {/* Table Number */}
                                    <div className="flex justify-between items-center text-md font-semibold text-gray-700 border-b pb-1 mb-2">
                                        <span>Table No: {order.tableNumber}</span>
                                        <span>Total: ₹{totalAmount} + GST</span>
                                    </div>

                                    {/* Items */}
                                    {order.orderItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-start py-2 border-b border-gray-200"
                                        >
                                            <div className="flex items-start gap-2">
                                                <img
                                                    className="w-5 h-5"
                                                    src={`${item.food?.veg ? Veg : nonVeg}`}
                                                    alt={`${item.food?.veg ? "Veg" : "Non-Veg"}`}
                                                />
                                                <p className="font-medium text-base w-[90%]">
                                                    {item.food?.name}
                                                </p>
                                            </div>
                                            <div className="flex items-end gap-1 flex-nowrap">
                                                <p className="font-medium text-base">x</p>
                                                <p className="font-medium text-base">{item?.quantity}</p>
                                            </div>
                                            <p className="text-base px-3 font-semibold whitespace-nowrap">
                                                ₹{item.food?.offerPrice * item.quantity}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Status */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className={`text-2xl ${statusInfo.color}`}>
                                            {statusInfo.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Order Status</p>
                                            <p className="text-base font-semibold">
                                                {formatEnumString(order?.status)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Bottom Buttons */}
                    <div className="flex justify-between items-center p-2 mt-4">
                        <button
                            onClick={handleClose}
                            className="py-2 px-4 border-2 border-green-500 text-green-600 font-bold rounded-xl text-md hover:bg-green-50"
                        >
                            + ADD MORE ITEMS
                        </button>
                        <button
                            onClick={ringBell}
                            disabled={bellLoading}
                            className="w-18 h-18 rounded-full bg-black border-[6px]
                        border-gray-300 flex flex-col items-center justify-center text-yellow-400 z-10"
                        >
                            {bellLoading ? (
                                <div className="flex space-x-1 mt-1">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></span>
                                </div>
                            ) : (
                                <MdRoomService className="text-2xl mb-0.5" />
                            )}
                            <span className="text-xs font-medium">{bellLoading ? "Ringing" : "Ring"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderPlacedModal;
