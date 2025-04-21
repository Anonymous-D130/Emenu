import React, {useCallback, useEffect, useState} from "react";
import { FaCheckCircle, FaUpload, FaImage } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import example from "../assets/img.png";
import {CHECK_PAGE_NAME, CLOUDINARY_URL, FRONTEND_URL, UPLOAD_PRESET} from "../utils/config.js";
import axios from "axios";

const PhoneMockup = ({ imageUrl }) => {
    return (
        <div className="flex justify-center items-start bg-transparent">
            <div className="relative w-[250px] h-[180px] overflow-hidden rounded-t-[40px] shadow-2xl border-[6px] border-gray-700 bg-gray-200">
                <div className="w-full bg-white text-black flex flex-col items-center rounded-b-3xl z-5">
                    <h2 className="text-sm font-semibold mt-2 p-1">Welcome to</h2>
                    <div className="bg-yellow-400 px-4 w-full flex items-center justify-center rounded-b-3xl">
                        <img src={imageUrl} alt="logo" className="h-25 max-w-screen overflow-hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SetupRestaurant = ({ restaurant, setRestaurant, setToast }) => {
    const token = localStorage.getItem("token");
    const [editingSlug, setEditingSlug] = useState(false);
    const [isSlugTaken, setIsSlugTaken] = useState(false);
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
        const delayDebounce = setTimeout(() => {
            const checkSlug = async () => {
                try {
                    const res = await axios.get(CHECK_PAGE_NAME, {
                        headers: {Authorization: `Bearer ${token}`},
                        params: { pageName: restaurant.pageName }
                    });
                    setIsSlugTaken(res.data);
                } catch (error) {
                    console.error("Error checking slug:", error);
                }
            };

            if (restaurant.pageName?.length > 2) {
                checkSlug().then(r => r);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [restaurant.pageName, token]);

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
            const { data } = await axios.create().post(CLOUDINARY_URL, formData);
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
                            <label className="block text-sm font-medium text-gray-700">Restaurant Name <span className="text-red-600">*</span></label>
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
                            <label className="block text-sm font-medium text-gray-700">Contact Number <span className="text-red-600">*</span></label>
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
                    <div className="flex items-center mt-1 border-b-2 pb-2 mr-4">
                        <span className="hidden md:inline">{FRONTEND_URL}/restaurants/</span>
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
                            <span className="font-semibold w-full" onClick={() => setEditingSlug(true)}>
                                {restaurant.pageName}
                            </span>
                        )}
                        <div className="flex justify-end">
                            {isSlugTaken ? (
                                <IoIosCloseCircle className="text-red-500 text-2xl"/>
                            ) : (
                                <FaCheckCircle className="text-green-500 text-2xl" />
                            )}
                        </div>
                    </div>

                </div>

                {/* Logo Upload */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 md:mb-15">Restaurant Logo <span className="text-red-600">*</span></label>
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
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "logo")} />
                        </label>
                    </div>

                    {/* Example Logo */}
                    <div>
                        <label className="md:pl-8 block text-sm font-medium text-gray-700">{restaurant.logo ?"Your logo" : "Example Logo"}</label>
                        <div className="p-4 rounded-lg flex items-center">
                            {restaurant.logo ?
                                <PhoneMockup imageUrl={restaurant.logo} />
                                :
                            // <img src={`${example}`} alt="Example Logo" className="h-40 w-auto" />
                            <PhoneMockup imageUrl={example} />}
                        </div>
                    </div>
                </div>

                {/* Welcome Screen Upload */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Welcome Screen Image <span className="text-red-600">*</span></h3>
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
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "welcomeScreen")} />
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
