import React, {useEffect, useState} from "react";
import { Modal } from "@mui/material";
import Veg from "../../assets/veg.png";
import nonVeg from "../../assets/Non-veg.png";
import { IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";
import {MdRoomService} from "react-icons/md";
import PlacingOrderModal from "./PlacingOrderModal.jsx";

const FoodItemModal = ({ open, handleClose, food, cart, setCart, tableNumber, refreshOrders, setShowModal, setToast, customerId, ringBell, bellLoading }) => {
    const [quantity, setQuantity] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (food && cart) {
            const existingItem = cart.items.find(item => item.food.id === food.id);
            setQuantity(existingItem ? existingItem.quantity : 0);
        }
    }, [food, cart]);

    const updateCart = (newQty) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.items.findIndex(i => i.food.id === food.id);
            let updatedItems;
            if (existingItemIndex !== -1) {
                if (newQty === 0) {
                    updatedItems = prevCart.items.filter((_, idx) => idx !== existingItemIndex);
                } else {
                    updatedItems = [...prevCart.items];
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: newQty,
                        food,
                    };
                }
            } else {
                if (newQty > 0) {
                    updatedItems = [
                        ...prevCart.items,
                        {
                            quantity: newQty,
                            food,
                        }
                    ];
                } else {
                    updatedItems = [...prevCart.items];
                }
            }
            return {
                ...prevCart,
                items: updatedItems,
            };
        });
    };

    const increment = () => {
        const newQty = quantity + 1;
        setQuantity(newQty);
        updateCart(newQty);
    };

    const decrement = () => {
        const newQty = quantity > 0 ? quantity - 1 : 0;
        setQuantity(newQty);
        updateCart(newQty);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 bg-white rounded-2xl w-full p-4 pb-25 shadow-lg sm:p-6 sm:w-[90%] sm:rounded-xl md:max-w-md">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-15 left-1/2 transform -translate-x-1/2 bg-red-100 rounded-full w-10 h-10 flex items-center justify-center text-red-500 shadow"
                >
                    <IoMdClose className="text-3xl font-bold" />
                </button>

                {/* Image */}
                <img
                    src={food?.imageUrl}
                    alt="Gosht Haleem"
                    className="rounded-xl w-full h-48 object-cover mb-3"
                />

                {/* Title and Price */}
                <img className="w-5 h-5" src={`${food.veg === true ? Veg : nonVeg}`} alt={food.veg === true ? "Veg" : "nonVeg"}/>
                <h2 className="text-xl font-bold text-gray-800">
                    {food?.name}
                </h2>
                <p className="text-sm my-1">
                    <span className="line-through text-gray-500">₹{food?.menuPrice}</span>{" "}
                    <span className="text-green-600 font-bold">₹{food?.offerPrice}</span>
                </p>

                {/* Description */}
                <p className="text-sm text-gray-700 mt-1">
                    {food?.description}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between border-3 border-green-600 rounded-xl px-8 py-3 mt-4 w-full mx-auto">
                    {quantity !== 0 ? (
                        <>
                            <button onClick={increment} className="text-green-600 text-xl font-bold">
                                <FaPlusCircle className="text-2xl"/>
                            </button>
                            <span className="text-base text-green-600 font-bold">{quantity}</span>
                            <button onClick={decrement} className="text-red-600 text-xl font-bold">
                                <FaCircleMinus className="text-2xl"/>
                            </button>
                        </>
                    ) : (
                        <button onClick={increment} className="text-green-600 text-xl font-bold text-center w-full">
                            + ADD
                        </button>
                    )}
                </div>

                <PlacingOrderModal
                    open={isModalOpen}
                    cart={cart}
                    setCart={setCart}
                    handleClose={() => setIsModalOpen(false)}
                    tableNumber={tableNumber}
                    refreshOrders={refreshOrders}
                    setShowModal={setShowModal}
                    setToast={setToast}
                    customerId={customerId}
                    ringBell={ringBell}
                    bellLoading={bellLoading}
                />


                {/* Footer */}
                <footer className="flex items-center justify-between mt-8 gap-4">
                    {quantity > 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-between w-7/9 bg-black p-6 rounded-xl"
                        >
                            <span className="text-md text-white">{quantity} Items Added</span>
                            <div
                                className="flex items-center justify-end gap-2 text-white cursor-pointer rounded-xl text-sm font-medium transition-all"
                            >
                                <span>Place Order</span>
                                <IoChevronForward className="text-xl"/>
                            </div>
                        </button>)}
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
                </footer>
            </main>
        </Modal>
    );
};

export default FoodItemModal;
