import {Routes, Route, useNavigate} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Menu from "../pages/Menu";
import QRCode from "../pages/QRCode";
import Settings from "../pages/Settings";
import HelpCentre from "../pages/HelpCentre";
import NotFound from "../pages/NotFound.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import CreateRestaurant from "../pages/CreateRestaurant.jsx";
import Subscription from "./Subscription.jsx";
import {useEffect} from "react";
import axios from "axios";
import {IS_SUBSCRIPTION_ACTIVE} from "../utils/config.js";
import OfferZone from "../pages/OfferZone.jsx";
import ExpiredSubscription from "./ExpiredSubscription.jsx";

const RestaurantRoutes = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await axios.get(IS_SUBSCRIPTION_ACTIVE, {headers: {Authorization: `Bearer ${token}`}});
                if (!response.data) navigate("/restaurant/expired");
            } catch (error) {
                console.error("Error while fetching: ", error);
            }
        };
        fetchSubscription().then(r => r);
    }, [token, navigate]);

    return (
        <div className="flex min-h-screen bg-gray-100 justify-between">
            <Sidebar />
            <Header />
            <Routes>
                <Route path="/" element={<CreateRestaurant/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/offers" element={<OfferZone />} />
                <Route path="/qr-code" element={<QRCode />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpCentre />} />
                <Route path="/expired" element={<ExpiredSubscription />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default RestaurantRoutes;