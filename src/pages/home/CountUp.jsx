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
            .get("https://student-colabroration-server.vercel.app/user-stats")
            .then((res) => setStats(res.data))
            .catch((err) => console.error("Error fetching stats:", err));
    }, []);

    const [visibleCards, setVisibleCards] = useState({});

    const statItems = stats
        ? [
            {
                label: "Total Users",
                value: stats.totalUsers,
                icon: <FaUsers size={40} className="mx-auto mb-2 text-primary" />,
            },
            {
                label: "Total Tutors",
                value: stats.totalTutors,
                icon: (
                    <FaChalkboardTeacher size={40} className="mx-auto mb-2 text-primary" />
                ),
            },
            {
                label: "Total Students",
                value: stats.totalStudents + 1,
                icon: <FaUserGraduate size={40} className="mx-auto mb-2 text-primary" />,
            },
        ]
        : [];

    return (
        <section className="my-20 px-4 md:px-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-20">Platform Statistics</h2>

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
                        className="bg-base-100 shadow-md p-6 rounded-2xl cursor-pointer border border-base-300"
                        onViewportEnter={() =>
                            setVisibleCards((prev) => ({ ...prev, [idx]: Date.now() }))
                        }
                        onViewportLeave={() =>
                            setVisibleCards((prev) => ({ ...prev, [idx]: null }))
                        }
                    >
                        {item.icon}
                        <h3 className="text-4xl font-bold text-neutral">
                            <CountUp
                                key={visibleCards[idx] || "hidden"}
                                end={item.value}
                                duration={2}
                                separator=","
                            />
                        </h3>
                        <p className="text-neutral mt-2">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
