import React, {useCallback, useEffect, useState} from "react";
import { FaCheckCircle, FaUpload, FaImage } from "react-icons/fa";
import example from "../assets/example_logo.png";
import {CLOUD_NAME, FRONTEND_URL, UPLOAD_PRESET} from "../utils/config.js";
import axios from "axios";

const SetupRestaurant = ({ restaurant, setRestaurant, setToast }) => {
    const [editingSlug, setEditingSlug] = useState(false);
    const [uploading, setUploading] = useState({ logo: false, welcomeScreen: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurant((prev) => ({ ...prev, [name]: value }));
    };

    const handleSlugChange = (e) => {
        let formattedSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
        setRestaurant((prev) => ({ ...prev, pageName: formattedSlug }));
    };

    useEffect(() => {
        setRestaurant((prev) => ({
            ...prev,
            pageName: prev.name.replace(/\s+/g, "-").toLowerCase(),
        }));
    }, [restaurant.name, setRestaurant]);


    // Handle file uploads
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
            const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
            if (data?.secure_url) {
                setRestaurant((prev) => ({ ...prev, [key]: data.secure_url }));
            } else {
                setToast({message: "Image upload failed", type: "error"});
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            setToast({message:"Something went wrong while uploading the image.", type: "error"});
        } finally {
            setUploading((prev) => ({ ...prev, [key]: false }));
        }
    }, [setRestaurant, setToast]);

    return (
        <div className="flex min-h-screen justify-center items-center">
            <main className="w-full bg-white p-8 shadow-lg rounded-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Setup Your Restaurant</h1>

                {/* Restaurant Details */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Restaurant Information</h2>

                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                            <input
                                type="text"
                                name="name"
                                value={restaurant.name}
                                onChange={handleChange}
                                className="mt-2 p-3 w-full border rounded-md focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                name="mobile"
                                value={restaurant.mobile}
                                onChange={handleChange}
                                className="mt-2 p-3 w-full border rounded-md focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                    </div>

                    {/* Restaurant URL */}
                    <div className="mt-4 md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Restaurant URL</label>
                        <div className="flex items-center mt-1 border-b-2 pb-2 mr-4">
                            <span>{FRONTEND_URL}/</span>
                            {editingSlug ? (
                                <input
                                    type="text"
                                    name="pageName"
                                    value={restaurant.pageName}
                                    onChange={handleSlugChange}
                                    onBlur={() => setEditingSlug(false)}
                                    className="border-none bg-transparent focus:ring-0 w-full px-2"
                                    autoFocus
                                />
                            ) : (
                                <span className="font-semibold w-full" onClick={() => setEditingSlug(true)}>{restaurant.pageName}</span>
                            )}
                            <div className="flex justify-end">
                                <FaCheckCircle className="text-green-500 text-xl" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Logo Upload */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 md:mb-15">Restaurant Logo</label>
                        <label className="mt-2 border-dashed border-2 border-gray-300 p-8 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                            {uploading.logo ? (
                                <span className="flex items-center gap-2 text-sm text-gray-600 italic">
                                  <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                  </svg>
                                  Uploading image, please wait...
                                </span>
                            ) : (
                                <>
                                    <FaUpload className="text-gray-500 mb-2 text-2xl" />
                                    <span className="text-blue-600 font-medium">Upload Logo</span>
                                </>
                            )}
                            <input type="file" accept="image/jpeg" className="hidden" onChange={(e) => handleFileChange(e, "logo")} />
                        </label>
                    </div>

                    {/* Example Logo */}
                    <div>
                        <label className="md:pl-8 block text-sm font-medium text-gray-700">{restaurant.logo ?"Your logo" : "Example Logo"}</label>
                        <div className="p-4 rounded-lg flex items-center">
                            {restaurant.logo ? <img src={restaurant.logo} alt="Logo Preview" className="h-40 w-auto" />
                                :
                            <img src={`${example}`} alt="Example Logo" className="h-40 w-auto" />}
                        </div>
                    </div>
                </div>

                {/* Color Theme Selection */}
                {/*<div className="mt-6">*/}
                {/*    <h3 className="text-lg font-semibold text-gray-800">Select Theme Colors</h3>*/}
                {/*    <div className="grid md:grid-cols-2 gap-6 mt-2">*/}
                {/*        /!* Primary Color *!/*/}
                {/*        <div className="w-fit">*/}
                {/*            <label className="block text-sm font-medium text-gray-800">Primary Color</label>*/}
                {/*            <div className="flex items-center gap-3 mt-1 justify-start">*/}
                {/*                <input*/}
                {/*                    type="color"*/}
                {/*                    name="color1"*/}
                {/*                    value={restaurant.color1}*/}
                {/*                    onChange={handleChange}*/}
                {/*                    className="w-12 h-12 cursor-pointer"*/}
                {/*                />*/}
                {/*                <span className="text-md font-mono p-2">*/}
                {/*                    {restaurant.color1}*/}
                {/*                </span>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        /!* Text Color *!/*/}
                {/*        <div className="w-fit">*/}
                {/*            <label className="block text-sm font-medium text-gray-800">Text Color</label>*/}
                {/*            <div className="flex items-center gap-3 mt-1 justify-start">*/}
                {/*                <input*/}
                {/*                    type="color"*/}
                {/*                    name="color2"*/}
                {/*                    value={restaurant.color2}*/}
                {/*                    onChange={handleChange}*/}
                {/*                    className="w-12 h-12 cursor-pointer"*/}
                {/*                />*/}
                {/*                <span className="text-md font-mono p-2">*/}
                {/*                    {restaurant.color2}*/}
                {/*                </span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Welcome Screen Upload */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Welcome Screen Image</h3>
                    <div className="flex items-center md:flex-row flex-col gap-6 mt-2">
                        {/* Upload Box */}
                        <label className="border-dashed border-2 border-gray-300 p-6 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition w-60 h-50">
                            {uploading.welcomeScreen ? (
                                <span className="flex items-center gap-2 text-sm text-gray-600 italic">
                                  <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                  </svg>
                                  Uploading image, please wait...
                                </span>
                            ) : (
                                <>
                                    <FaImage className="text-gray-500 mb-2 text-2xl" />
                                    <span className="text-blue-600 font-medium">Upload Image</span>
                                </>
                            )}
                            <input type="file" accept="image/jpeg" className="hidden" onChange={(e) => handleFileChange(e, "welcomeScreen")} />
                        </label>

                        {/* Side-by-side Preview */}
                        {restaurant.welcomeScreen && (
                            <img
                                src={restaurant.welcomeScreen}
                                alt="Welcome Preview"
                                className="h-50 object-cover rounded-lg shadow-sm border border-gray-300"
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SetupRestaurant;
