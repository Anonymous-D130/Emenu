import React, {useCallback, useEffect, useState} from "react";
import CategoryList from "./CategoryList";
import CategoryDetails from "./CategoryDetails";
import AddCategoryModal from "./AddCategoryModal";
import AddSubCategoryModal from "./AddSubCategoryModal";
import AddItemModal from "./AddItemModal.jsx";
import axios from "axios";
import {ADD_CATEGORY, FETCH_CATEGORIES, ADD_SUBCATEGORY, ADD_FOOD_ITEM} from "../utils/config.js";
import {validateFoodForm} from "../utils/Utility.js";

const initialState = {
    id: "",
    name: "",
    imageUrl: "",
    menuPrice: 0,
    offerPrice: 0,
    available: false,
    description: "",
    foodType: "",
    meatType: null,
    servingInfo: "",
    tag: [],
    nutritionInfo: {
        calories: { value: "", unit: "grams" },
        protein: { value: "", unit: "grams" },
        carbohydrates: { value: "", unit: "grams" },
        fats: { value: "", unit: "grams" },
        fiber: { value: "", unit: "grams" },
        sugar: { value: "", unit: "grams" },
    },
    subCategory: null,
    category: null
}

const SetUpMenu = ({ setToast }) => {
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [subCategoryParent, setSubCategoryParent] = useState({
        name: "",
        subCategories: []
    });
    const [foodItem, setFoodItem] = useState(initialState);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_CATEGORIES, {headers: { Authorization: `Bearer ${token}` }});
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [setToast, token]);

    useEffect(() => {
        fetchCategories().then(r => r);
    }, [fetchCategories]);


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

    const openSubCategoryModal = (category) => {
        setSubCategoryParent(category);
        setShowSubCategoryModal(true);
    };

    const closeSubCategoryModal = () => {
        setShowSubCategoryModal(false);
        setSubCategory("");
    };

    const showAddItemModal = () => {
        setShowItemModal(true);
    }

    const closeAddItemModal = () => {
        setShowItemModal(false);
    };

    // Add Category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        if (categoryName.trim()) {
            const newCategory = { name: categoryName, subCategories: [], items: 0 };
            try {
                const response = await axios.post(ADD_CATEGORY, newCategory, { headers: { Authorization: `Bearer ${token}` }});
                setToast({ message: response?.data.message, type: "success" });
                fetchCategories().then(r => r);
                closeModal();
            } catch (error) {
                console.error("Error adding category:", error);
                setToast({message: error.response ? error.response.data : error.message, type: "error"});
            } finally {
                setButtonLoading(false);
            }
        }
    };

    // Add Subcategory
    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (subCategory.trim() && subCategoryParent?.id) {
            setButtonLoading(true);
            try {
                const payload = {name: subCategory, categoryId: subCategoryParent.id};
                const response = await axios.post(ADD_SUBCATEGORY(subCategoryParent.id), payload, {headers: { Authorization: `Bearer ${token}` }});
                setToast({ message: response?.data.message || "Subcategory added successfully", type: "success" });
                fetchCategories().then(r => r);
                closeSubCategoryModal();
            } catch (error) {
                setToast({message: error.response ? error.response.data : error.message, type: "error"});
            } finally {
                setButtonLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateFoodForm(foodItem, setToast)) return;
        setButtonLoading(true);
        try {
            const response = await axios.post(ADD_FOOD_ITEM(foodItem.subCategory?.id), foodItem, { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchCategories().then(r => r);
            closeAddItemModal();
            setFoodItem(initialState);
        } catch (error) {
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
            console.log("Error adding food item", error);
        } finally {
            setButtonLoading(false);
        }
    }

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
                        className="bg-purple-600 text-white font-sans rounded-md py-3 p-5 w-full md:w-auto"
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
                        openSubCategoryModal={openSubCategoryModal}
                        selectedSubCategory={selectedSubCategory}
                        setSelectedSubCategory={setSelectedSubCategory}
                        openModal={openModal}
                    />

                    {/* Divider */}
                    <div className="hidden md:block bg-gray-300 w-[1px]"></div>

                    <CategoryDetails
                        selectedCategory={selectedCategory}
                        selectedSubCategory={selectedSubCategory}
                        showAddItemModal={showAddItemModal}
                        closeAddItemModal={closeAddItemModal}
                        setToast={setToast}
                        categories={categories}
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

            <AddSubCategoryModal
                buttonLoading={buttonLoading}
                showSubCategoryModal={showSubCategoryModal}
                closeSubCategoryModal={closeSubCategoryModal}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                subCategoryParent={subCategoryParent}
                handleAddSubCategory={handleAddSubCategory}
            />

            <AddItemModal
                buttonLoading={buttonLoading}
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

export default SetUpMenu;
