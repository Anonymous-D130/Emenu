import { Modal } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import {SEND_EVENT_DETAILS} from "../../utils/config.js";

const ContactModal = ({ open, onClose, restaurantId, setToast }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        eventDetails: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(SEND_EVENT_DETAILS(restaurantId), formData);
            setToast({message: response?.data?.message, type: "success"});
            setFormData({ name: "", email: "", mobile: "", eventDetails: "" });
            onClose();
        } catch (error) {
            console.log(error);
            setToast({ message: error.response ? error.response.data.message : error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="fixed inset-0 m-2 flex justify-center items-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Book Our Catering Services</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mobile</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Enter your mobile number"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Event Details</label>
                            <textarea
                                name="eventDetails"
                                value={formData.eventDetails}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Tell us about your event..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? "bg-gray-400" : 'bg-black'} text-white py-3 rounded-lg font-semibold`}
                        >
                            {loading ? "Submitting..." :"Submit Inquiry"}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ContactModal;