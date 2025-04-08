import React, {useCallback, useEffect, useState} from "react";
import {Check} from "lucide-react";
import { IoChevronBackOutline } from "react-icons/io5";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {GET_RESTAURANT_TABLES} from "../../utils/config.js";
import {initialToastState} from "../../utils/Utility.js";
import ErrorPage from "./ErrorPage.jsx";

const SelectTable = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [totalTables, setTotalTables] = useState(0);

    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const tableNumber = searchParams.get('tableNumber');
    const logo = searchParams.get('logo');
    const navigate = useNavigate();
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const fetchTables = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(GET_RESTAURANT_TABLES(restaurantId));
            setTotalTables(response.data);
            setHasError(false);
        } catch (error) {
            console.error("Error fetching tables: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);
    
    useEffect(() => {
        fetchTables().then(f => f);
    }, [fetchTables])

    const showErrorPage = !restaurantId || !tableNumber || hasError || !logo;

    useEffect(() => {
        if(!showErrorPage) setSelectedTable(tableNumber);
    }, [showErrorPage, tableNumber]);

    if (showErrorPage) {
        return (
            <ErrorPage
                loading={loading}
                toast={toast}
                setToast={setToast}
            />
        );
    }

    const handleTableSelect = (tableNum) => {
        setSelectedTable(tableNum);
        setTimeout(() => navigate(`/customer/order/restaurant/food?restaurantId=${restaurantId}&tableNumber=${tableNum}&logo=${logo}`), 200);
    };

    return (
        <div className="min-h-screen bg-white p-4 w-full">
            {/* Header */}
            <div className="flex items-center gap-2 bg-[#F5F5F5] p-2 mb-10 rounded-lg">
                <button
                    onClick={() => navigate(`/customer/order/restaurant?restaurantId=${restaurantId}&tableNumber=${tableNumber}`)}
                    className="text-xl font-bold border border-white bg-white p-2 rounded-full cursor-pointer"
                >
                    <IoChevronBackOutline className="text-2xl"/>
                </button>
                <h2 className="text-xl font-bold">Select Table</h2>
            </div>

            {/* Grid of Tables */}
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: totalTables }, (_, i) => (i + 1).toString()).map((tableNum) => {
                    const isSelected = selectedTable === tableNum;
                    return (
                        <button
                            key={`${tableNum}`}
                            onClick={() => handleTableSelect(tableNum)}
                            className={`relative cursor-pointer flex items-center justify-center h-24 rounded-xl transition-all
                                ${isSelected ? "bg-[#FFC300] border-[3px] border-black" : "bg-[#F5F5F5]"}`}
                        >
                            {/* Table Icon */}
                            <div className="relative w-12 h-12 bg-white rounded-sm border border-gray-600 flex items-center justify-center z-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                ${isSelected ? "bg-yellow-400 text-black" : "bg-[#d9d9d9] text-gray-700"}`}>
                                    <span className="font-bold text-lg">{tableNum}</span>
                                </div>
                            </div>
                            <div className="z-1">
                                {/* Mini seats around (optional, basic shape) */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
                            </div>

                            {/* Checkmark */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-[4px] border-2 border-white">
                                    <Check size={14} color="white" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectTable;
