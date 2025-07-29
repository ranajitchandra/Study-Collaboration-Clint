import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContextProvider';
import useAxiosSecureApi from '../../hooks/useAxiosSecureApi';
import Loading from '../../components/Loading';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { sessionId } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { isPending, data: sessionInfo = {} } = useQuery({
        queryKey: ['sessions', sessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/study-sessions/${sessionId}`);
            return res.data;
        }
    });

    if (isPending) {
        return <p className="text-center"><Loading></Loading></p>;
    }

    const amount = sessionInfo.registrationFee || 0;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (paymentError) {
            setError(paymentError.message);
            return;
        } else {
            setError('');
        }

        const res = await axiosSecure.post('/create-payment-intent', {
            amountInCents,
            sessionId
        });

        const clientSecret = res.data.clientSecret;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: user.displayName || 'Anonymous',
                    email: user.email,
                },
            },
        });

        if (result.error) {
            setError(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;

                const bookingData = {
                    sessionId,
                    studentEmail: user.email,
                    sessionTitle: sessionInfo.title,
                    tutorEmail: sessionInfo.tutorEmail,
                    transactionId,
                    paymentStatus: 'paid',
                    bookedAt: new Date(),
                };

                const bookingRes = await axiosSecure.post('/booked-sessions', bookingData);

                if (bookingRes.data.insertedId) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                        confirmButtonText: 'Go to My Sessions',
                    });
                    navigate('/study-sessions');
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Already Booked',
                        text: 'You have already booked this session.',
                    });
                }
            }
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
            >
                <h2 className="text-xl font-semibold text-center mb-4">
                    Pay ${amount} for {sessionInfo.title}
                </h2>

                <CardElement className="p-2 border rounded" />

                <button
                    type="submit"
                    className="btn btn-primary text-black w-full"
                    disabled={!stripe}
                >
                    Pay ${amount}
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;
