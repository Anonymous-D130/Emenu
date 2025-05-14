import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {ADD_PLAN, DELETE_PLAN, FETCH_ADMIN_PLANS} from "./config/Api.js";
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
import Swal from "sweetalert2";

const emptyPlan = {
    title: "",
    price: "",
    disPrice: "",
    description: "",
    duration: "",
    menuCount: "",
    qrCount: "",
    ringBellIncluded: false,
    trialDuration: "",
    features: [""],
};

const PlansHandling = () => {
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
            const response = await axios.get(FETCH_ADMIN_PLANS, {
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
        if ((newPlan.menuCount !== null && newPlan.menuCount < 5) ||
            (newPlan.qrCount !== null && newPlan.qrCount < 5)) {
            setToast({ message: "Minimum Menu and QR Count must be 5", type: "error" });
            return;
        }
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
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this plan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;
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
        <main className="flex-1 p-4 md:p-10 lg:p-12 mt-40 md:mt-20">
            {/* Loading Spinner */}
            {(loading || load) && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />}
            <div className="flex items-center justify-between mb-6 p-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">📦 Subscription Plans</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    Add New Plan
                </button>
            </div>


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
                            <div className="flex justify-between border-b-2 border-gray-300">
                                <h3 className="p-2 text-2xl font-bold text-gray-800">{plan.title}</h3>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => deletePlan(plan.id)}
                                    disabled={!plan.available} // optional: disable button for unavailable
                                >
                                    <Delete />
                                </IconButton>
                            </div>
                            <p className="p-2 text-base font-semibold text-gray-700">{plan.description}</p>
                            <div className="px-2 flex justify-between items-center">
                                <div className="flex justify-between w-2/5 items-center">
                                    <p className="text-sm font-bold text-gray-800">Billed Monthly: </p>
                                    <p className="text-lg font-bold text-purple-700">₹{plan.price}</p>
                                </div>
                                <div className="flex justify-between w-2/5 items-center">
                                    <p className="text-sm font-bold text-gray-800">Billed Annually: </p>
                                    <p className="text-lg font-bold text-purple-700">₹{plan.disPrice}</p>
                                </div>
                            </div>
                            <ul className="px-2 space-x-6 text-[0.875rem] font-medium text-gray-800">
                                <li>⏳ <strong>Duration:</strong> {plan.duration} days</li>
                                <li>📋 <strong>Menus Allowed:</strong> {plan.menuCount ?? "Unlimited"}</li>
                                <li>🔢 <strong>QRs Allowed:</strong> {plan.qrCount ?? "Unlimited"}</li>
                                <li>🆓 <strong>Trial Duration:</strong> {plan.trialDuration} days</li>
                                <li>🔔 <strong>Ring Bell Included:</strong> {plan.ringBellIncluded ? "Yes" : "No"}</li>
                            </ul>


                            <ul className="mt-4 text-sm space-y-1 px-2">
                                <li className="text-lg font-semibold">Features:</li>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="px-2 flex items-center text-md font-bold text-gray-800">
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
                        addPlan().then(r => r);
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
                        label="Description"
                        value={newPlan.description}
                        onChange={(e) => handleNewPlanChange("description", e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
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
                        label="Price (Annually Billed)"
                        type="number"
                        value={newPlan.disPrice}
                        onChange={(e) => handleNewPlanChange("disPrice", e.target.value)}
                        fullWidth
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
                                    onChange={(e) => handleNewPlanChange("menuCount", e.target.checked ? null : "")}
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
                                    onChange={(e) => handleNewPlanChange("qrCount", e.target.checked ? null : "")}
                                />
                            }
                            label="Set QR Count to Unlimited"
                        />
                    </div>

                    <Divider/>

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

export default PlansHandling;
