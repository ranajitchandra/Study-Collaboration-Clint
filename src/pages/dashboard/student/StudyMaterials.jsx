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

    console.log(bookedSessions);
    

    const fetchMaterials = (sessionId) => {
        axiosSecure.get(`/materials/${sessionId}`).then(res => {
            setMaterials(res.data);
            setSelectedSession(sessionId);
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Booked Sessions</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {bookedSessions.map(session => (
                    <div
                        key={session._id}
                        className={`border p-4 rounded cursor-pointer ${selectedSession === session.sessionId ? "bg-gray-200" : "hover:bg-gray-100"}`}
                        onClick={() => fetchMaterials(session.sessionId)}
                    >
                        <h3 className="font-semibold">{session.sessionTitle || "Untitled Session"}</h3>
                        <p className="text-sm text-gray-500">Tutor: {session.tutorEmail}</p>
                    </div>
                ))}
            </div>

            {selectedSession && (
                <>
                    <h2 className="text-lg font-semibold mb-3">Materials for Selected Session</h2>
                    {materials.length === 0 ? (
                        <p className="text-gray-600">No materials found for this session.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {materials.map(material => (
                                <div key={material._id} className="p-4 border rounded shadow-sm">
                                    {material.imageUrl && (
                                        <img
                                            src={material.imageUrl}
                                            alt="Material"
                                            className="w-full h-40 object-cover mb-2 rounded"
                                        />
                                    )}
                                    <h3 className="font-medium text-md mb-1">{material.title}</h3>
                                    <div className="flex gap-3 mt-2">
                                        {material.imageUrl && (
                                            <a
                                                href={material.imageUrl}
                                                download
                                                className="btn btn-sm btn-outline"
                                            >
                                                Download
                                            </a>
                                        )}
                                        {material.driveLink && (
                                            <a
                                                href={material.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-primary"
                                            >
                                                Open Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
