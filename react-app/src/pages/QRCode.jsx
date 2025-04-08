import React, {useCallback, useEffect, useState} from "react";
import GenerateQR from "../components/GenerateQR.jsx";
import {initialToastState} from "../utils/Utility.js";
import axios from "axios";
import {FETCH_RESTAURANT} from "../utils/config.js";
import Toast from "../utils/Toast.jsx";

const QRCode = () => {
    const token = localStorage.getItem("token");
    const [logo, setLogo] = useState(null);
    const [name, setName] = useState("");
    const [toast, setToast] = useState(initialToastState);

    const fetchRestaurant = useCallback(async () => {
        try {
            const response = await axios.get(FETCH_RESTAURANT, {headers: {Authorization: `Bearer ${token}`}});
            setLogo(response.data?.logo);
            setName(response.data?.name);
        } catch (error) {
            console.error("Error while fetching: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        }
    }, [token]);

    useEffect(() => {
        fetchRestaurant().then(r => r);
    }, [fetchRestaurant]);

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <GenerateQR setToast={setToast} logo={logo} name={name}/>
        </main>
    );
};

export default QRCode;
