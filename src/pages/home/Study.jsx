import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa';

// --- Date Helpers ---
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) {
        const date = new Date(dateStr);
        return isNaN(date) ? null : date;
    }
    const fixed = dateStr.replace(/-/g, '/');
    const date = new Date(fixed);
    return isNaN(date) ? null : date;
};

const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    if (!date) return '-';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const isOngoing = (start, end) => {
    const now = Date.now();
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    if (!startDate || !endDate) return false;
    return startDate.getTime() <= now && now <= endDate.getTime();
};

// --- Fetch Function ---
const fetchSessions = async () => {
    const res = await axios.get(
        'https://student-colabroration-server.vercel.app/public-study-sessions'
    );
    return res.data
        .filter((session) => session.status === 'approved')
        .slice(0, 6);
};

export default function AvailableStudySessions() {
    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['publicStudySessions'],
        queryFn: fetchSessions,
    });

    if (isLoading) {
        return (
            <section className="my-10 px-4 md:px-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Available Study Sessions</h2>
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </section>
        );
    }

    if (error) {
        return (
            <section className="my-10 px-4 md:px-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Available Study Sessions</h2>
                <div className="alert alert-error shadow-md">
                    <span>Error loading sessions: {error.message}</span>
                </div>
            </section>
        );
    }

    return (
        <section className="my-20 px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-primary">
                Available Study Sessions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, index) => (
                    <motion.div
                        key={session._id}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="rounded-2xl shadow-md hover:shadow-lg p-5 bg-base-100 space-y-4"
                    >
                        {/* Session Title */}
                        <div className="flex items-center gap-2 text-lg font-semibold text-accent">
                            <FaBookOpen /> <span>{session.title}</span>
                        </div>

                        {/* Description Preview */}
                        <p className="text-base-content">
                            {session.description?.slice(0, 100)}...
                        </p>

                        {/* Registration Dates */}
                        <div className="text-sm space-y-1">
                            <p>
                                <span className="font-medium">Start:</span>{' '}
                                {formatDate(session.registrationStart)}
                            </p>
                            <p>
                                <span className="font-medium">End:</span>{' '}
                                {formatDate(session.registrationEnd)}
                            </p>
                        </div>

                        {/* Status + Read More */}
                        <div className="flex items-center justify-between">
                            <span
                                className={`badge px-3 py-2 text-sm ${isOngoing(session.registrationStart, session.registrationEnd)
                                        ? 'badge-success'
                                        : 'badge-error'
                                    }`}
                            >
                                {isOngoing(session.registrationStart, session.registrationEnd)
                                    ? 'Ongoing'
                                    : 'Closed'}
                            </span>

                            <Link
                                to={`/sessions-details/${session._id}`}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Read More
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
