import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaBan } from "react-icons/fa";

export default function Forbidden() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            >
                <div className="flex justify-center mb-4">
                    <FaBan size={64} className="text-red-500" />
                </div>
                <h1 className="text-4xl font-bold text-red-600 mb-2">403 Forbidden</h1>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition duration-300"
                >
                    Go Home
                </Link>
            </motion.div>
        </motion.div>
    );
}
