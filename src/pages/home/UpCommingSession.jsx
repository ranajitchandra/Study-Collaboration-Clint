import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const UpcomingSessions = () => {
    const { data: sessions = [] } = useQuery({
        queryKey: ['upcomingDeadlines'],
        queryFn: async () => {
            const res = await axios.get("https://student-colabroration-server.vercel.app/public-study-sessions");
            return res.data.filter(session => {
                const now = new Date();
                const end = new Date(session.registrationEnd);
                const diffDays = (end - now) / (1000 * 60 * 60 * 24);
                return diffDays > 0 && diffDays <= 7 && session.status === "approved";
            });
        },
    });

    return (
        <section className="my-10 px-4 md:px-8">
            <h2 className="text-2xl font-bold mb-4 text-center">⏳ Upcoming Registration Deadlines</h2>
            {sessions.length === 0 ? (
                <p className="text-center text-gray-500">No upcoming deadlines this week.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map(session => (
                        <div key={session._id} className="border p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-indigo-700">{session.title}</h3>
                            <p className="text-sm text-gray-700">Tutor: {session.tutorName}</p>
                            <p className="text-sm text-red-500">
                                Registration Ends: {new Date(session.registrationEnd).toLocaleDateString()}
                            </p>
                            <Link
                                to={`/sessions-details/${session._id}`}
                                className="inline-block mt-2 text-sm text-indigo-500 underline"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default UpcomingSessions;
