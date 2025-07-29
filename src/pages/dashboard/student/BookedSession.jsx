import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContextProvider';
import useAxiosSecureApi from '../../../hooks/useAxiosSecureApi';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../../components/Loading';

export default function MyBookedSessions() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['myBookedSessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/booked-sessions?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) return <Loading></Loading>;

    return (
        <AnimatePresence>
            {sessions.length > 0 ? (
                <motion.div
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">My Booked Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sessions.map((session, index) => (
                            <motion.div
                                key={session._id}
                                className="border p-4 rounded-lg shadow-md"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <h3 className="text-xl font-medium">{session.sessionTitle}</h3>
                                <p><strong>Tutor:</strong> {session.tutorEmail}</p>
                                <p><strong>Payment:</strong> {session.paymentStatus}</p>
                                <p><strong>Booked At:</strong> {new Date(session.bookedAt).toLocaleString()}</p>
                                <Link
                                    to={`/dashboard/booked-session-details/${session.sessionId}`}
                                    className="btn btn-sm btn-primary mt-3"
                                >
                                    View Details
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">No Booked Sessions</h2>
                    <p>You have not booked any sessions yet.</p>
                    <Link to="/study-sessions" className="btn btn-primary mt-4">
                        Browse Available Sessions
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
