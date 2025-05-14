import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const DashboardStats = ({ data }) => {
    const COLORS = ['#4ade80', '#f87171'];

    const ordersData = data.map(d => ({
        name: d.restaurantName,
        orders: d.totalOrders,
    }));

    const planStatusData = [
        {
            name: 'Active',
            value: data.filter(d => d.isActive).length
        },
        {
            name: 'Inactive',
            value: data.filter(d => !d.isActive).length
        }
    ];

    return (
        <div className="p-4 sm:p-6 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Subscription Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Total Orders Chart */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Total Orders by Restaurant</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ordersData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Active vs Inactive Plan Pie */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Plan Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={planStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {planStatusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Restaurant</th>
                                <th className="px-4 py-2 text-left">Plan</th>
                                <th className="px-4 py-2 text-left">Start</th>
                                <th className="px-4 py-2 text-left">End</th>
                                <th className="px-4 py-2 text-left">Remaining Days</th>
                                <th className="px-4 py-2 text-left">Paid</th>
                                <th className="px-4 py-2 text-left">Orders</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.slice(0, 20).map((d, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap">{d.restaurantName}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{d.subscriptionPlan?.title}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{d.startDate}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{d.endDate}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{d.remainingDays}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">₹{d.amountPaid}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{d.totalOrders}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-white text-sm ${d.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {d.planStatus}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
