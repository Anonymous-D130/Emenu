import {AssignmentTurnedIn, CleaningServices, LocationOn, Schedule} from "@mui/icons-material";
import React from "react";

export const features = [
    { title: "Multiple Services", desc: "Choose from Wash & Fold, Dry Cleaning, and Ironing services.", icon: <CleaningServices fontSize="large" className="text-purple-500" /> },
    { title: "Customized Instructions", desc: "Add special care instructions for each garment type.", icon: <AssignmentTurnedIn fontSize="large" className="text-green-500" /> },
    { title: "Flexible Scheduling", desc: "Choose your preferred pickup and delivery times.", icon: <Schedule fontSize="large" className="text-blue-500" /> },
    { title: "Real-time Tracking", desc: "Track your order status from pickup to delivery.", icon: <LocationOn fontSize="large" className="text-red-500" /> }
];