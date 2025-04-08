import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RestaurantRoutes from "./components/RestaurantRoutes.jsx";
import OauthSuccess from "./components/OauthSuccess.jsx";
import Logout from "./pages/Logout.jsx";
import "./App.css";
import CustomerRoutes from "./customer/components/CustomerRoutes.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
    return (
        <Router>
            {/*<Navbar/>*/}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customer/order/restaurant/*" element={<CustomerRoutes/>} />
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
                <Route path="/logout" element={<Logout/>} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
