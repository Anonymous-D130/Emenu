import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ADD_PLAN, DELETE_PLAN, FETCH_PLANS } from "./Api.js";
import Toast from "../utils/Toast.jsx";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControlLabel,
    Checkbox, Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const emptyPlan = {
    title: "",
    price: "",
    description: "",
    duration: "",
    menuCount: "",
    qrCount: "",
    ringBellIncluded: false,
    trialDuration: "",
    features: [""],
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [toast, setToast] = useState({ message: "", type: "" });
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState(emptyPlan);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(FETCH_PLANS, {
                headers: { Authorization: token },
            });
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPlans().then(p => p);
    }, [fetchPlans]);

    const handleNewPlanChange = (field, value) => {
        setNewPlan((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...newPlan.features];
        updatedFeatures[index] = value;
        setNewPlan({ ...newPlan, features: updatedFeatures });
    };

    const addFeatureField = () => {
        setNewPlan((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }));
    };

    const removeFeatureField = (index) => {
        const updatedFeatures = [...newPlan.features];
        updatedFeatures.splice(index, 1);
        setNewPlan({ ...newPlan, features: updatedFeatures });
    };

    const addPlan = async () => {
        try {
            setLoad(true);
            const response = await axios.post(ADD_PLAN, newPlan, {
                headers: { Authorization: token },
            });
            setToast({ message: response.data?.message, type: "success" });
            setShowModal(false);
            setNewPlan(emptyPlan);
            await fetchPlans();
        } catch (error) {
            console.error("Error adding plan:", error);
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoad(false);
        }
    };

    const deletePlan = async (planId) => {
        try {
            setLoad(true);
            const response = await axios.delete(DELETE_PLAN(planId), {
                headers: { Authorization: token },
            });
            setToast({ message: response.data?.message, type: "success" });
            await fetchPlans();
        } catch (error) {
            console.error("Error deleting plan:", error);
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoad(false);
        }
    };

    return (
        <main className="flex flex-col p-5 w-full">
            {/* Loading Spinner */}
            {(loading || load) && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg mb-6 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-wide">Admin Dashboard</h1>
                    <p className="text-sm font-light mt-1 opacity-90">
                        Manage subscription plans and monitor system updates.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-100 transition-all"
                    >
                        + Add New Plan
                    </button>
                    <button
                        onClick={() => navigate("/logout")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Toast Notification */}
            {toast.message && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: "", type: "" })}
                />
            )}

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:mx-10">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`p-5 rounded-2xl shadow-md border-2 bg-white flex flex-col justify-between border-gray-200 hover:shadow-lg transition relative ${
                            !plan.available ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                        {/* Deletion badge if not available */}
                        {!plan.available && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                Queued for Deletion
                            </div>
                        )}

                        <ul className="text-sm mt-2 space-y-1">
                            <div className="flex justify-between">
                                <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => deletePlan(plan.id)}
                                    disabled={!plan.available} // optional: disable button for unavailable
                                >
                                    <Delete />
                                </IconButton>
                            </div>
                            <p className="text-lg font-bold text-purple-700">₹{plan.price}</p>
                            <p className="text-md font-semibold text-gray-700">{plan.description}</p>
                            <li>⏳ Duration: {plan.duration} days</li>
                            <li>📋 Menus Allowed: {plan.menuCount ? plan.menuCount : "unlimited"}</li>
                            <li>🔢 QRs Allowed: {plan.qrCount? plan.qrCount : "unlimited"}</li>
                            <li>🆓 Trial Duration: {plan.trialDuration} days</li>
                            <li>🔔 Ring Bell Included: {plan.ringBellIncluded ? "Yes" : "No"}</li>

                            <ul className="mt-4 text-sm space-y-2">
                                <li className="text-lg font-semibold">🌟 Features:</li>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-md text-gray-800">
                                        ✅ {feature}
                                    </li>
                                ))}
                            </ul>
                        </ul>
                    </div>
                ))}
            </div>

            {/* Add Plan Modal */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const hasValidFeatures = newPlan.features.length > 0 && newPlan.features.every(f => f.trim() !== "");
                        if (!hasValidFeatures) {
                            alert("Please add at least one non-empty feature.");
                            return;
                        }
                        addPlan();
                    }}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90vw", sm: 500 },
                        bgcolor: "background.paper",
                        boxShadow: 6,
                        p: 4,
                        borderRadius: 4,
                        maxHeight: "90vh",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography id="modal-title" variant="h5" fontWeight={700} color="primary">
                        Add New Plan
                    </Typography>

                    {/* Basic Info */}
                    <TextField
                        label="Title"
                        value={newPlan.title}
                        onChange={(e) => handleNewPlanChange("title", e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Price"
                        type="number"
                        value={newPlan.price}
                        onChange={(e) => handleNewPlanChange("price", e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Duration (in days)"
                        type="number"
                        value={newPlan.duration}
                        onChange={(e) => handleNewPlanChange("duration", e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Description"
                        value={newPlan.description}
                        onChange={(e) => handleNewPlanChange("description", e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />

                    {/* Menu Count Toggle */}
                    <Divider/>
                    <div>
                        {newPlan.menuCount !== null && (
                            <TextField
                                label="Menu Count"
                                type="number"
                                value={newPlan.menuCount}
                                onChange={(e) => handleNewPlanChange("menuCount", e.target.value)}
                                fullWidth
                            />
                        )}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newPlan.menuCount === null}
                                    onChange={(e) => handleNewPlanChange("menuCount", e.target.checked ? null : 0)}
                                />
                            }
                            label="Set Menu Count to Unlimited"
                        />
                    </div>
                    <Divider/>

                    {/* QR Count Toggle */}
                    <div>
                        {newPlan.qrCount !== null && (
                            <TextField
                                label="QR Count"
                                type="number"
                                value={newPlan.qrCount}
                                onChange={(e) => handleNewPlanChange("qrCount", e.target.value)}
                                fullWidth
                            />
                        )}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newPlan.qrCount === null}
                                    onChange={(e) => handleNewPlanChange("qrCount", e.target.checked ? null : 0)}
                                />
                            }
                            label="Set QR Count to Unlimited"
                        />
                    </div>

                    <Divider/>

                    <TextField
                        label="Trial Duration (in days)"
                        type="number"
                        value={newPlan.trialDuration}
                        onChange={(e) => handleNewPlanChange("trialDuration", e.target.value)}
                        fullWidth
                    />

                    <div className="border-t border-b border-gray-300 py-2">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newPlan.ringBellIncluded}
                                    onChange={(e) => handleNewPlanChange("ringBellIncluded", e.target.checked)}
                                />
                            }
                            label="Ring Bell Included"
                        />
                    </div>

                    {/* Features */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Features
                        </Typography>
                        {newPlan?.features.map((feature, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <TextField
                                    fullWidth
                                    label={`Feature ${index + 1}`}
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    required
                                />
                                <IconButton
                                    color="error"
                                    onClick={() => removeFeatureField(index)}
                                    aria-label="Remove Feature"
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={addFeatureField}
                            startIcon={<span style={{ fontWeight: "bold" }}>+</span>}
                            sx={{ mt: 1 }}
                        >
                            Add Feature
                        </Button>
                    </Box>

                    <Divider />

                    {/* Actions */}
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            onClick={() => setShowModal(false)}
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={load}
                        >
                            {load ? "Adding..." : "Add Plan"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    );
};

export default AdminPanel;
