import { Pencil, Trash2 } from "lucide-react";
import veg from "../assets/veg.png";
import nonVeg from "../assets/Non-veg.png";
import AddItemModal from "./AddItemModal.jsx";
import React, {useState} from "react";
import axios from "axios";
import {DELETE_FOOD_ITEM, UPDATE_FOOD_ITEM} from "../utils/config.js";
import {validateFoodForm} from "../utils/Utility.js";

const FoodItemCard = ({ food, toggleAvailability, setToast, fetchFoodItems, categories }) => {
    const token = localStorage.getItem("token");

    const [showItemModal, setShowItemModal] = useState(false);
    const [foodItem, setFoodItem] = useState(food);

    const showAddItemModal = () => {
        setShowItemModal(true);
    }

    const closeAddItemModal = () => {
        setShowItemModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateFoodForm(foodItem, setToast)) return;
        try {
            const response = await axios.put(UPDATE_FOOD_ITEM(foodItem.id), foodItem, { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchFoodItems(foodItem.subCategory.id);
            closeAddItemModal();
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.error("Error adding food item", error);
        }
    }

    async function handleDelete() {
        try {
            const response = await axios.delete(DELETE_FOOD_ITEM(foodItem.id), { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchFoodItems(foodItem.subCategory.id);
            closeAddItemModal();
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.error("Error deleting food item", error);
        }
    }

    return (
        <div className="flex items-center flex-wrap md:flex-nowrap p-3 my-4 md:mx-2 border-b-2 border-gray-200">
            {/* Food Image */}
            <img src={food.imageUrl} alt={food.name} className="w-18 h-18 md:h-16 rounded-md object-cover my-2" />

            {/* Food Details */}
            <div className="md:flex-1 ml-3 block text-left">
                <div className="flex items-center space-x-2">
                    {/* Veg/Non-Veg Icon */}
                    <img
                        src={`${food.veg ? veg : nonVeg}`}
                        alt={food.veg ? "Vegetarian" : "Non-Vegetarian"}
                        className="w-4 h-4"
                    />
                    {/* Food Name */}
                    <h3 className="text-md font-semibold">{food.name}</h3>
                </div>

                {/* Price Details */}
                <p className="text-sm text-gray-500">
                    <span className="line-through text-gray-400">₹{food.menuPrice}</span> ₹{food.offerPrice}
                </p>
            </div>


            {/* Stock Toggle */}
            <div className="flex items-center space-x-2 w-1/2 md:w-auto">
                {/* Toggle Button */}
                <button
                    onClick={() => toggleAvailability(food.id)}
                    aria-pressed={food.available}
                    className={`relative w-11 h-6 flex items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        food.available ? "bg-green-500 shadow-lg shadow-green-300" : "bg-red-500 shadow-lg shadow-red-300"
                    }`}
                >
                    {/* Toggle Knob */}
                    <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out shadow-md ${
                            food.available ? "translate-x-5" : "translate-x-0"
                        }`}
                    ></span>
                </button>

                {/* Status Text */}
                <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                        food.available ? "text-green-700" : "text-red-700"
                    }`}
                >
                    {food.available ? "In stock" : "Out of stock"}
                </span>
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 ml-auto md:ml-3">
                <button
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-200"
                    onClick={showAddItemModal}
                    aria-label="Edit item"
                >
                    <Pencil size={16} />
                </button>
                <button
                    className="p-2 rounded-md text-red-600 hover:bg-red-200"
                    onClick={handleDelete}
                    aria-label="Delete item"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Modal for editing */}
            <AddItemModal
                showItemModal={showItemModal}
                closeAddItemModal={closeAddItemModal}
                foodItem={foodItem}
                setFoodItem={setFoodItem}
                handleSubmit={handleSubmit}
                setToast={setToast}
                categories={categories}
            />
        </div>
    );
};

export default FoodItemCard;