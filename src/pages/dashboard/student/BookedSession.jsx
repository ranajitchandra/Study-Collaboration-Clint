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

    if (isLoading) return <Loading />;

    return (
        <AnimatePresence>
            {sessions.length > 0 ? (
                <motion.div
                    className="p-6 bg-base-100 min-h-[70vh]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-6 text-base-content">My Booked Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session, index) => (
                            <motion.div
                                key={session._id}
                                className="card bg-base-100 border border-base-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <div className="card-body">
                                    <h3 className="card-title text-lg font-semibold text-primary">
                                        {session.sessionTitle}
                                    </h3>
                                    <p className="text-sm"><span className="font-medium">Tutor:</span> {session.tutorEmail}</p>
                                    <p className="text-sm"><span className="font-medium">Payment:</span> {session.paymentStatus}</p>
                                    <p className="text-sm"><span className="font-medium">Booked At:</span> {new Date(session.bookedAt).toLocaleString()}</p>

                                    <div className="mt-3">
                                        <Link
                                            to={`/dashboard/booked-session-details/${session.sessionId}`}
                                            className="btn btn-sm btn-primary w-full"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="p-6 text-center bg-base-100 min-h-[60vh] flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold mb-3 text-base-content">No Booked Sessions</h2>
                    <p className="text-base-content/70">You have not booked any sessions yet.</p>
                    <Link to="/study-sessions" className="btn btn-primary mt-5">
                        Browse Available Sessions
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
