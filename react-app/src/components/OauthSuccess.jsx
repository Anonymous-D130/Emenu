import React, {useCallback, useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FETCH_USER_PROFILE } from "../utils/config.js";
import Toast from "../utils/Toast.jsx";

const OauthSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);

    const fetchUserInfo = useCallback(async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(FETCH_USER_PROFILE, {headers: { Authorization: `Bearer ${token}` },});
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/restaurant");
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setToast({message: error.response?.data?.message || "Something went wrong!", type: "error"});
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            fetchUserInfo(token).then(user => user);
        } else {
            console.error("No token found in URL");
            setToast({ message: "Invalid login attempt. Redirecting to login...", type: "error" });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [fetchUserInfo, location, navigate]);

    return (
        <div className="mt-32 text-center">
            {toast.message && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: "", type: "" })}
                />
            )}
            <h2 className="text-xl font-semibold">
                {loading ? "Logging you in..." : toast.message ? "Redirecting to login..." : "Processing..."}
            </h2>
        </div>
    );
};

export default OauthSuccess;