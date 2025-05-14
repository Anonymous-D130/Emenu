import React, {useCallback, useEffect, useState} from "react";
import OrderModal from "../modals/OrderModal.jsx";
import axios from "axios";
import {
    CANCEL_ORDER,
    FETCH_ORDER_STATUS,
    FETCH_ORDERS,
    FETCH_RESTAURANT, FETCH_TODAY_ORDERS,
    UPDATE_ORDER_STATUS,
    WEBSOCKET_URL
} from "../utils/config.js";
import {formatEnumString, getDate, getTime, initialToastState} from "../utils/Utility.js";
import Toast from "../utils/Toast.jsx";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import OrdersSkeleton from "../skeleton/OrdersSkeleton.jsx";

const Orders = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTableNumber, setSelectedTableNumber] = useState(null);
    const [order, setOrder] = useState(null);
    const [toast, setToast] = useState(initialToastState);
    const [updateLoading, setUpdateLoading] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
        table: "",
        showOldOrders: false,
        sortBy: "",
        sortOrder: "asc",
    });
    const [restaurantId, setRestaurantId] = useState("");
    const [orderStatuses, setOrderStatuses] = useState({});

    const fetchOrderStatuses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_ORDER_STATUS);
            setOrderStatuses(response.data);
        } catch (error) {
            console.error(error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrderStatuses().then(r => r);
    }, [])

    useEffect(() => {
        const socket = new SockJS(WEBSOCKET_URL);
        const stompClient = over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/new-order/${restaurantId}`, (msg) => {
                const newOrder = JSON.parse(msg.body);
                setOrders(prev => [newOrder, ...prev]);
            });
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [restaurantId]);

    const fetchRestaurant = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_RESTAURANT, {headers: {Authorization: `Bearer ${token}`}});
            setRestaurantId(response.data.id);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRestaurant().then(r => r);
    }, [fetchRestaurant]);

    const fetchOrders = useCallback(async () => {
        setOrderLoading(true);
        try {
            const response = await axios.get(FETCH_ORDERS, {headers: {Authorization: `Bearer ${token}`}});
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setOrderLoading(false);
        }
    }, [token]);

    const fetchTodayOrders = useCallback(async () => {
        setOrderLoading(true);
        try {
            const response = await axios.get(FETCH_TODAY_ORDERS, {headers: {Authorization: `Bearer ${token}`}});
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setOrderLoading(false);
        }
    }, [token]);
    
    useEffect(() => {
        if (filters.showOldOrders) {
            fetchOrders().then(o => o);
        } else {
            fetchTodayOrders().then(o => o);
        }
    }, [fetchOrders, fetchTodayOrders, filters.showOldOrders]);

    const viewTableOrder = (table, order) => {
        setIsModalOpen(true);
        setSelectedTableNumber(table);
        setOrder(order);
    }

    const updateOrderStatus = async (orderId, orderStatus) => {
        setUpdateLoading(orderId);
        try {
            const response = await axios.put(UPDATE_ORDER_STATUS(orderId, orderStatus),{}, {headers: {Authorization: `Bearer ${token}`}});
            setToast({ message: response.data?.message, type: "success" });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: orderStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating orderStatus: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setUpdateLoading(null);
        }
    }

    const cancelOrder = async (orderId) => {
        setCancelLoading(orderId);
        try {
            const response = await axios.delete(CANCEL_ORDER(orderId), {headers: {Authorization: `Bearer ${token}`}});
            setToast({ message: response?.data.message, type: "success" });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: "REJECTED" } : order
                )
            );
        } catch (error) {
            console.error("Error cancelling order: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setCancelLoading(null);
        }
    }

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <div className="p-6 bg-white rounded-xl shadow-md">
                <div className="flex justify-between orderItems-center mb-4">
                    <div>
                        <h2 className="text-3xl font-bold">{filters.showOldOrders ? "All Orders" : "Today"}</h2>
                        <p className="text-md py-1 text-gray-500">
                            {new Date().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                        <button
                            className={`text-purple-700 px-4 py-2 rounded-lg font-semibold mb-4 ${showFilters ? "bg-purple-300" : "bg-purple-100"}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            :: FILTERS
                        </button>
                </div>
                <div className="p-2">
                    {showFilters && (
                        <div className="mb-3 flex flex-col md:flex-row md:justify-between md:w-full gap-2 justify-center md:items-center transition-all duration-300">
                            {/* Sort By */}
                            <div className="flex gap-2 items-center">
                                <label className="text-sm text-gray-700">Sort By:</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="p-2 border rounded-md"
                                >
                                    <option value="">None</option>
                                    <option value="createdAt">Time</option>
                                    <option value="tableNumber">Table Number</option>
                                    <option value="totalAmount">Bill Amount</option>
                                </select>

                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                                    className="p-2 border rounded-md"
                                >
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>
                            </div>

                            <select
                                className="p-2 border rounded-md"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="">All Statuses</option>
                                {orderStatuses.map((status, idx) => (
                                    <option key={idx} value={status}>
                                        {status.replace(/_/g, " ").toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {/* Table Number Filter */}
                            <input
                                type="text"
                                placeholder="Filter by Table Number"
                                className="p-2 border rounded-md"
                                value={filters.table}
                                onChange={(e) => setFilters(prev => ({ ...prev, table: e.target.value }))}
                            />
                            {/* Show Old Orders Checkbox */}
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={filters.showOldOrders}
                                    onChange={(e) => setFilters(prev => ({ ...prev, showOldOrders: e.target.checked }))}
                                />
                                Show All Orders
                            </label>

                            {/* Clear Filters Button */}
                            <button
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setFilters({
                                    status: "",
                                    table: "",
                                    showOldOrders: false,
                                    sortBy: "",
                                    sortOrder: "asc",
                                })}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
                {orderLoading ? (
                    <OrdersSkeleton />
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200">
                            <thead className="bg-gray-100 text-left text-gray-700 whitespace-nowrap">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Table No</th>
                                <th className="p-3">Order Info</th>
                                <th className="p-3">{filters.showOldOrders ? "Date" : "Time"}</th>
                                <th className="p-3">Bill Amount</th>
                                <th className="p-3">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.filter(order => {
                                const statusMatch = filters.status ? order.status === filters.status : true;
                                const tableMatch = filters.table ? order.tableNumber?.toString().includes(filters.table) : true;
                                return statusMatch && tableMatch;
                            })
                                .sort((a, b) => {
                                    const { sortBy, sortOrder } = filters;
                                    if (!sortBy) return 0;

                                    let aValue = a[sortBy];
                                    let bValue = b[sortBy];

                                    if (sortBy === "createdAt") {
                                        aValue = new Date(aValue);
                                        bValue = new Date(bValue);
                                    }

                                    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                                    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                                    return 0;
                                })
                                .map((order, index) => (
                                    <tr key={order.id} className="border-t border-gray-200">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-sm text-gray-800 shadow-sm">
                                                {order.tableNumber}
                                            </div>
                                        </td>
                                        <td
                                            className="p-3 text-gray-700 cursor-pointer"
                                            onClick={() => viewTableOrder(order.tableNumber, order)}
                                        >
                                            {order?.orderItems.length > 0 ? (
                                                order?.orderItems.map((item, i) => (
                                                <div key={i}>
                                                    {item?.foodName}
                                                    {i !== order?.orderItems.length - 1 ? ', ' : ''}
                                                </div>
                                                ))
                                            ) : <p>No Info Available</p>}
                                            {order.status === "PENDING" && (
                                                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                  NEW
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {filters.showOldOrders ? getDate(order?.createdAt) : getTime(order?.createdAt)}
                                        </td>
                                        <td className="p-3">{order.totalAmount}</td>
                                        <td className="p-3">
                                            {order.status === "PENDING" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={cancelLoading !== null || updateLoading !== null}
                                                        onClick={() => cancelOrder(order.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                                                    >
                                                        {cancelLoading === order?.id ? "Rejecting..." : "Reject"}
                                                    </button>
                                                    <button
                                                        disabled={cancelLoading !== null || updateLoading !== null}
                                                        onClick={() => updateOrderStatus(order.id, "ACCEPTED")}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
                                                    >
                                                        {updateLoading === order.id ? "Accepting..." : "Accept"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <select
                                                    value={order.status}
                                                    disabled={
                                                        order.status === "REJECTED" ||
                                                        order.status === "COMPLETED" ||
                                                        updateLoading === order.id
                                                    }
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`w-full p-2 border rounded-md outline-none ${
                                                        order.status === "REJECTED" || order.status === "COMPLETED"
                                                            ? "bg-gray-200 cursor-not-allowed text-gray-500"
                                                            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                    } ${updateLoading === order.id ? "opacity-50 cursor-wait" : ""}`}
                                                >
                                                    {orderStatuses
                                                        .filter(
                                                            (status) =>
                                                                orderStatuses.indexOf(status) >= orderStatuses.indexOf(order.status)
                                                        )
                                                        .map((item, index) => (
                                                            <option key={index} value={item}>
                                                                {formatEnumString(item)}
                                                            </option>
                                                        ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            {/* 🔻 No Orders Available Fallback */}
                            {orders.filter(order => {
                                const statusMatch = filters.status ? order.status === filters.status : true;
                                const tableMatch = filters.table ? order.tableNumber?.toString().includes(filters.table) : true;
                                return statusMatch && tableMatch;
                            }).length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500 py-6 text-lg">
                                        No orders available.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tableNumber={selectedTableNumber}
                order={order}
                updateOrderStatus={updateOrderStatus}
                cancelOrder={cancelOrder}
                acceptLoading={updateLoading}
                rejectLoading={cancelLoading}
            />
        </main>
    );
};

export default Orders;
