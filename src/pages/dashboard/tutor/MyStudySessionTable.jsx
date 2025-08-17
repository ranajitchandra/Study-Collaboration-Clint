import React, { useState } from "react";
import { FaEye, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import { toast } from "react-toastify";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function MyStudySessionsTable({ sessions: initialSessions }) {
    const axiosSecure = useAxiosSecureApi();
    const [sessions, setSessions] = useState(initialSessions || []);
    const [filterStatus, setFilterStatus] = useState("all");

    const handleResendRequest = async (id) => {
        try {
            const res = await axiosSecure.patch(`/study-sessions/request-again/${id}`);
            if (res.data?.success) {
                toast.success("Request sent to admin again.");
                setSessions(
                    sessions.map((session) =>
                        session._id === id ? { ...session, status: "pending" } : session
                    )
                );
            } else {
                toast.error("Failed to resend request.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    const filteredSessions =
        filterStatus === "all"
            ? sessions
            : sessions.filter((session) => session.status === filterStatus);

    return (
        <div className="p-4 space-y-6">
            {/* Filter */}
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-base-content">Filter by Status:</label>
                <select
                    className="select select-bordered w-fit"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div
                            key={session._id}
                            className="bg-base-100 border border-base-200 shadow-sm rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow duration-200"
                        >
                            <h3 className="text-xl font-semibold text-primary">{session.title}</h3>

                            <div className="text-sm text-base-content space-y-1">
                                <p><strong>Reg Start:</strong> {formatDate(session.registrationStart)}</p>
                                <p><strong>Reg End:</strong> {formatDate(session.registrationEnd)}</p>
                                <p><strong>Class Start:</strong> {formatDate(session.classStart)}</p>
                                <p><strong>Class End:</strong> {formatDate(session.classEnd)}</p>
                                <p><strong>Duration:</strong> {session.duration}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`badge ${session.status === "pending"
                                            ? "badge-warning"
                                            : session.status === "approved"
                                                ? "badge-success"
                                                : session.status === "rejected"
                                                    ? "badge-error"
                                                    : "badge-info"
                                            }`}
                                    >
                                        {session.status}
                                    </span>
                                </p>
                                {session.status === "rejected" && (
                                    <p className="text-sm text-error">
                                        <strong>Reject reason:</strong> {session.rejectionReason || "No reason provided."}
                                    </p>
                                )}
                                <p><strong>Reg Fee:</strong> {session.registrationFee}</p>
                                <p><strong>Created:</strong> {formatDate(session.createdAt)}</p>
                            </div>

                            {session.status === "approved" && (
                                <div className="flex items-center gap-4 mt-4">
                                    <Link
                                        to={`/dashboard/upload-materials/${session._id}`}
                                        className="flex items-center gap-1 text-accent hover:text-accent-content font-medium"
                                        title="Upload Materials"
                                    >
                                        <FaPlusCircle size={18} />
                                        <span className="hidden sm:inline">Add</span>
                                    </Link>
                                    <Link
                                        to={`/dashboard/view-materials-by-session/${session._id}`}
                                        className="flex items-center gap-1 text-primary hover:text-primary-content font-medium"
                                        title="View Materials"
                                    >
                                        <FaEye size={18} />
                                        <span className="hidden sm:inline">View</span>
                                    </Link>
                                </div>
                            )}

                            {session.status === "rejected" && (
                                <button
                                    onClick={() => handleResendRequest(session._id)}
                                    className="btn btn-outline btn-warning mt-4 w-full"
                                >
                                    Request Again
                                </button>
                            )}

                            {session.status === "pending" && (
                                <p className="italic text-gray-500 mt-4">Pending Approval</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No study sessions found.</p>
                )}
            </div>
        </div>
    );
}
