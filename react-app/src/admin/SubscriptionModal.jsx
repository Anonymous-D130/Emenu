import React, {useCallback, useEffect, useState} from 'react';
import {
    Modal,
    Button,
    TextField,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import axios from "axios";
import {FETCH_ALL_PLANS, UPDATE_PLAN} from "./config/Api.js";

const SubscriptionModal = ({ open, handleClose, subscription, setToast, reload }) => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [availablePlans, setAvailablePlans] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchAvailablePlans = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_ALL_PLANS, {headers: {'Authorization': `Bearer ${token}`}});
            setAvailablePlans(response.data);
        } catch (error) {
            console.error("Unable to fetch plans: ", error);
            setToast({
                message: error.response?.data?.message || error.message,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [setToast, token]);

    useEffect(() => {
        fetchAvailablePlans().then(r => r);
    }, [fetchAvailablePlans]);

    if (!subscription) return null;
    const { user, restaurant, plan } = subscription;

    const handleExtend = async () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(true);
        try {
            const response = await axios.post(UPDATE_PLAN(user.id, plan.plan?.id), endDate, {headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}});
            setToast({ message: response?.data.message, type: 'success' });
            handleClose();
            setSelectedPlan('');
            setEndDate('');
            reload();
        } catch (error) {
            console.error("Unable to update plan: ", error);
            setToast({message: error.response?.data?.message || error.message, type: 'error', });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="absolute top-1/2 left-1/2 w-[90%] max-w-xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-2">Subscription Details</h2>
                {/* Restaurant Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-blue-900">Restaurant</h2>
                    <div className="flex items-center gap-4 pl-2">
                        <Avatar src={restaurant.logo} alt="logo" sx={{ width: 60, height: 60 }} />
                        <p className="font-semibold text-lg">{restaurant.name}</p>
                    </div>
                </div>

                <hr className="mb-6" />

                {/* Owner Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-blue-900">Owner</h2>
                    <div className="pl-2">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>

                <hr className="mb-6" />

                {/* Plan Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-blue-900">Current Plan</h2>
                    <div className="pl-2">
                        <p><strong>Title:</strong> {plan?.plan?.title}</p>
                        <p><strong>Price:</strong> ₹{plan?.plan?.price}</p>
                        <p><strong>Start Date:</strong> {new Date(plan.startDate).toISOString().split('T')[0]}</p>
                        <p><strong>End Date:</strong> {new Date(plan.endDate).toISOString().split('T')[0]}</p>

                    </div>
                </div>

                <hr className="mb-6" />

                {/* Extend Field */}
                <div className="mb-6">
                    <FormControl fullWidth>
                        <InputLabel id="plan-select-label">Available Plan</InputLabel>
                        <Select
                            labelId="plan-select-label"
                            value={selectedPlan || plan?.plan?.id }
                            label="Available Plan"
                            onChange={(e) => setSelectedPlan(e.target.value)}
                        >
                            {availablePlans?.map((plan) => (
                                <MenuItem key={plan.id} value={plan.id} disabled={!plan?.available}>
                                    {plan.title} | ₹{plan.price} | ₹{plan.disPrice}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="mb-6">
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        value={endDate || new Date(plan.endDate).toISOString().split('T')[0]}
                        slotProps={{inputLabel: {shrink: true}}}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {/* Action Button */}
                <div className="flex justify-between px-4">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleClose();
                            setSelectedPlan('');
                            setEndDate('');
                        }}
                        sx={{ px: 4, py: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExtend}
                        disabled={!endDate || loading}
                        sx={{ px: 4, py: 1 }}
                    >
                        {loading ? <CircularProgress size={24} /> :"Update"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SubscriptionModal;
