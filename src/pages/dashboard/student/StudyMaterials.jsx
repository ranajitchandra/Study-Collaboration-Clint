import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";

export default function StudyMaterials() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();
    const [bookedSessions, setBookedSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/booked-sessions?email=${user.email}`).then(res => {
                setBookedSessions(res.data);
            });
        }
    }, [user, axiosSecure]);

    const fetchMaterials = (sessionId) => {
        axiosSecure.get(`/materials/${sessionId}`).then(res => {
            setMaterials(res.data);
            setSelectedSession(sessionId);
        });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-base-content mb-6 text-center">
                🎓 Your Booked Sessions
            </h2>

            {/* Sessions List */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {bookedSessions.map((session) => (
                    <div
                        key={session._id}
                        className={`cursor-pointer border border-base-200 rounded-xl p-4 shadow-sm transition-all duration-200
                            ${selectedSession === session.sessionId ? "bg-primary/10 border-primary" : "hover:bg-base-200"}`}
                        onClick={() => fetchMaterials(session.sessionId)}
                    >
                        <h3 className="font-semibold text-base-content">{session.sessionTitle || "Untitled Session"}</h3>
                        <p className="text-sm text-base-content/70 mt-1">Tutor: {session.tutorEmail}</p>
                    </div>
                ))}
            </div>

            {/* Materials */}
            {selectedSession && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-base-content">
                        Materials for Selected Session
                    </h2>
                    {materials.length === 0 ? (
                        <p className="text-base-content/70">No materials found for this session.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {materials.map((material) => (
                                <div
                                    key={material._id}
                                    className="bg-base-100 border border-base-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
                                >
                                    {material.imageUrl && (
                                        <img
                                            src={material.imageUrl}
                                            alt={material.title || "Material"}
                                            className="w-full h-40 object-cover rounded-md mb-3"
                                        />
                                    )}
                                    <h3 className="font-medium text-base-content text-lg mb-2">{material.title}</h3>
                                    <div className="flex gap-3 mt-3">
                                        {material.imageUrl && (
                                            <a
                                                href={material.imageUrl}
                                                download
                                                className="btn btn-sm btn-outline flex-1"
                                            >
                                                Download
                                            </a>
                                        )}
                                        {material.driveLink && (
                                            <a
                                                href={material.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-primary flex-1"
                                            >
                                                Open Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
