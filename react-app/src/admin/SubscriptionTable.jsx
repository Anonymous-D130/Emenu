import React, {useState} from 'react';
import {SearchIcon} from "lucide-react";

const SubscriptionTable = ({ partners, onExtend }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPartners = partners.filter(sub =>
        sub.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExtend = (partner) => {
        onExtend(partner);
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight p-4">🤝 Partners</h2>
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search by restaurant or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 ml-1 rounded-md w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left">Restaurant</th>
                        <th className="px-4 py-3 text-left">Owner</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Start Date</th>
                        <th className="px-4 py-3 text-left">End Date</th>
                        <th className="px-4 py-3 text-left">Price (₹)</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPartners.map((sub, index)  => (
                        <tr key={index} className={`border-t border-gray-200  ${!sub.plan?.expired ? "hover:bg-gray-50" : "bg-red-100"}`}>
                            <td className="px-4 py-3">{sub.restaurant.name}</td>
                            <td className="px-4 py-3">{sub.user.name}</td>
                            <td className="px-4 py-3">{sub.user.email}</td>
                            <td className="px-4 py-3">{sub.plan?.plan?.title}</td>
                            <td className="px-4 py-3">
                                {sub.plan?.startDate ? new Date(sub.plan.startDate).toISOString().split('T')[0] : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                                {sub.plan?.endDate ? new Date(sub.plan.endDate).toISOString().split('T')[0] : 'N/A'}
                            </td>
                            <td className="px-4 py-3">₹{sub.plan?.plan?.price}</td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => handleExtend(sub)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SubscriptionTable;