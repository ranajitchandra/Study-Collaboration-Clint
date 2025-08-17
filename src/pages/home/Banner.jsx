import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function BannerSection() {
    return (
        <div
            className="relative bg-cover bg-center flex items-center justify-center text-white"
            style={{
                backgroundImage:
                    "url('https://i.ibb.co/xqLCn0jk/photo-1489710437720-ebb67ec84dd2-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-3xl text-center p-10"
            >
                {/* Icon */}
                <div className="flex justify-center mb-4 text-5xl text-[color:var(--color-accent)]">
                    <FaBookOpen />
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-4xl font-bold mb-4 text-[color:var(--color-primary-content)] drop-shadow-lg">
                    Empowering Collaborative Learning
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-[color:var(--color-secondary-content)]">
                    Join study sessions, access resources, and grow together with peers and tutors.
                </p>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 px-6 py-3 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-accent)] text-[color:var(--color-primary-content)] font-semibold rounded-full shadow-lg"
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    );
}
