import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import SelectTable from "../pages/SelectTable.jsx";
import Food from "../pages/Food.jsx";
import NotFound from "../../pages/NotFound.jsx";

const CustomerRoutes = () => {
    return (
        <main className="flex min-h-screen bg-gray-100 justify-center items-center">
            <div className="max-w-md w-full">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tables" element={<SelectTable />} />
                    <Route path="/food" element={<Food />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </div>
        </main>
    );
};

export default CustomerRoutes;
