import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContextProvider';
import useAxiosSecureApi from '../../../hooks/useAxiosSecureApi';

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

    const { data: reviews = [] } = useQuery({
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
        }
    };

    if (isLoading) return <p>Loading session details...</p>;

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold">{sessionDetails.title}</h2>
            <p><strong>Tutor:</strong> {sessionDetails.tutorEmail}</p>
            <p><strong>Description:</strong> {sessionDetails.description}</p>
            <p><strong>Fee:</strong> {sessionDetails.registrationFee === 0 ? 'Free' : `$${sessionDetails.registrationFee}`}</p>

            <div className="mt-6">
                <h3 className="text-2xl font-semibold">Submit Your Review</h3>
                <textarea
                    className="textarea textarea-bordered w-full"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    className="input input-bordered w-24 mt-2"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                />
                <button onClick={handleSubmitReview} className="btn btn-primary ml-4 mt-2">Submit Review</button>
            </div>

            <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((r) => (
                        <div key={r._id} className="border p-3 rounded mb-3">
                            <div className="flex items-center gap-3">
                                <img src={r.studentPhoto} alt="User" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold">{r.studentName}</p>
                                    <p className="text-sm text-gray-500">Rating: {r.rating}★</p>
                                </div>
                            </div>
                            <p className="mt-2">{r.reviewText}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
