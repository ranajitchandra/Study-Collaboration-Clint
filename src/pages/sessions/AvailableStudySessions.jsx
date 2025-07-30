import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import useAxiosSecureApi from "../../hooks/useAxiosSecureApi";
import Loading from "../../components/Loading";

export default function AvailableStudySessions() {
    const axiosSecure = useAxiosSecureApi();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // react-paginate is 0-indexed
    const [pageCount, setPageCount] = useState(0);
    const limit = 6;

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/study-pagination-sessions?page=${page + 1}&limit=${limit}&status=approved`);
            setSessions(res.data.sessions || []);
            setPageCount(res.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [page]);

    const getSessionStatus = (registrationEndDate) => {
        const now = new Date();
        const end = new Date(registrationEndDate);
        return now > end ? "Closed" : "Ongoing";
    };

    const handlePageClick = (selectedItem) => {
        setPage(selectedItem.selected);
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Available Study Sessions</h2>

            {loading ? (
                <Loading />
            ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No study sessions available.</p>
            ) : (
                <>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {sessions.map((session) => (
                            <motion.div
                                key={session._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-primary">{session.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">{session.description}</p>
                                    <p className="mt-2">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span
                                            className={`badge ${getSessionStatus(session.registrationEnd) === "Ongoing"
                                                ? "badge-success"
                                                : "badge-error"
                                                }`}
                                        >
                                            {getSessionStatus(session.registrationEnd)}
                                        </span>
                                    </p>
                                </div>

                                <Link
                                    to={`/sessions-details/${session._id}`}
                                    className="btn btn-primary btn-sm mt-4 w-fit self-start"
                                >
                                    Read More
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pagination Controls */}
                    <div className="mt-10 flex justify-center">
                        <ReactPaginate
                            previousLabel={"← Prev"}
                            nextLabel={"Next →"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination flex gap-2"}
                            pageClassName={"px-3 py-1 border rounded"}
                            activeClassName={"bg-primary text-white"}
                            previousClassName={"px-3 py-1 border rounded"}
                            nextClassName={"px-3 py-1 border rounded"}
                            disabledClassName={"opacity-50 pointer-events-none"}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
