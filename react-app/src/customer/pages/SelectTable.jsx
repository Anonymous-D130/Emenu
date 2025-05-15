import React, {useCallback, useEffect, useState} from "react";
import {Check} from "lucide-react";
import { IoChevronBackOutline } from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GET_RESTAURANT_TABLES, UPDATE_TABLE} from "../../utils/config.js";

const SelectTable = ({ tableNumber, setTableNumber, setToast, setLoading, setHasError, pageName }) => {
    const [totalTables, setTotalTables] = useState(0);
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("customer")));
    const fetchTables = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(GET_RESTAURANT_TABLES(pageName));
            setTotalTables(response.data);
        } catch (error) {
            console.error("Error fetching tables: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, [pageName, setHasError, setLoading, setToast]);

    useEffect(() => {
        fetchTables().then(f => f);
    }, [fetchTables])

    useEffect(() => {setTableNumber(tableNumber);
    }, [setTableNumber, tableNumber]);

    const handleTableSelect = (tableNum) => {
        setTableNumber(tableNum);
        setTimeout(() => navigate(`/${pageName}/foods`), 200);
    };

    const updateTable = useCallback(async () => {
        try {
            const response = await axios.put(UPDATE_TABLE(tableNumber, customer?.id));
            setCustomer(response.data);
            localStorage.setItem("customer", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching customer details : ", error);
            setToast({message: error.response.data ? error.response?.data?.message : error.message, type: "error"});
            setHasError(true);
        }
    }, [customer?.id, setHasError, setToast, tableNumber]);

    useEffect(() => {
        if(customer?.tableNumber !== tableNumber){
            updateTable().then(r => r);
        }
    }, [customer?.tableNumber, tableNumber, updateTable]);

    return (
        <div className="min-h-screen bg-white p-4 w-full">
            {/* Header */}
            <div className="flex items-center gap-2 bg-[#F5F5F5] p-2 mb-10 rounded-lg">
                <button
                    onClick={() => navigate(`/${pageName}`)}
                    className="text-xl font-bold border border-white bg-white p-2 rounded-full cursor-pointer"
                >
                    <IoChevronBackOutline className="text-2xl"/>
                </button>
                <h2 className="text-xl font-bold">Select Table</h2>
            </div>

            {/* Grid of Tables */}
            <div className="flex justify-around items-center gap-4 flex-wrap">
                {Array.from({ length: totalTables }, (_, i) => (i + 1).toString()).map((tableNum) => {
                    const isSelected = tableNumber === tableNum;
                    return (
                        <button
                            key={`${tableNum}`}
                            onClick={() => handleTableSelect(tableNum)}
                            className={`relative cursor-pointer flex items-center justify-center h-24 rounded-xl transition-all w-35
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
                                <div className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
                                <div className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-600 rounded-sm"></div>
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
