import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {GET_PARTNERS} from "./config/Api.js";
import SubscriptionTable from "./SubscriptionTable.jsx";
import SubscriptionModal from "./SubscriptionModal.jsx";
import Toast from "../utils/Toast.jsx";

const initialState = {
    plan: {
        startDate: "",
        endDate: "",
        plan: {
            title: "",
            price: null,
        }
    },
    restaurant: {
        name: "",
    },
    user: {
        name: "",
        email: "",
    },
}

const AdminDashboard = () => {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [partners, setPartners] = useState([initialState]);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const fetchPartners = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(GET_PARTNERS, {headers: {'Authorization': token}});
            setPartners(response.data);
        } catch (error) {
            console.error("Error fetching Partners: ", error);
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPartners().then(response => response);
    }, [fetchPartners]);

    const openModal = (partner) => {
        setModalOpen(true);
        setSelected(partner);
    }

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
    }

    return (
        <main className="flex-1 p-4 md:p-10 lg:p-12 mt-40 md:mt-20 overflow-x-auto">
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            {partners.length > 0 ? (<div className="overflow-x-auto p-4">
                    <SubscriptionTable partners={partners} onExtend={openModal}/>
                </div>
                ) : (
                <p className="text-gray-500 text-center text-lg">No data Available</p>
                )}

            <SubscriptionModal
                open={modalOpen}
                handleClose={closeModal}
                subscription={selected}
                setToast={setToast}
                reload={fetchPartners}
            />

        </main>
    );
}

export default AdminDashboard;