import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosApi from "../../hooks/useAxiosApi";

export default function AvailableStudySessions() {
    const axios = useAxiosApi();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get("/study-sessions");
                // Filter only approved ones
                const approved = res.data?.filter((s) => s.status === "approved");
                setSessions(approved || []);
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [axios]);

    const getSessionStatus = (registrationEndDate) => {
        const now = new Date();
        const end = new Date(registrationEndDate);
        return now > end ? "Closed" : "Ongoing";
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Available Study Sessions</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading sessions...</p>
            ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500">No study sessions available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div
                            key={session._id}
                            className="border border-gray-200 shadow-sm rounded-lg p-5 space-y-4 hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-semibold text-primary">{session.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {session.description}
                            </p>

                            <p>
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

                            <Link
                                to={`/sessions/${session._id}`}
                                className="btn btn-sm btn-primary w-fit"
                            >
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
