import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
};

const UpcomingSessions = () => {
    const { data: sessions = [] } = useQuery({
        queryKey: ["upcomingDeadlines"],
        queryFn: async () => {
            const res = await axios.get(
                "https://student-colabroration-server.vercel.app/public-study-sessions"
            );
            return res.data.filter((session) => {
                const now = new Date();
                const end = new Date(session.registrationEnd);
                const diffDays = (end - now) / (1000 * 60 * 60 * 24);
                return diffDays > 0 && diffDays <= 7 && session.status === "approved";
            });
        },
    });

    return (
        <section className="my-16 px-4 md:px-8">
            <h2 className="text-3xl font-extrabold mb-12 text-center text-[color:var(--color-primary)]">
                Upcoming Sessions
            </h2>

            {sessions.length === 0 ? (
                <p className="text-center text-[color:var(--color-neutral-content)] text-lg">
                    No upcoming Sessions.
                </p>
            ) : (
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session, index) => (
                        <motion.div
                            key={session._id}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="bg-[color:var(--color-base-100)] border border-[color:var(--color-base-300)] p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <h3 className="font-bold text-[color:var(--color-accent)] text-2xl mb-3">
                                {session.title}
                            </h3>
                            <p className="text-sm text-neutral mb-2">
                                Tutor: <span className="font-medium">{session.tutorName}</span>
                            </p>

                            <p className="text-sm text-[color:var(--color-error)] mb-6 font-medium">
                                Registration Ends:{" "}
                                {new Date(session.registrationEnd).toLocaleDateString()}
                            </p>
                            <Link
                                to={`/sessions-details/${session._id}`}
                                className="inline-block w-full text-center px-5 py-2 text-sm font-semibold bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-[color:var(--color-primary-content)] rounded-full shadow-lg hover:from-[color:var(--color-accent)] hover:to-[color:var(--color-primary)] hover:text-[color:var(--color-accent-content)] transition-all duration-300"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default UpcomingSessions;
