import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";
import Orders from "../pages/Orders.jsx";
import Menu from "../pages/Menu.jsx";
import QRCode from "../pages/QRCode.jsx";
import Settings from "../pages/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import CreateRestaurant from "../pages/CreateRestaurant.jsx";
import Subscription from "../pages/Subscription.jsx";
import {useCallback, useEffect} from "react";
import axios from "axios";
import {IS_SUBSCRIPTION_ACTIVE} from "../utils/config.js";
import OfferZone from "../pages/OfferZone.jsx";
import ExpiredSubscription from "../components/ExpiredSubscription.jsx";

const RestaurantRoutes = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();

    const fetchSubscriptionStatus = useCallback(async () => {
        try {
            const response = await axios.get(IS_SUBSCRIPTION_ACTIVE, {headers: {Authorization: `Bearer ${token}`},});
            const status = response.data;
            const currentPath = location.pathname;
            if (status === "NEW" && currentPath !== "/restaurant") {
                navigate("/restaurant", { replace: true });
            } else if (status === "EXPIRED" && currentPath !== "/restaurant/expired") {
                navigate("/restaurant/expired", { replace: true });
            } 
        } catch (error) {
            console.error("Error while fetching subscription status:", error);
        }
    }, [location.pathname, navigate, token]);

    useEffect(() => {
        fetchSubscriptionStatus().then(s => s);
    }, [fetchSubscriptionStatus]);

    return (
        <div className="flex min-h-screen bg-gray-100 justify-center">
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
                <Route path="/expired" element={<ExpiredSubscription />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default RestaurantRoutes;