import React, {useCallback, useEffect, useState} from "react";
import CategoryList from "./CategoryList";
import CategoryDetails from "./CategoryDetails";
import axios from "axios";
import {
    ADD_CATEGORY,
    FETCH_CATEGORIES,
    FETCH_SUBCATEGORY_FOOD
} from "../utils/config.js";
import AddCategoryModal from "../modals/AddCategoryModal.jsx";

const SetUpMenu = ({ setToast }) => {
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foodLoading, setFoodLoading] = useState(false);
    const [foodItems, setFoodItems] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_CATEGORIES, {headers: { Authorization: `Bearer ${token}` }});
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCategories().then(r => r);
    }, [fetchCategories]);

    const fetchFoodItems = useCallback(async () => {
        if(!selectedSubCategory) return;
        setFoodLoading(true);
        try {
            const response = await axios.get(FETCH_SUBCATEGORY_FOOD(selectedSubCategory.id),{headers:{Authorization: `Bearer ${token}`}});
            setFoodItems(response.data);
        } catch (error) {
            console.error("Error fetching food Items", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        } finally {
            setFoodLoading(false);
        }
    }, [selectedSubCategory, setToast, token])

    useEffect(() => {
        fetchFoodItems().then(f => f);
    }, [fetchFoodItems]);


    // Open & Close Modals
    const openModal = () => {
        setSelectedCategory(null);
        setCategoryName("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCategoryName("");
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        if (categoryName.trim()) {
            const newCategory = { name: categoryName, subCategories: [], items: 0 };
            try {
                const response = await axios.post(ADD_CATEGORY, newCategory, { headers: { Authorization: `Bearer ${token}` }});
                setToast({ message: response?.data.message, type: "success" });
                await fetchCategories();
                closeModal();
            } catch (error) {
                console.error("Error adding category:", error);
                setToast({message: error.response ? error.response.data : error.message, type: "error"});
            } finally {
                setButtonLoading(false);
            }
        }
    };

    useEffect(() => {
        setSelectedCategory(categories[0]);
    }, [categories]);

    return (
        <div className="w-full bg-white p-5 md:p-8 rounded-2xl">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center md:text-left">
                {categories.length === 0 ? "Setup Your Menu" : "Update your Menu"}
            </h1>

            {categories.length === 0 ? (
                <div className="flex flex-col items-start justify-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
                    <button
                        className="bg-purple-600 cursor-pointer text-white font-sans rounded-md py-3 p-5 w-full md:w-auto hover:bg-purple-800"
                        onClick={openModal}
                    >
                        + ADD CATEGORY
                    </button>
                </div>
            ) : (
                <div className="flex flex-col md:grid md:grid-cols-[2fr_1px_3fr] gap-4 mt-6">
                    <CategoryList
                        categories={categories}
                        setSelectedCategory={setSelectedCategory}
                        selectedCategory={selectedCategory}
                        selectedSubCategory={selectedSubCategory}
                        setSelectedSubCategory={setSelectedSubCategory}
                        openModal={openModal}
                        closeModal={closeModal}
                        showModal={showModal}
                        categoryName={categoryName}
                        setCategoryName={setCategoryName}
                        setToast={setToast}
                        fetchCategories={fetchCategories}
                    />

                    {/* Divider */}
                    <div className="hidden md:block bg-gray-300 w-[1px]"></div>

                    <CategoryDetails
                        selectedCategory={selectedCategory}
                        selectedSubCategory={selectedSubCategory}
                        setToast={setToast}
                        categories={categories}
                        foodItems={foodItems}
                        setFoodItems={setFoodItems}
                        loading={foodLoading}
                        fetchItems={fetchFoodItems}
                    />
                </div>

            )}

            <AddCategoryModal
                buttonLoading={buttonLoading}
                showModal={showModal}
                closeModal={closeModal}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                handleAddCategory={handleAddCategory}
            />
        </div>
    );
};

export default SetUpMenu;
