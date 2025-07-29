import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';
import { AuthContext } from '../../context/AuthContextProvider';
import useAxiosSecureApi from '../../hooks/useAxiosSecureApi';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { sessionId } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecureApi();
    const { logTracking } = useTrackingLogger();
    const navigate = useNavigate();

    const [error, setError] = useState('');


    const { isPending, data: sessionInfo = {} } = useQuery({
        queryKey: ['sessions', sessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/study-sessions/${sessionId}`);
            return res.data;
        }
    })

    if (isPending) {
        return '...loading'
    }

    const amount = sessionInfo.cost;
    const amountInCents = amount * 100;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        // step- 1: validate the card
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
        }
        else {
            setError('');
            console.log('payment method', paymentMethod);

            // step-2: create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId: sessionId
            })

            const clientSecret = res.data.clientSecret;

            // step-3: confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setError('');
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment succeeded!');
                    const transactionId = result.paymentIntent.id;
                    // step-4 mark parcel paid also create payment history
                    const paymentData = {
                        parcelId: sessionId,
                        email: user.email,
                        amount,
                        transactionId: transactionId,
                        paymentMethod: result.paymentIntent.payment_method_types
                    }

                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    if (paymentRes.data.insertedId) {

                        // ✅ Show SweetAlert with transaction ID
                        await Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                            confirmButtonText: 'Go to My Parcels',
                        });


                        await logTracking(
                            {
                                tracking_id: sessionInfo.tracking_id,
                                status: "payment_done",
                                details: `Paid by ${user.displayName}`,
                                updated_by: user.email,
                            }
                        )
                    // ✅ Redirect to /myParcels
                    navigate('/dashboard/myParcels');

                }
            }
        }
    }





}

return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
            <CardElement className="p-2 border rounded">
            </CardElement>
            <button
                type='submit'
                className="btn btn-primary text-black w-full"
                disabled={!stripe}
            >
                Pay ${amount}
            </button>
            {
                error && <p className='text-red-500'>{error}</p>
            }
        </form>
    </div>
);
};

export default PaymentForm;