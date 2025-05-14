import React, {useCallback, useEffect, useState} from "react";
import Toast from "../utils/Toast.jsx";
import {initialToastState} from "../utils/Utility.js";
import {ADD_SERVICE, FETCH_SERVICES, REMOVE_SERVICE} from "../utils/config.js";
import axios from "axios";
import {TrashIcon} from "lucide-react";

const Services = () => {
    const token = localStorage.getItem("token");
    const [service, setService] = useState("");
    const [services, setServices] = useState({});
    const [toast, setToast] = useState(initialToastState);
    const [loading, setLoading] = useState(false);
    
    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_SERVICES, {headers: {Authorization: `Bearer ${token}`}});
            setServices(response.data);
            console.log(response);
        } catch (error) {
            console.log("Error fetching services: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    useEffect(() => {
        fetchServices().then((response) => response);
    }, [fetchServices]);

    const handleDeleteService = async (id) => {
        try {
            const response = await axios.delete(REMOVE_SERVICE(id), {headers: {Authorization: `Bearer ${token}`}});
            setToast({ message: response.data.message, type: "success" });
            setServices((prevServices) => {
                const updated = { ...prevServices };
                delete updated[id];
                return updated;
            });
        } catch (error) {
            console.error("Error while adding service: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(service);
        try {
            const response = await axios.post(ADD_SERVICE, service, {headers: { 'Content-Type': 'text/plain', Authorization: `Bearer ${token}`}});
            setToast({ message: response.data.message, type: "success" });
            setService("");
            fetchServices().then((response) => response);
        } catch (error) {
            console.error("Error while adding service: ", error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full p-4 md:p-10 lg:p-12 mt-45 md:mt-15">
            {loading && <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>}

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(initialToastState)} />
            )}
            <div className="flex flex-col md:flex-row items-start w-full gap-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
                        Add Service
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Enter a service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="flex-1 p-2 border rounded-lg outline-purple-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                    >
                        Add Service
                    </button>
                </form>
                <div className="w-full bg-white rounded-xl flex flex-col justify-center p-6 shadow-md">
                    <h3 className="text-2xl font-bold mb-4 w-full text-center">Your Services</h3>

                    {loading ? (
                        <div className="flex justify-center items-center w-full h-48">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {Object.entries(services).length === 0 ? (
                                <div className="bg-gray-100 text-gray-500 text-sm flex items-center justify-center h-20 rounded-xl border shadow-inner">
                                    <p>No services offered</p>
                                </div>
                            ) : (
                                <ul className="w-full space-y-2">
                                    {Object.entries(services).map(([id, service]) => (
                                        <li
                                            key={id}
                                            className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <span className="text-base text-gray-800">{service}</span>
                                            <button
                                                onClick={() => handleDeleteService(id)}
                                                className="text-red-500 hover:text-white hover:rounded-full p-2 hover:bg-red-500 font-medium text-xs cursor-pointer"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Services;