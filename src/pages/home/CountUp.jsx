import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { FaUsers, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
};

export default function UserStatsSection() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios
            .get("https://student-colabroration-server.vercel.app/user-stats") // Replace with your API URL
            .then((res) => setStats(res.data))
            .catch((err) => console.error("Error fetching stats:", err));
    }, []);

    // Keep track of which cards are in viewport to reset count
    const [visibleCards, setVisibleCards] = useState({});

    const statItems = stats
        ? [
            {
                label: "Total Users",
                value: stats.totalUsers,
                color: "text-blue-600",
                icon: <FaUsers size={40} className="mx-auto mb-2" />,
            },
            {
                label: "Total Tutors",
                value: stats.totalTutors,
                color: "text-green-600",
                icon: <FaChalkboardTeacher size={40} className="mx-auto mb-2" />,
            },
            {
                label: "Total Students",
                value: stats.totalStudents + 1,
                color: "text-purple-600",
                icon: <FaUserGraduate size={40} className="mx-auto mb-2" />,
            },
        ]
        : [];

    return (
        <section className="my-20 px-4 md:px-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-20">Platform Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        custom={idx}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white shadow-md p-6 rounded-2xl cursor-pointer"
                        onViewportEnter={() =>
                            setVisibleCards((prev) => ({ ...prev, [idx]: Date.now() }))
                        }
                        onViewportLeave={() =>
                            setVisibleCards((prev) => ({ ...prev, [idx]: null }))
                        }
                    >
                        {item.icon}
                        <h3 className={`text-4xl font-bold ${item.color}`}>
                            {/* Use key to force re-mount countUp when entering viewport */}
                            <CountUp
                                key={visibleCards[idx] || "hidden"}
                                end={item.value}
                                duration={2}
                                separator=","
                            />
                        </h3>
                        <p className="text-gray-600 mt-2">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
