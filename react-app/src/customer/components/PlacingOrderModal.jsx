import { Modal} from "@mui/material";
import { IoChevronForward } from "react-icons/io5";
import {MdOutlineArrowBackIos, MdRoomService} from "react-icons/md";
import React, {useEffect, useState} from "react";
import Veg from "../../assets/veg.png";
import nonVeg from "../../assets/Non-veg.png";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import axios from "axios";
import {PLACE_ORDER} from "../../utils/config.js";

const PlacingOrderModal = ({ open, handleClose, cart, setCart, tableNumber, setShowModal, refreshOrders, setToast, customerId, ringBell, bellLoading }) => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        setCartItems(cart.items);
    }, [cart]);

    const updateQuantity = (foodId, delta) => {
        setCart(prevCart => {
            const updatedItems = prevCart.items.map(item => {
                if (item.food.id === foodId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean);

            return { ...prevCart, items: updatedItems };
        });
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + item.food.offerPrice * item.quantity, 0);

    const placeOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.post(PLACE_ORDER(customerId), cart);
            setToast({ message: response?.data.message, type: "success" });
            setCart({
                id: null,
                items: [],
                totalAmount: 0,
            });
            refreshOrders();
            setCartItems([]);
            setShowModal(true);
            handleClose();
        } catch (error) {
            console.error("Error placing order:", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <main className="absolute top-5/9 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-full md:w-1/2 h-4/5 p-4 shadow-lg sm:p-6 flex flex-col">

                {/* Header */}
                <div className="flex items-center gap-2 mb-2 py-4 px-3 bg-gray-100 rounded-2xl rounded-b-none">
                    <button onClick={handleClose} className="text-black text-xl bg-white rounded-full p-2">
                        <MdOutlineArrowBackIos className="text-2xl" />
                    </button>
                    <h2 className="text-2xl font-bold">Placing Order</h2>
                </div>
                <p className="text-md text-gray-600 border-b-2 border-gray-300 p-1 pb-2">Your Table Number : {tableNumber}</p>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1">
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-400 py-2">
                            <div className="flex gap-2 items-center">
                                <img className="w-5 h-5" src={`${item.food.veg === true ? Veg : nonVeg}`} alt={item.food.veg === true ? "Veg" : "nonVeg"}/>
                                <div className="flex flex-col items-start justify-center">
                                    <h4 className="font-medium text-base text-wrap">{item.food.name}</h4>
                                    <p className="text-gray-700 text-md font-semibold">₹{item.food.offerPrice}</p>
                                </div>
                            </div>
                            <div className="flex items-center border border-green-500 rounded-lg p-1">
                                <div className="flex items-center rounded-lg p-1">
                                    <button onClick={() => updateQuantity(item.food.id, 1)} className="text-green-500 text-lg px-2">
                                        <FaPlusCircle />
                                    </button>
                                    <span className="text-green-500 text-lg px-2">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.food.id, -1)} className="text-red-500 text-lg px-2">
                                        <FaCircleMinus />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="relative mt-4">
                    {/* Ring Button */}
                    <div className="relative">
                        <button
                            onClick={ringBell}
                            disabled={bellLoading}
                            className="fixed bottom-30 right-6 w-18 h-18 rounded-full bg-black border-[6px]
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

                    {/* Place Order Button */}
                    <button
                        disabled={loading || totalAmount === 0 || cart.items.length === 0}
                        onClick={placeOrder}
                        className={`w-full flex items-center justify-between mb-6 p-4 rounded-xl transition-all ${
                            loading || totalAmount === 0 || cart.items.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                        <div className="text-sm">
                            <p>Total Amount:</p>
                            <p className="font-bold">₹{totalAmount} + GST</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span>{loading ? "Placing..." : "Place Order"}</span>
                            <IoChevronForward className="text-xl" />
                        </div>
                    </button>
                </footer>
            </main>
        </Modal>
    );
};

export default PlacingOrderModal;