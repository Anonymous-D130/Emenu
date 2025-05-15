import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./auth/LoginPage.jsx";
import RegisterPage from "./auth/RegisterPage.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import RestaurantRoutes from "./routes/RestaurantRoutes.jsx";
import OauthSuccess from "./components/OauthSuccess.jsx";
import Logout from "./auth/Logout.jsx";
import CustomerRoutes from "./customer/components/CustomerRoutes.jsx";
import NotFound from "./pages/NotFound.jsx";
import verifyJWT from "./utils/VerifyJWT.js";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import "./utils/axiosInterceptor.js";
import "./App.css";
import {useScrollFix} from "./utils/useScrollFix.js";

function App() {

    verifyJWT();
    useScrollFix();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/oauth-success" element={<OauthSuccess/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                    path="/restaurant/*"
                    element={
                        <PrivateRoute roles={['OWNER']}>
                            <RestaurantRoutes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/emenu/manager/*"
                    element={
                        <PrivateRoute roles={['ADMIN']}>
                            <AdminRoutes />
                        </PrivateRoute>
                    }
                />
                <Route path="/:pageName/*" element={<CustomerRoutes/>} />
                <Route path="/logout" element={<Logout/>} />
                <Route path="/not-found" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
