import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useAxiosSecureApi from "../../hooks/useAxiosSecureApi";

export default function AvailableStudySessions() {
    const axiosSecure = useAxiosSecureApi();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axiosSecure.get("/study-sessions");
                const approved = res.data?.filter((s) => s.status === "approved");
                setSessions(approved || []);
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [axiosSecure]);

    const getSessionStatus = (registrationEndDate) => {
        const now = new Date();
        const end = new Date(registrationEndDate);
        return now > end ? "Closed" : "Ongoing";
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Available Study Sessions</h2>

            {loading ? (
                <p className="text-center text-gray-500 text-lg">Loading sessions...</p>
            ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No study sessions available.</p>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {sessions.map((session) => (
                        <motion.div
                            key={session._id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-primary">{session.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {session.description}
                                </p>

                                <p className="mt-2">
                                    <span className="font-medium">Status:</span>{" "}
                                    <span
                                        className={`badge ${getSessionStatus(session.registrationEnd) === "Ongoing"
                                            ? "badge-success"
                                            : "badge-error"
                                            }`}
                                    >
                                        {getSessionStatus(session.registrationEnd)}
                                    </span>
                                </p>
                            </div>

                            <Link
                                to={`/sessions-details/${session._id}`}
                                className="btn btn-primary btn-sm mt-4 w-fit self-start"
                            >
                                Read More
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
