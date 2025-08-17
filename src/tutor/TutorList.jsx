import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAxiosSecureApi from '../hooks/useAxiosSecureApi';
import Loading from '../components/Loading';

export default function TutorsList() {
    const axiosSecure = useAxiosSecureApi();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosSecure.get('/tutors')
            .then(res => {
                setTutors(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [axiosSecure]);

    if (loading) return <p className="text-center py-10"><Loading /></p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {tutors.map((tutor, index) => (
                <motion.div
                    key={tutor._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-base-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center"
                >
                    <img
                        src={tutor.photoURL}
                        alt={tutor.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-neutral"
                    />
                    <h2 className="text-xl font-semibold text-primary mt-4">{tutor.name}</h2>
                    <p className="text-sm text-base-content mt-1">{tutor.email}</p>
                </motion.div>
            ))}
        </div>
    );
}
