import { useState } from "react";
import { Check } from "lucide-react"; // Or any other icon library you prefer

const Dashboard = () => {
    const [selectedTable, setSelectedTable] = useState(4);

    const dummyData = {
        totalOrders: 24,
        completedOrders: 20,
        pendingOrders: 2,
        inProgressOrders: 2,
        totalBillingAmount: 20000,
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tables Section */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Tables</h2>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                            Tables Filled (1)
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
                            Tables Available (11)
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 12 }).map((_, index) => {
                            const tableNumber = index + 1;
                            const isSelected = tableNumber === selectedTable;

                            return (
                                <div
                                    key={tableNumber}
                                    onClick={() => setSelectedTable(tableNumber)}
                                    className={`relative w-full aspect-square flex items-center justify-center rounded-xl border border-gray-300 cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "bg-yellow-400 border-[3px] border-black"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    <span className="text-xl font-semibold">{tableNumber}</span>
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-[2px] border-2 border-white">
                                            <Check size={14} color="white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Orders + Billing Section */}
                <div className="col-span-2 grid grid-cols-3 md:grid-cols-2 gap-6">
                    {/* Orders Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Orders</h2>
                            <div className="text-5xl font-bold mb-2">
                                {dummyData.totalOrders}
                            </div>
                            <div className="text-sm text-gray-500 border-b pb-2 mb-4">
                                Total Orders
                            </div>
                            <div className="flex justify-between text-center text-lg">
                                <div>
                                    <div className="font-bold">
                                        {dummyData.completedOrders}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div>
                                    <div className="font-bold">{dummyData.pendingOrders}</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div>
                                    <div className="font-bold">
                                        {dummyData.inProgressOrders}
                                    </div>
                                    <div className="text-sm text-gray-600">In Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Total Amount</h2>
                            <div className="text-5xl font-bold text-green-600 mb-2">
                                ₹{" "}
                                {dummyData.totalBillingAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Total Billing Amount</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
