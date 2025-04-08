import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import SelectTable from "../pages/SelectTable.jsx";
import Food from "../pages/Food.jsx";
import { useMediaQuery } from "@mui/material";
import {MdPhoneIphone} from "react-icons/md";
import NotFound from "../../pages/NotFound.jsx";

const CustomerRoutes = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!isMobile) {
        return (
            <div className="flex min-h-screen items-center justify-center w-full bg-gray-50">
                <div className="text-center bg-white p-6 rounded-xl shadow-md max-w-sm">
                    <div className="flex justify-center text-blue-600 text-4xl mb-2">
                        <MdPhoneIphone />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Mobile Only Feature
                    </h2>
                    <p className="text-md text-gray-600">
                        This section is available on mobile devices only. Please switch to a phone or tablet to continue.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 w-full">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tables" element={<SelectTable />} />
                <Route path="/food" element={<Food />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default CustomerRoutes;
