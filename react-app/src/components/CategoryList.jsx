import React, {useState} from "react";
import {MdAdd, MdDelete, MdEdit} from "react-icons/md";
import AddCategoryModal from "../modals/AddCategoryModal.jsx";
import AddSubCategoryModal from "../modals/AddSubCategoryModal.jsx";
import {
    ADD_CATEGORY,
    ADD_SUBCATEGORY,
    DELETE_CATEGORY,
    DELETE_SUBCATEGORY,
    UPDATE_CATEGORY,
    UPDATE_SUBCATEGORY
} from "../utils/config.js";
import axios from "axios";
import {TiTick} from "react-icons/ti";
import {LuLoader} from "react-icons/lu";
import Swal from 'sweetalert2';

const CategoryList = ({categories, setSelectedCategory, selectedCategory, selectedSubCategory, setSelectedSubCategory, openModal, closeModal, showModal, categoryName, setCategoryName, setToast, fetchCategories}) => {
    const token = localStorage.getItem("token");
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subCategory, setSubCategory] = useState("");
    const [subCategoryParent, setSubCategoryParent] = useState({
        name: "",
        subCategories: []
    });
    const [editMode, setEditMode] = useState({ type: "", id: null }); // "category" or "subCategory"
    const [editName, setEditName] = useState("");

    const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
    const openSubCategoryModal = (category) => {
        setSubCategoryParent(category);
        setShowSubCategoryModal(true);
    };

    const closeSubCategoryModal = () => {
        setShowSubCategoryModal(false);
        setSubCategory("");
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
                fetchCategories();
                closeModal();
            } catch (error) {
                console.error("Error adding category:", error);
                setToast({message: error.response ? error.response.data : error.message, type: "error"});
            } finally {
                setButtonLoading(false);
            }
        }
    };

    const handleUpdateCategory = async () => {
        setLoading(editMode.id);
        try {
            const response = await axios.put(UPDATE_CATEGORY(editMode.id), {name: editName}, { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchCategories();
            setEditMode({ type: "", id: null });
            setEditName("");
        } catch (error) {
            console.error("Error updating category:", error);
            setToast({message: error.response ? error.response.data?.message : error.message, type: "error"});
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateSubCategory = async () => {
        setLoading(editMode.id);
        try {
            const response = await axios.put(UPDATE_SUBCATEGORY(editMode.id), {name: editName}, { headers: { Authorization: `Bearer ${token}` }});
            setToast({ message: response?.data.message, type: "success" });
            fetchCategories();
            setEditMode({ type: "", id: null });
            setEditName("");
        } catch (error) {
            console.error("Error updating subCategory:", error);
            setToast({message: error.response ? error.response.data?.message : error.message, type: "error"});
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the category permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        setLoading(categoryId);
        try {
            const response = await axios.delete(DELETE_CATEGORY(categoryId), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setToast({ message: response?.data.message, type: "success" });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting category:", error);
            setToast({
                message: error.response ? error.response.data?.message : error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubCategory = async (subCategoryId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the subcategory permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        setLoading(subCategoryId);
        try {
            const response = await axios.delete(DELETE_SUBCATEGORY(subCategoryId), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setToast({ message: response?.data.message, type: "success" });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting subcategory:", error);
            setToast({
                message: error.response ? error.response.data?.message : error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
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
                fetchCategories();
                closeSubCategoryModal();
            } catch (error) {
                setToast({message: error.response ? error.response.data : error.message, type: "error"});
            } finally {
                setButtonLoading(false);
            }
        }
    };

    const handleSelectCategory = (category) => {
        if (selectedCategory !== category) {
            setSelectedCategory(category);
            setSelectedSubCategory(category.subCategories[0]);
        } else {
            setSelectedCategory("");
            setSelectedSubCategory("");
        }
    };
    return (
        <div className="w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
                <button
                    className="bg-purple-600 text-white rounded-lg py-2 px-3 md:px-4 text-sm"
                    onClick={openModal}
                >
                    + ADD
                </button>
            </div>

            <ul className="space-y-3">
                {categories.map((category, index) => (
                    <li key={index} className="cursor-pointer">
                        <div
                            className={`p-3 md:p-4 rounded-lg flex justify-between items-center transition-all duration-300 ${
                                selectedCategory === category
                                    ? "bg-purple-100 text-purple-700 border border-purple-500"
                                    : "hover:bg-gray-100 border border-gray-300"
                            }`}
                            onClick={() => handleSelectCategory(category)}
                        >
                            {editMode.type === "category" && editMode.id === category.id ? (
                                <input
                                    className="border px-2 py-1 text-sm rounded"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            ) : (
                                <span className="font-medium text-gray-800 flex items-center">
                                    {category.name}
                                </span>
                            )}
                            {(editMode.type === "category" && editMode.id === category.id) ?
                                <button
                                    className="ml-2 text-yellow-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-yellow-600 hover:text-white px-1"
                                    onClick={handleUpdateCategory}
                                    disabled={loading}
                                >
                                    {loading === editMode.id ? <LuLoader/> : <TiTick className="text-lg"/>}
                                </button>
                                : <div className="flex items-center justify-center">
                                <button
                                    className="ml-2 bg-blue-500 text-white text-xs px-1 py-1 md:py-1.5 rounded-md hover:bg-blue-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openSubCategoryModal(category);
                                    }}
                                >
                                    <MdAdd className="text-lg"/>
                                </button>
                                <button
                                    className="ml-2 text-yellow-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-yellow-600 hover:text-white px-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditMode({type: "category", id: category.id});
                                        setEditName(category.name);
                                    }}
                                >
                                    <MdEdit className="text-lg" />

                                </button>
                                <button
                                    className="ml-2 text-red-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-red-600 hover:text-white px-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(category.id);
                                    }}
                                    disabled={loading === category.id}
                                >
                                    {loading === category.id ? <LuLoader/> :<MdDelete className="text-lg"/>}
                                </button>
                            </div>}
                        </div>

                        {selectedCategory === category && category.subCategories.length > 0 && (
                            <div className="ml-4 md:ml-6 mt-2 space-y-1">
                                {category.subCategories.map((sub, i) => (
                                    <div
                                        key={i}
                                        className={`pl-3 md:pl-4 py-1 border-l-2 border-purple-400 cursor-pointer text-sm md:text-base hover:bg-purple-800 flex justify-between items-center hover:text-white
                                        ${selectedSubCategory === sub ? "bg-purple-500 text-white" : "text-purple-600"}`}
                                        onClick={() => setSelectedSubCategory(sub)}
                                    >
                                        {editMode.type === "subCategory" && editMode.id === sub.id ? (
                                            <input
                                                className="border px-2 py-1 text-sm rounded"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <span className="font-medium flex items-center">↳ {sub.name}</span>
                                        )}
                                        {(editMode.type === "subCategory" && editMode.id === sub.id) ?
                                            <button
                                                className="ml-2 text-yellow-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-yellow-600 hover:text-white px-2"
                                                onClick={handleUpdateSubCategory}
                                                disabled={loading}
                                            >
                                                {loading === editMode.id ? <LuLoader/> : <TiTick className="text-lg"/>}
                                            </button>
                                            : <div className="flex items-center justify-center">
                                                <button
                                                    className="ml-2 text-yellow-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-yellow-600 hover:text-white px-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditMode({ type: "subCategory", id: sub.id, parentId: category.id });
                                                        setEditName(sub.name);
                                                    }}
                                                >
                                                    <MdEdit className="text-lg" />

                                                </button>
                                                <button
                                                    className="ml-2 text-red-600 text-xs py-1 md:py-1.5 rounded-md hover:bg-red-600 hover:text-white px-1 mr-4"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSubCategory(sub.id);
                                                    }}
                                                    disabled={loading === sub.id}
                                                >
                                                    {loading === sub.id ? <LuLoader/> :<MdDelete className="text-lg"/>}
                                                </button>
                                            </div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
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
        </div>
    );
};

export default CategoryList;