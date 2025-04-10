import {
    QrCode2,
    DashboardCustomize,
    SupportAgent,
    NotificationsActive,
} from "@mui/icons-material";
import React from "react";

export const features = [
    {
        title: "Contactless Ordering",
        desc: "Offer a safe, modern dining experience where customers scan a QR to order.",
        icon: <QrCode2 fontSize="large" className="text-blue-600" />,
    },
    {
        title: "Instant Order Management",
        desc: "View and manage all incoming orders in real-time from any device.",
        icon: <DashboardCustomize fontSize="large" className="text-green-600" />,
    },
    {
        title: "Reduce Staff Load",
        desc: "Cut down order-taking time so your staff can focus on food and service.",
        icon: <SupportAgent fontSize="large" className="text-yellow-600" />,
    },
    {
        title: "‘Ring the Bell’ Feature",
        desc: "Let customers notify staff digitally — no more waving or shouting.",
        icon: <NotificationsActive fontSize="large" className="text-red-600" />,
    },
];