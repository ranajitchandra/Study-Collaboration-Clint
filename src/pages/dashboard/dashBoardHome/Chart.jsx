import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import Loading from "../../../components/Loading";

const COLORS = ["#FFB703", "#E63825", "#262261", "#FF9B00"];

export default function Chart() {
    const axiosSecure = useAxiosSecureApi();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTutors: 0
    });
    const [sessionsData, setSessionsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get user stats
                const resStats = await axiosSecure.get("/user-stats");
                setStats(resStats.data);

                // 2. Get all study sessions
                const resSessions = await axiosSecure.get("/study-sessions");
                setSessionsData(resSessions.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    if (loading) return <Loading />;

    // Prepare chart data
    const userPieData = [
        { name: "Students", value: stats.totalStudents },
        { name: "Tutors", value: stats.totalTutors },
    ];

    const sessionStatusData = [
        { status: "Approved", count: sessionsData.filter(s => s.status === "approved").length },
        { status: "Pending", count: sessionsData.filter(s => s.status === "pending").length },
        { status: "Rejected", count: sessionsData.filter(s => s.status === "rejected").length },
    ];

    return (
        <div className="p-6 space-y-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary text-center mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div
                    className="bg-base-200 rounded-2xl p-6 shadow hover:shadow-lg transition text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                </motion.div>
                <motion.div
                    className="bg-base-200 rounded-2xl p-6 shadow hover:shadow-lg transition text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalStudents}</p>
                </motion.div>
                <motion.div
                    className="bg-base-200 rounded-2xl p-6 shadow hover:shadow-lg transition text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-gray-500">Total Tutors</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalTutors}</p>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-base-200 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4 text-primary text-center">User Distribution</h2>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={userPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {userPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                <div className="bg-base-200 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4 text-primary text-center">Study Sessions Status</h2>
                    <BarChart
                        width={400}
                        height={300}
                        data={sessionStatusData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#FFB703" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}
