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

    if (loading) return <p className="text-center"><Loading></Loading></p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {tutors.map((tutor, index) => (
                <motion.div
                    key={tutor._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
                >
                    <img
                        src={tutor.photoURL}
                        alt={tutor.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <h2 className="text-xl font-semibold text-center mt-3">{tutor.name}</h2>
                    <p className="text-center text-gray-500">{tutor.email}</p>
                </motion.div>
            ))}
        </div>
    );
}
