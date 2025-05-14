import React from "react";
import {useLocation, useNavigate} from "react-router-dom";

export const AdminHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const NavButton = ({ label, path }) => (
        <button
            onClick={() => navigate(path)}
            className={`px-4 py-2 rounded-lg shadow-md font-semibold transition-all ${
                isActive(path)
                    ? "bg-indigo-800 text-white"
                    : "bg-white text-indigo-700 hover:bg-indigo-100"
            }`}
            aria-current={isActive(path) ? "page" : undefined}
        >
            {label}
        </button>
    );


    return (
        <header className="fixed top-0 left-0 right-0 z-45 flex flex-col md:flex-row items-center justify-between w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-10 shadow-lg mb-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-wide">Admin Dashboard</h1>
                <p className="text-sm font-light mt-1 opacity-90">
                    Manage subscription plans and monitor system updates.
                </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center md:space-x-3 gap-1">
                <NavButton label="Dashboard" path="/emenu/manager" />
                <NavButton label="Partners" path="/emenu/manager/partners" />
                <NavButton label="Plans" path="/emenu/manager/plans" />
                <button
                    onClick={() => navigate("/logout")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}