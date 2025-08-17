import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAxiosSecureApi from "../../hooks/useAxiosSecureApi";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContextProvider";
import Loading from "../../components/Loading";
import useUserRole from "../../hooks/useUserRole";

export default function StudySessionDetails() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecureApi();
    const [session, setSession] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { role, roleLoading } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/study-sessions/${id}`);
                setSession(res.data);

                const reviewRes = await axiosSecure.get(`/reviews?sessionId=${id}`);
                setReviews(reviewRes.data || []);
            } catch (error) {
                console.error("Failed to load session details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, axiosSecure]);

    const getAverageRating = () => {
        if (!reviews.length) return "No ratings yet";
        const avg =
            reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
            reviews.length;
        return `${avg.toFixed(1)} / 5`;
    };

    const isRegistrationClosed = () => {
        if (!session) return false;
        return new Date() > new Date(session.registrationEnd);
    };

    if (loading)
        return (
            <div className="text-center py-10">
                <Loading />
            </div>
        );
    if (!session)
        return <div className="text-center py-10 text-neutral-content">Session not found</div>;

    const handleBooking = async () => {
        if (session.registrationFee > 0) {
            const res = await axiosSecure.get("/booked-sessions", {
                params: { sessionId: session._id, studentEmail: user.email },
            });
            if (res.data) {
                Swal.fire({
                    icon: "info",
                    title: "Already Booked",
                    text: "You have already booked this paid session.",
                });
                return;
            }
            navigate(`/payment/${session._id}`);
        } else {
            try {
                const bookingData = {
                    sessionId: session._id,
                    sessionTitle: session.title,
                    tutorEmail: session.tutorEmail,
                    studentEmail: user.email,
                };
                const res = await axiosSecure.post("/booked-sessions", bookingData);
                if (res.data.insertedId) {
                    Swal.fire("Booked", "You’ve successfully booked the session!", "success");
                } else {
                    Swal.fire("Already Booked", "You have already booked this session.", "info");
                }
            } catch (err) {
                console.error("Booking failed:", err);
                Swal.fire("Error", "Failed to book the session. Try again.", "error");
            }
        }
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto p-6 bg-base-100 border border-neutral rounded-2xl shadow-lg my-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-center text-primary mb-6">{session.title}</h2>

            <div className="space-y-3 text-base-content">
                <p>
                    <strong>Tutor Name:</strong> {session.tutorName}
                </p>
                <p>
                    <strong>Average Rating:</strong> {getAverageRating()}
                </p>
                <p>
                    <strong>Description:</strong> {session.description}
                </p>
                <p>
                    <strong>Registration Start:</strong>{" "}
                    {format(new Date(session.registrationStart), "PPP")}
                </p>
                <p>
                    <strong>Registration End:</strong> {format(new Date(session.registrationEnd), "PPP")}
                </p>
                <p>
                    <strong>Class Start:</strong> {format(new Date(session.classStart), "PPP")}
                </p>
                <p>
                    <strong>Class End:</strong> {format(new Date(session.classEnd), "PPP")}
                </p>
                <p>
                    <strong>Duration:</strong> {session.duration}
                </p>
                <p className="mb-4">
                    <strong>Registration Fee:</strong>{" "}
                    {session.registrationFee === 0 ? "Free" : `$${session.registrationFee}`}
                </p>
            </div>

            <button
                onClick={handleBooking}
                disabled={
                    roleLoading ||
                    role === "admin" ||
                    role === "tutor" ||
                    isRegistrationClosed()
                }
                className={`btn btn-primary mt-4 w-full ${roleLoading || role === "admin" || role === "tutor" || isRegistrationClosed()
                        ? "btn-disabled"
                        : ""
                    }`}
            >
                {roleLoading
                    ? "Checking role..."
                    : role === "admin" || role === "tutor"
                        ? "Booking not allowed"
                        : isRegistrationClosed()
                            ? "Registration Closed"
                            : "Book Now"}
            </button>

            {/* Reviews Section */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4 text-primary">Student Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-neutral-content">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border border-neutral p-4 rounded-xl bg-base-200 shadow-sm"
                            >
                                <p className="text-sm text-base-content font-medium">
                                    {review.studentName || "Anonymous"}
                                </p>
                                <p className="text-yellow-500 text-sm">Rating: {review.rating} / 5</p>
                                <p className="text-base-content text-sm mt-1">{review.reviewText}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
