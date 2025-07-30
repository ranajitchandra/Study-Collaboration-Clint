import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa';

// Improved parseDate to handle 'YYYY-MM-DD' strings reliably
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) {
        const date = new Date(dateStr);
        return isNaN(date) ? null : date;
    }
    // Replace dashes with slashes for consistent parsing in all browsers
    const fixed = dateStr.replace(/-/g, '/');
    const date = new Date(fixed);
    return isNaN(date) ? null : date;
};

// Helper to format date as 'MMM dd, yyyy'
const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    if (!date) return '-';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Helper to check if registration is ongoing
const isOngoing = (start, end) => {
    const now = Date.now();
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    if (!startDate || !endDate) return false;
    return startDate.getTime() <= now && now <= endDate.getTime();
};

// Fetch function for React Query
const fetchSessions = async () => {
    const res = await axios.get('https://student-colabroration-server.vercel.app/public-study-sessions');
    return res.data
        .filter((session) => session.status === 'approved')
        .slice(0, 6);
};

export default function AvailableStudySessions() {
    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['publicStudySessions'],
        queryFn: fetchSessions,
    });

    // Debug logs to check date parsing
    console.log('Sessions:', sessions);
    sessions.forEach((s) => {
        console.log(
            'Start:',
            s.registrationStart,
            'Parsed:',
            parseDate(s.registrationStart)
        );
        console.log('End:', s.registrationEnd, 'Parsed:', parseDate(s.registrationEnd));
    });

    if (isLoading) {
        return (
            <section className="my-10 px-4 md:px-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Available Study Sessions</h2>
                <p>Loading sessions...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="my-10 px-4 md:px-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Available Study Sessions</h2>
                <p>Error loading sessions: {error.message}</p>
            </section>
        );
    }

    console.log(sessions);


    return (
        <section className="my-20 px-4 md:px-8">
            <h2 className="text-3xl text-black font-bold mb-20 text-center">Available Study Sessions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, index) => (
                    <motion.div
                        key={session._id}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="rounded-2xl shadow-md hover:shadow-lg p-5 bg-white space-y-4"
                    >
                        {/* Session Title */}
                        <div className="flex items-center gap-2 text-xl font-semibold text-accent-content">
                            <FaBookOpen /> <span>{session.title}</span>
                        </div>

                        {/* Description Preview */}
                        <p className="text-gray-700">{session.description?.slice(0, 100)}...</p>

                        {/* Registration Dates */}
                        <p>
                            <strong>Registration Start:</strong> {formatDate(session.registrationStart)}
                        </p>
                        <p>
                            <strong>Registration End:</strong> {formatDate(session.registrationEnd)}
                        </p>

                        {/* Status + Read More */}
                        <div className="flex items-center justify-between">
                            <span
                                className={`badge px-3 py-1 rounded-full text-white ${isOngoing(session.registrationStart, session.registrationEnd)
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                    }`}
                            >
                                {isOngoing(session.registrationStart, session.registrationEnd)
                                    ? 'Ongoing'
                                    : 'Closed'}
                            </span>

                            <Link
                                to={`/sessions-details/${session._id}`}
                                className="text-sm font-medium text-indigo-600 hover:underline"
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
