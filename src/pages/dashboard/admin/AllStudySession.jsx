import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import Swal from "sweetalert2";
import { useState } from "react";
import { Link } from "react-router";

export default function AdminAllStudySessions() {
    const axiosSecure = useAxiosSecureApi();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ["admin-study-sessions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/study-sessions");
            return res.data;
        },
    });

    const updateSessionInCache = (sessionId, updatedFields) => {
        queryClient.setQueryData(["admin-study-sessions"], (oldData) =>
            oldData.map((item) =>
                item._id === sessionId ? { ...item, ...updatedFields } : item
            )
        );
    };

    const removeSessionFromCache = (sessionId) => {
        queryClient.setQueryData(["admin-study-sessions"], (oldData) =>
            oldData.filter((item) => item._id !== sessionId)
        );
    };

    const handleSessionAction = async (sessionId, actionType) => {
        if (actionType === "approve") {
            const { value: formValues } = await Swal.fire({
                title: "Set Registration Fee",
                html: `
                    <label class="block text-left">Is the session free or paid?</label>
                    <select id="status" class="swal2-input">
                        <option value="0">Free</option>
                        <option value="1">Paid</option>
                    </select>
                    <input id="fee" class="swal2-input" type="number" placeholder="Enter amount (if paid)">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    const isPaid = document.getElementById("status").value;
                    const amount = document.getElementById("fee").value || 0;
                    return {
                        action: "approve",
                        registrationFee: isPaid === "1" ? parseFloat(amount) : 0,
                    };
                },
            });

            if (!formValues) return;

            try {
                await axiosSecure.patch(`/study-sessions/${sessionId}`, formValues);
                updateSessionInCache(sessionId, {
                    status: "approved",
                    registrationFee: formValues.registrationFee,
                });
                Swal.fire("Approved!", "Session approved successfully", "success");
            } catch {
                Swal.fire("Error", "Approval failed", "error");
            }
        }

        if (actionType === "reject") {
            const { value: reason } = await Swal.fire({
                title: "Rejection Reason",
                input: "textarea",
                inputPlaceholder: "Enter reason...",
                showCancelButton: true,
            });

            if (!reason) return;

            try {
                await axiosSecure.patch(`/study-sessions/${sessionId}`, {
                    action: "reject",
                    rejectionReason: reason,
                });

                updateSessionInCache(sessionId, {
                    status: "rejected",
                    rejectionReason: reason,
                });

                Swal.fire("Rejected", "Session rejected", "success");
            } catch {
                Swal.fire("Error", "Rejection failed", "error");
            }
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/study-sessions/${id}`);
                removeSessionFromCache(id);
                Swal.fire("Deleted!", "Session has been deleted.", "success");
            } catch {
                Swal.fire("Error", "Failed to delete", "error");
            }
        }
    };

    // Filter sessions by selected status
    const filteredSessions =
        statusFilter === "all"
            ? sessions
            : sessions.filter((s) => s.status === statusFilter);

    if (isLoading) return <p className="text-center">Loading sessions...</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">All Study Sessions</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered select-sm"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {filteredSessions.length === 0 ? (
                <p className="text-gray-500">No sessions to display.</p>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded shadow">
                    <table className="table table-zebra table-lg">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Tutor</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSessions.map((session, index) => (
                                <tr key={session._id}>
                                    <td>{index + 1}</td>
                                    <td>{session.title}</td>
                                    <td>{session.tutorName}</td>
                                    <td>{session.registrationFee === 0 ? "Free" : `${session.registrationFee}৳`}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                session.status === "pending"
                                                    ? "badge-warning"
                                                    : session.status === "approved"
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {session.status === "pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleSessionAction(session._id, "approve")}
                                                    className="btn btn-xs btn-success"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleSessionAction(session._id, "reject")}
                                                    className="btn btn-xs btn-error"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to={`/dashboard/update-session/${session._id}`} className="btn btn-xs btn-info">Update</Link>
                                                <button
                                                    onClick={() => handleDelete(session._id)}
                                                    className="btn btn-xs btn-outline btn-error"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
