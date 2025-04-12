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
import "./App.css";
import CustomerRoutes from "./customer/components/CustomerRoutes.jsx";
import NotFound from "./pages/NotFound.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import verifyJWT from "./utils/VerifyJWT.js";

function App() {

    verifyJWT();

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
                <Route path="/restaurants/*" element={<ComingSoon />} />
                <Route path="/logout" element={<Logout/>} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
