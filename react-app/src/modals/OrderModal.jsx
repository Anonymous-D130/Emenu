import { Modal } from "@mui/material";
import veg from "../assets/veg.png";
import nonVeg from "../assets/Non-veg.png";
import { IoCloseCircleSharp } from "react-icons/io5";

const OrderModal = ({ isOpen, onClose, tableNumber, order, updateOrderStatus, cancelOrder, acceptLoading, rejectLoading }) => {

    const handleAccept = () => {
        updateOrderStatus(order.id, "ACCEPTED");
        onClose();
    };

    const handleReject = () => {
        cancelOrder(order.id);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-screen overflow-y-auto">

                {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">
                        <IoCloseCircleSharp className="text-3xl"/>
                    </button>

                    {/* Header */}
                    <div className="flex items-center justify-evenly mb-6 p-5">
                        <h2 className="text-2xl sm:text-2xl font-bold w-1/2">
                            Order From Table Number {tableNumber}
                        </h2>
                        {/* Table Icon */}
                        <div className="relative w-14 h-14 flex items-center justify-center border-2 border-gray-500 rounded">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-gray-500 rounded"></div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-gray-500 rounded"></div>
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-gray-500 rounded"></div>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-gray-500 rounded"></div>

                            <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black text-sm">
                                {tableNumber}
                            </div>
                        </div>
                    </div>

                    {/* Subtext */}
                    {order?.status === "PENDING" && (<p className="text-sm text-gray-500 text-center mb-6">
                        Please send a waiter and<br/>
                        Get order conformations
                    </p>)}

                    {/* Order List */}
                    <ul className="divide-y divide-gray-200 mb-4 px-10">
                        {order?.orderItems.map((item, index) => (
                            <li key={index} className="flex items-center justify-between py-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`${item.veg ? veg : nonVeg}`}
                                        alt={item.veg ? "Veg" : "Non-Veg"}
                                        className="w-4 h-4"
                                    />
                                    <div>
                                        <div className="font-semibold">{item.food.name}</div>
                                        <div className="text-sm text-gray-500">({item.food.description})</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">₹{item.amount}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                </div>
                            </li>
                        ))}
                        <li className="flex items-center justify-between pt-3 font-semibold px-10">
                            <div>Total Billing Amount</div>
                            <div>₹{order?.totalAmount} + GST</div>
                        </li>
                    </ul>
                    <hr className="border-t border-gray-300 mb-4 mx-10" />
                    {/* Buttons */}
                    <div className="flex justify-between gap-4 px-8 py-2">
                        {order?.status === "PENDING" ? (
                            <>
                                <button
                                    onClick={handleReject}
                                    disabled={rejectLoading || acceptLoading}
                                    className={`w-full py-2 rounded-xl font-bold tracking-wider 
                                    ${rejectLoading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} 
                                    text-white`}>
                                    {rejectLoading ? "Rejecting..." : "REJECT"}
                                </button>

                                <button
                                    onClick={handleAccept}
                                    disabled={acceptLoading || rejectLoading}
                                    className={`w-full py-2 rounded-xl font-bold tracking-wider 
                                    ${rejectLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} 
                                    text-white`}>
                                    {rejectLoading ? "Accepting..." : "ACCEPT"}
                                </button>

                            </>
                        ) : (
                            <>
                                <button
                                    disabled
                                    className={`w-full py-2 rounded-xl cursor-not-allowed text-white font-bold tracking-wider ${order?.status === "REJECTED" ? "bg-red-300" : "bg-green-300"}`}
                                >
                                    {order?.status}
                                </button>
                            </>
                        )
                        }
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderModal;
