import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainFlow = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeTab="Main Flow" />

            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold text-center">Get Started with Your Digital Menu</h1>

                {/* Step Progress Bar */}
                <div className="flex justify-between items-center mt-6">
                    {["Select Subscription", "Setup Restaurant", "Setup Menu", "Generate QR"].map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold
                                bg-purple-600 border-4 border-purple-400 shadow-md">
                                {index + 1}
                            </div>
                            <span className="text-md font-semibold mt-2">{step}</span>
                            {index < 3 && <div className="w-16 h-1 bg-purple-600 mt-2"></div>}
                        </div>
                    ))}
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    <Link to="/" className="p-6 bg-white rounded-lg shadow-md text-center hover:bg-purple-100">
                        <h2 className="text-lg font-semibold">1️⃣ Select Subscription</h2>
                        <p className="text-gray-600 mt-2">Choose the best plan for your business.</p>
                    </Link>

                    <Link to="/setup-restaurant" className="p-6 bg-white rounded-lg shadow-md text-center hover:bg-purple-100">
                        <h2 className="text-lg font-semibold">2️⃣ Setup Restaurant</h2>
                        <p className="text-gray-600 mt-2">Enter your restaurant details.</p>
                    </Link>

                    <Link to="/setup-menu" className="p-6 bg-white rounded-lg shadow-md text-center hover:bg-purple-100">
                        <h2 className="text-lg font-semibold">3️⃣ Setup Menu</h2>
                        <p className="text-gray-600 mt-2">Add food items and categories.</p>
                    </Link>

                    <Link to="/generate-qr" className="p-6 bg-white rounded-lg shadow-md text-center hover:bg-purple-100">
                        <h2 className="text-lg font-semibold">4️⃣ Generate QR Code</h2>
                        <p className="text-gray-600 mt-2">Download your QR code.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default MainFlow;
