import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
    }),
};

const TopRatedSessions = () => {
    const { data: topSessions = [] } = useQuery({
        queryKey: ["topRatedSessions"],
        queryFn: async () => {
            const res = await axios.get(
                "https://student-colabroration-server.vercel.app/public-study-sessions"
            );
            const allSessions = res.data.filter((s) => s.status === "approved");

            // Simulate or fallback avgRating
            return allSessions
                .map((s) => ({
                    ...s,
                    avgRating: s.avgRating || Math.floor(Math.random() * 3 + 3),
                }))
                .sort((a, b) => b.avgRating - a.avgRating)
                .slice(0, 5);
        },
    });

    return (
        <section className="my-20 px-4 md:px-8">
            {/* Title */}
            <h2 className="text-3xl font-bold mb-12 text-center text-primary">
                Top Rated Sessions
            </h2>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topSessions.map((session, i) => (
                    <motion.div
                        key={session._id}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={cardVariants}
                        whileHover={{ scale: 1.03 }}
                        className="p-6 rounded-lg bg-base-100 shadow-md border border-base-300 
                       hover:shadow-xl hover:border-primary transition"
                    >
                        {/* Title */}
                        <h3 className="font-semibold text-lg text-accent">
                            {session.title}
                        </h3>

                        {/* Tutor */}
                        <p className="text-sm text-neutral mt-1">
                            Tutor: {session.tutorName}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-warning mt-2">
                            {[...Array(Math.round(session.avgRating))].map((_, i) => (
                                <FaStar key={i} />
                            ))}
                            <span className="text-sm text-neutral ml-1">
                                {session.avgRating.toFixed(1)} / 5
                            </span>
                        </div>

                        {/* Link */}
                        <Link
                            to={`/sessions-details/${session._id}`}
                            className="inline-block mt-3 text-sm font-medium text-primary underline hover:text-primary-content"
                        >
                            View Details
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TopRatedSessions;
