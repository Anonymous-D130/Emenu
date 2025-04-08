import React, {useCallback, useEffect, useState} from "react";
import FoodItemCard from "./FoodItemCard.jsx";
import axios from "axios";
import {FETCH_SUBCATEGORY_FOOD, TOGGLE_FOOD_ITEM} from "../utils/config.js";

const CategoryDetails = ({ selectedCategory, selectedSubCategory, showAddItemModal, setToast, categories }) => {
    const token = localStorage.getItem("token");
    const [foodItems, setFoodItems] = useState([]);
    const [filteredFoodItems, setFilteredFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const fetchFoodItems = useCallback(async () => {
        if(!selectedSubCategory) return;
        try {
            const response = await axios.get(FETCH_SUBCATEGORY_FOOD(selectedSubCategory.id),{headers:{Authorization: `Bearer ${token}`}});
            setFoodItems(response.data);
        } catch (error) {
            console.error("Error fetching food Items", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        }
    }, [selectedSubCategory, setToast, token])

    useEffect(() => {
        fetchFoodItems().then(f => f);
    }, [fetchFoodItems]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredFoods(foodItems);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = foodItems.filter(food =>
                food.name.toLowerCase().includes(query)
            );
            setFilteredFoods(filtered);
        }
    }, [searchQuery, foodItems]);

    const toggleAvailability = async (id) => {
        try {
            const response = await axios.put(TOGGLE_FOOD_ITEM(id),{}, {headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchFoodItems().then(f => f);
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.error("Error changing availability", error);
        }
    }

    return (
        <div className="w-full p-4">
            {selectedCategory && selectedSubCategory ? (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                            {selectedCategory.name}
                            {selectedSubCategory && (
                                <span className="text-purple-600"> &gt; {selectedSubCategory.name}</span>
                            )}
                        </h2>
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 ease-in-out shadow-md w-full md:w-auto"
                            onClick={showAddItemModal}
                        >
                            + Add New Item
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative pb-6 border-b-2 border-b-gray-200">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition"
                        />
                        <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
                    </div>
                    <div className="w-full">
                        {filteredFoodItems.length > 0 ? filteredFoodItems.map((food) => (
                            <FoodItemCard
                                key={food.id}
                                food={food}
                                toggleAvailability={toggleAvailability}
                                setToast={setToast}
                                fetchFoodItems={fetchFoodItems}
                                categories={categories}
                            />
                        )) : (
                            <div className="flex justify-center items-center text-gray-500 text-lg py-4">
                                No food items available
                            </div>
                        )
                        }
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-4">Please select a category to view details.</p>
            )}
        </div>
    );
};

export default CategoryDetails;
