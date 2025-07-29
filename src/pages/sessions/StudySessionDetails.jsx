import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAxiosSecureApi from "../../hooks/useAxiosSecureApi";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContextProvider";

export default function StudySessionDetails() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecureApi();
    const [session, setSession] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // if needed

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/study-sessions/${id}`);
                setSession(res.data);

                // const reviewRes = await axiosSecure.get(`/reviews?sessionId=${id}`);
                // setReviews(reviewRes.data || []);
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

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!session) return <div className="text-center py-10">Session not found</div>;




    const handleBooking = async () => {

        console.log(session.registrationFee > 0 );
        
        
        if (session.registrationFee > 0) {
            // redirect to payment page with session info
            navigate(`/payment/${session._id}`);
        } else {
            try {
                const bookingData = {
                    sessionId: session._id,
                    tutorEmail: session.tutorEmail,
                    studentEmail: user.email,
                    title: session.title,
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
            className="max-w-2xl mx-auto p-6 border rounded-md shadow bg-white my-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-center mb-6">{session.title}</h2>

            <div className="space-y-3 text-gray-700">
                <p><strong>Tutor Name:</strong> {session.tutorName}</p>
                <p><strong>Average Rating:</strong> {getAverageRating()}</p>
                <p><strong>Description:</strong> {session.description}</p>
                <p><strong>Registration Start:</strong> {format(new Date(session.registrationStart), "PPP")}</p>
                <p><strong>Registration End:</strong> {format(new Date(session.registrationEnd), "PPP")}</p>
                <p><strong>Class Start:</strong> {format(new Date(session.classStart), "PPP")}</p>
                <p><strong>Class End:</strong> {format(new Date(session.classEnd), "PPP")}</p>
                <p><strong>Duration:</strong> {session.duration}</p>
                <p>
                    <strong>Registration Fee:</strong>{" "}
                    {session.registrationFee === 0 ? "Free" : `৳${session.registrationFee}`}
                </p>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleBooking}
                    disabled={isRegistrationClosed()}
                    className={`btn btn-primary ${isRegistrationClosed() ? "btn-disabled" : ""}`}
                >
                    {isRegistrationClosed() ? "Registration Closed" : "Book Now"}
                </button>
            </div>

            {/* Reviews */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border p-4 rounded bg-gray-50"
                            >
                                <p className="text-sm text-gray-700">
                                    <strong>{review.studentName || "Anonymous"}:</strong> {review.comment}
                                </p>
                                <p className="text-sm text-yellow-600">
                                    Rating: {review.rating} / 5
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
