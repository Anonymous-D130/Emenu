import {useCallback, useEffect, useState} from "react";
import { Modal } from "@mui/material";
import { IoCloseCircle } from "react-icons/io5";
import {FaSpinner, FaUpload} from "react-icons/fa";
import {
    CLOUD_NAME,
    FETCH_MEAT_TYPES,
    FETCH_SERVING_INFO,
    FETCH_TAGS,
    UPLOAD_PRESET
} from "../utils/config.js";
import axios from "axios";
import {formatEnumString} from "../utils/Utility.js";

const AddItemModal = ({ showItemModal, closeAddItemModal, food, setFood, handleSubmit, setToast, categories, buttonLoading }) => {
    const [uploading, setUploading] = useState({ imageUrl: false });
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [meatTypes, setMeatTypes] = useState([]);
    const [foodItem, setFoodItem] = useState(food);
    const [imagePreview, setImagePreview] = useState(null);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const foodType = [
        {name: "Veg", value: "VEG"},
        {name: "Non-Veg", value: "NON_VEG"},
        {name: "Egg", value: "EGG"}
    ]
    const [tags, setTags] = useState([]);
    const [servingOptions, setServingOptions] = useState([]);

    useEffect(() => {
        if (!showItemModal) {
            setImagePreview(food?.imageUrl);
            setFoodItem(food);
        }
    }, [food, showItemModal]);

    useEffect(() => {
        if(food) setFoodItem(food);
    }, [food]);

    useEffect(() => {
        if (shouldSubmit) {
            handleSubmit();
            setShouldSubmit(false);
        }
    }, [food, handleSubmit, shouldSubmit]);


    const fetchTags = useCallback(async () => {
        try {
            const response = await axios.get(FETCH_TAGS);
            setTags(response.data);
        } catch (error) {
            console.error("Error while fetching tags:", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        }
    }, [setToast]);
    
    const fetchMeatTypes = useCallback(async () => {
        try {
            const response = await axios.get(FETCH_MEAT_TYPES);
            setMeatTypes(response.data);
        } catch (error) {
            console.error("Error while fetching meat types:", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        }
    }, [setToast]);
    
    const fetchServingInfo = useCallback(async () => {
        try {
            const response = await axios.get(FETCH_SERVING_INFO);
            setServingOptions(response.data);
        } catch (error) {
            console.error("Error while fetching serving info:", error);
            setToast({message: error.response ? error.response.data.message : error.message, type: "error"});
        }
    }, [setToast]);
    
    useEffect(() => {
        fetchTags().then(r => r);
        fetchMeatTypes().then(m => m);
        fetchServingInfo().then(s => s);
    }, [fetchMeatTypes, fetchServingInfo, fetchTags]);

    useEffect(() => {
        if(foodItem?.category){
            setSelectedCategory(foodItem?.category);
        } else {
            setSelectedCategory(null);
        }
    }, [foodItem?.category]);

    useEffect(() => {
        if (selectedCategory && selectedCategory.subCategories) {
            setSubCategories(selectedCategory.subCategories);
        } else {
            setSubCategories([]);
        }
    }, [selectedCategory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFoodItem((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((item) => item !== value),
            }));
        } else {
            setFoodItem((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleNutritionChange = (e) => {
        const { name, value } = e.target;
        const [parent, nutrient, key] = name.split('.');

        setFoodItem((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [nutrient]: {
                    ...prev[parent][nutrient],
                    [key]: value
                }
            }
        }));
    };

    const handleFileChange = useCallback(async (event, key) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("File size should be less than 2MB.");
            return;
        }
        setUploading((prev) => ({ ...prev, [key]: true }));
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            const data = response.data;
            if (data?.secure_url) {
                setFoodItem((prev) => ({ ...prev, [key]: data.secure_url }));
                setImagePreview(data.secure_url);
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            alert("Something went wrong while uploading the image.");
        } finally {
            setUploading((prev) => ({ ...prev, [key]: false }));
        }
    }, [setFoodItem, setImagePreview]);

    return (
        <Modal open={showItemModal} onClose={closeAddItemModal}>
            <div className="w-9/10 md:w-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Item Details</h2>
                    <IoCloseCircle
                        className="text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={closeAddItemModal}
                    />
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    setFood(foodItem);
                    setShouldSubmit(true);
                }} className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {/* Item Name */}
                    <div className="col-span-2 sm:col-span-2">
                        <label className="font-semibold">Item Name <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={foodItem?.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Eg. Desserts"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-2 sm:col-span-2 sm:row-span-2">
                        <label className="font-semibold mb-2">Item Photo <span className="text-red-600">*</span></label>
                        <label className="border-dashed border-2 border-gray-300 p-2 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                            {uploading.imageUrl ? (
                                <span className="flex items-center gap-2 text-sm text-gray-600 italic p-8">
                                  <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                  </svg>
                                  Uploading image, please wait...
                                </span>
                            ) : imagePreview ? (
                                <img src={`${imagePreview}`} alt="Preview" className="h-30 object-contain rounded-md border border-gray-300 shadow-md" />
                            ) : (
                                <div className="p-8 flex flex-col items-center justify-center">
                                    <FaUpload className="text-gray-500 mb-2 text-2xl" />
                                    <span className="text-blue-600 font-medium">Upload Image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "imageUrl")} />
                        </label>
                    </div>

                    {/* Pricing */}
                    <div className="col-span-2 sm:col-span-2 md:col-span-1">
                        <label className="font-semibold">MRP Price <span className="text-red-600">*</span></label>
                        <input
                            type="number"
                            name="menuPrice"
                            value={foodItem?.menuPrice}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter MRP Price"
                            required
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-2 md:col-span-1">
                        <label className="font-semibold">Offer Price <span className="text-red-600">*</span></label>
                        <input
                            type="number"
                            name="offerPrice"
                            value={foodItem?.offerPrice}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter Offer Price"
                        />
                    </div>

                    {/* Description */}
                    <div className="col-span-2 sm:col-span-4">
                        <label className="font-semibold">Item Description</label>
                        <textarea
                            name="description"
                            value={foodItem?.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter item description"
                            rows={3}
                        />
                    </div>

                    {/* Food Type */}
                    <div className="col-span-2">
                        <label className="font-semibold block mb-1">Food Type <span className="text-red-600">*</span></label>
                        <div className="flex gap-3">
                            {foodType.map((type) => (
                                <label
                                    key={type.value}
                                    className="flex items-center w-1/4 min-w-fit max-w-screen gap-2 cursor-pointer border border-gray-300 rounded-md p-2"
                                >
                                    <input
                                        type="radio"
                                        name="foodType"
                                        value={type.value}
                                        checked={foodItem?.foodType === type.value}
                                        onChange={handleChange}
                                    />
                                    {type.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Meat Type (Only if Non-Veg) */}
                    <div className="col-span-2">
                        <label className="font-semibold block mb-1">Meat Type</label>
                        <select
                            name="meatType"
                            value={foodItem?.meatType || ""}
                            onChange={handleChange}
                            disabled={foodItem?.foodType !== "NON_VEG"}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none`}
                        >
                            <option value="" disabled hidden>Select</option>
                            {meatTypes.map((meatType) => (
                                <option key={meatType} value={meatType}>{formatEnumString(meatType)}</option>
                            ))}
                        </select>
                    </div>

                    {/*Menu Category*/}
                    <div className="col-span-2 md:col-span-1">
                        <label className="font-semibold block mb-1">Menu Category <span className="text-red-600">*</span></label>
                        <select
                            name="category"
                            value={foodItem?.category?.id || ""}
                            onChange={(e) => {
                                const category = categories.find(cat => cat.id === e.target.value);
                                setSelectedCategory(category);
                                setFoodItem(prev => ({
                                    ...prev,
                                    category: category,
                                    subCategory: ""
                                }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="" disabled hidden>Select</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*SubCategory*/}
                    <div className="col-span-2 md:col-span-1">
                        <label className="font-semibold block mb-1">Sub-Category  <span className="text-red-600">*</span></label>
                        <select
                            name="subCategory"
                            value={foodItem?.subCategory?.id || ""}
                            onChange={(e) => {
                                const selectedSub = subCategories?.find(
                                    sub => sub.id === e.target.value
                                );
                                setFoodItem(prev => ({
                                    ...prev,
                                    subCategory: selectedSub
                                }));
                            }}
                            disabled={!selectedCategory}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="" disabled hidden>Select</option>
                            {subCategories?.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Serving Info */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="font-semibold block mb-1">Serving Info <span className="text-red-600">*</span></label>
                        <select
                            name="servingInfo"
                            value={foodItem?.servingInfo}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="" disabled hidden>Select</option>
                            {servingOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tag Info */}
                    <div className="col-span-3">
                        <label className="font-semibold block mb-1">Tag Info <span className="text-red-600">*</span></label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <label
                                    key={tag}
                                    className="flex w-fit items-center gap-2 cursor-pointer border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <input
                                        type="checkbox"
                                        name="tag"
                                        value={tag}
                                        checked={foodItem?.tag?.includes(tag)}
                                        onChange={handleChange}
                                        className="accent-purple-600 size-4"
                                    />
                                    {formatEnumString(tag)}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Nutritional Info */}
                    <div className="col-span-2 md:col-span-3">
                        <label className="font-semibold block mb-1">Nutritional Info (per serving)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.keys(foodItem?.nutritionInfo)
                                .map((nutrient) => (
                                    <div key={nutrient}>
                                        <label className="text-sm text-gray-700 block mb-1 capitalize">
                                            {nutrient} count
                                        </label>
                                        <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                                            <input
                                                type="number"
                                                name={`nutritionInfo.${nutrient}.value`}
                                                value={foodItem?.nutritionInfo[nutrient]?.value}
                                                onChange={handleNutritionChange}
                                                className="w-full p-2 outline-none"
                                            />
                                            <select
                                                name={`nutritionInfo.${nutrient}.unit`}
                                                value={foodItem?.nutritionInfo[nutrient]?.unit}
                                                onChange={handleNutritionChange}
                                                className="absolute right-0 bg-transparent px-2 text-gray-700 cursor-pointer focus:outline-none"
                                            >
                                                <option value="grams">grams</option>
                                                <option value="mg">mg</option>
                                                <option value="mcg">mcg</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="col-span-2 md:col-span-3 my-3 py-2">
                            <p className="font-bold text-xs">How is calorie count calculated?</p>
                            <p className="font-sans text-xs">4 x Protein (in g) + 4 x Carbs (in g) + 9 x Fats (in g) = Calorie count (in Kcal)</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 md:col-span-3">
                        <button
                            type="submit"
                            disabled={buttonLoading}
                            className={`w-full py-2 rounded-lg font-medium text-white transition duration-200 flex items-center justify-center gap-2 
                                ${buttonLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {buttonLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Item"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

    );
};

export default AddItemModal;
