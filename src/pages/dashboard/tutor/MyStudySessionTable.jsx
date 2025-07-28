import React from "react";
import { Link } from "react-router";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function MyStudySessionsTable({ sessions }) {
    return (
        <div className="overflow-x-auto p-4 max-w-full">
            <table className="table table-zebra w-full border border-gray-300">
                <thead className="bg-secondary text-primary">
                    <tr>
                        <th>Title</th>
                        <th>Reg Start</th>
                        <th>Reg End</th>
                        <th>Class Start</th>
                        <th>Class End</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Reg Fee</th>
                        <th>Created At</th>
                        <th>Material</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions && sessions.length > 0 ? (
                        sessions.map((session) => (
                            <tr key={session._id}>
                                <td>{session.title}</td>
                                <td>{formatDate(session.registrationStart)}</td>
                                <td>{formatDate(session.registrationEnd)}</td>
                                <td>{formatDate(session.classStart)}</td>
                                <td>{formatDate(session.classEnd)}</td>
                                <td>{session.duration}</td>
                                <td>
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
                                </td>
                                <td>{session.registrationFee}</td>
                                <td>{formatDate(session.createdAt)}</td>
                                <td>
                                    <Link to={`/dashboard/upload-materials/${session._id}`}>Add Material</Link>
                                    <Link to={`/dashboard/view-materials-by-session/${session._id}`}>view Material</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="text-center py-4 text-gray-500">
                                No study sessions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
