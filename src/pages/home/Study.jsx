import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function AvailableStudySessions() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/public-study-sessions")
            .then((res) => {
                // Only show approved sessions
                const approvedSessions = res.data.filter(
                    (session) => session.status === "approved"
                );

                // Show only first 6
                const sliced = approvedSessions.slice(0, 6);
                setSessions(sliced);
            })
            .catch((err) => console.error("Failed to fetch sessions", err));
    }, []);

    const getStatus = (session) => {
        const now = new Date();
        const regStart = new Date(session.registrationStart);
        const regEnd = new Date(session.registrationEnd);

        if (regStart <= now && now <= regEnd) {
            return "ongoing";
        } else {
            return "closed";
        }
    };

    return (
        <section className="my-10 px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Available Study Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => {
                    const status = getStatus(session);

                    return (
                        <motion.div
                            key={session._id}
                            whileHover={{ scale: 1.03 }}
                            className="rounded-2xl shadow-lg border p-5 bg-white space-y-4"
                        >
                            <div className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
                                <FaBookOpen /> <span>{session.title}</span>
                            </div>
                            <p className="text-gray-700">{session.description.slice(0, 100)}...</p>
                            <div className="flex items-center justify-between">
                                <span className={`badge px-3 py-1 rounded-full ${status === "ongoing" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                    {status}
                                </span>
                                <Link
                                    to={`/session-details/${session._id}`}
                                    className="text-sm font-medium text-indigo-600 hover:underline"
                                >
                                    Read More
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
