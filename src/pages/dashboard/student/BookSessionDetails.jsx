import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContextProvider';
import useAxiosSecureApi from '../../../hooks/useAxiosSecureApi';
import Loading from '../../../components/Loading';

export default function BookedSessionDetails() {
    const { bookedSessionId } = useParams();
    const axiosSecure = useAxiosSecureApi();
    const { user } = useContext(AuthContext);

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    const { data: sessionDetails = {}, isLoading } = useQuery({
        queryKey: ['sessionDetail', bookedSessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/study-sessions/${bookedSessionId}`);
            return res.data;
        }
    });

    const {
        data: reviews = [],
        refetch: refetchReviews
    } = useQuery({
        queryKey: ['sessionReviews', bookedSessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews?sessionId=${bookedSessionId}`);
            return res.data;
        }
    });

    const handleSubmitReview = async () => {
        const review = {
            sessionId: bookedSessionId,
            studentEmail: user.email,
            studentName: user.displayName,
            studentPhoto: user.photoURL,
            reviewText,
            rating,
            createdAt: new Date()
        };

        const res = await axiosSecure.post('/reviews', review);

        if (res.data.insertedId) {
            Swal.fire('Success', 'Review submitted!', 'success');
            setReviewText('');
            setRating(5);
            refetchReviews();
        }
    };

    if (isLoading) return <p><Loading /></p>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 bg-base-100 text-base-content">

            {/* Session Info Card */}
            <div className="card shadow-md bg-white border rounded-2xl">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold">{sessionDetails.title}</h2>
                    <p><span className="font-semibold">Tutor:</span> {sessionDetails.tutorEmail}</p>
                    <p><span className="font-semibold">Description:</span> {sessionDetails.description}</p>
                    <p>
                        <span className="font-semibold">Fee:</span>{" "}
                        {sessionDetails.registrationFee === 0 ? (
                            <span className="badge badge-success">Free</span>
                        ) : (
                            <span className="badge badge-info">${sessionDetails.registrationFee}</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Review Form */}
            <div className="card shadow-sm bg-white border rounded-2xl">
                <div className="card-body">
                    <h3 className="text-2xl font-semibold mb-4">Submit Your Review</h3>

                    <textarea
                        className="textarea textarea-bordered w-full resize-none"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                    />

                    {/* Rating Stars */}
                    <div className="flex items-center gap-2 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
                    </div>

                    <button
                        onClick={handleSubmitReview}
                        className="btn btn-primary mt-4 w-fit"
                    >
                        Submit Review
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="mt-10">
                <h3 className="text-2xl font-bold mb-6">Reviews</h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((r) => (
                            <div
                                key={r._id}
                                className="p-4 border rounded-xl shadow-sm bg-white"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={r.studentPhoto}
                                        alt="User"
                                        className="w-12 h-12 rounded-full border"
                                    />
                                    <div>
                                        <p className="font-semibold">{r.studentName}</p>
                                        <p className="text-sm text-yellow-500">
                                            {"★".repeat(r.rating)}{" "}
                                            <span className="text-gray-400">
                                                {"★".repeat(5 - r.rating)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3 text-gray-700">{r.reviewText}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
