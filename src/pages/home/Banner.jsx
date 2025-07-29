import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function BannerSection() {
    return (
        <div
            className="relative bg-cover bg-center h-[85vh] flex items-center justify-center text-white"
            style={{
                backgroundImage:
                    "url('https://i.ibb.co/1fMjZMMR/pexels-photo-1326947-jpeg-cs-srgb-dl-pexels-george-dolgikh-551816-1326947.jpg')", // Replace with your desired image URL
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-3xl text-center px-6"
            >
                <div className="flex justify-center mb-4 text-5xl text-emerald-300">
                    <FaBookOpen />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    Empowering Collaborative Learning
                </h1>
                <p className="text-lg md:text-xl text-gray-200">
                    Join study sessions, access resources, and grow together with peers and tutors.
                </p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg"
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    );
}
