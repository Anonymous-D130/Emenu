import React, {useEffect, useState} from "react";
import FoodItemCard from "./FoodItemCard.jsx";
import FoodItemCardSkeleton from "../skeleton/FoodItemCardSkeleton.jsx";
import {initialFoodItem, validateFoodForm} from "../utils/Utility.js";
import axios from "axios";
import {ADD_FOOD_ITEM} from "../utils/config.js";
import AddItemModal from "../modals/AddItemModal.jsx";

const CategoryDetails = ({ selectedCategory, selectedSubCategory, setToast, categories, foodItems, setFoodItems, loading, fetchItems }) => {
    const token = localStorage.getItem("token");
    const [filteredFoodItems, setFilteredFoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [foodItem, setFoodItem] = useState(initialFoodItem);

    useEffect(() => {
        setFoodItem(prev => ({
            ...prev,
            category: selectedCategory,
            subCategory: selectedSubCategory
        }));
    }, [selectedCategory, selectedSubCategory]);


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

    const showAddItemModal = () => {
        setShowItemModal(true);
    }

    const closeAddItemModal = () => {
        setFoodItem(prev => ({
            ...initialFoodItem,
            category: prev.category,
            subCategory: prev.subCategory,
        }));
        setShowItemModal(false);
    };

    const handleSubmit = async () => {
        if(!validateFoodForm(foodItem, setToast)) return;
        setButtonLoading(true);
        console.log(foodItem);
        try {
            const response = await axios.post(ADD_FOOD_ITEM(foodItem.subCategory?.id), foodItem, { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            await fetchItems();
            closeAddItemModal();
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.log("Error adding food item", error);
        } finally {
            setButtonLoading(false);
        }
    }

    const handleUpdateOrDelete = (updatedFood, deleted = false) => {
        setFoodItems(prevList => {
            if (deleted) {
                return prevList.filter(item => item.id !== updatedFood.id);
            } else {
                return prevList.map(item => item.id === updatedFood.id ? updatedFood : item);
            }
        });
    };

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
                        {loading ? (
                            // 🦴 Show 4 skeletons while loading
                            Array.from({ length: 2 }).map((_, idx) => <FoodItemCardSkeleton key={idx} />)
                        ) : filteredFoodItems.length > 0 ? (
                            filteredFoodItems.map((food) => (
                                <FoodItemCard
                                    key={food.id}
                                    food={food}
                                    setToast={setToast}
                                    categories={categories}
                                    onUpdateOrDelete={handleUpdateOrDelete}
                                />
                            ))
                        ) : (
                            <div className="flex justify-center items-center text-gray-500 text-lg py-4">
                                No food items available
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-4">Please select a category to view details.</p>
            )}
            <AddItemModal
                showItemModal={showItemModal}
                closeAddItemModal={closeAddItemModal}
                food={foodItem}
                setFood={setFoodItem}
                handleSubmit={handleSubmit}
                setToast={setToast}
                categories={categories}
                buttonLoading={buttonLoading}
            />
        </div>
    );
};

export default CategoryDetails;
