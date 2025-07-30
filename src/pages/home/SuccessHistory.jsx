import { FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const successStories = [
    {
        name: "Fatima Rahman",
        field: "Medical Entrance",
        testimonial:
            "The study sessions helped me crack the medical admission test. Tutors were amazing and supportive!",
        image: "https://i.ibb.co/zWrkqfSk/photo-1516534775068-ba3e7458af70-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg",
    },
    {
        name: "Tariq Hasan",
        field: "Computer Science Admission",
        testimonial:
            "The collaborative platform boosted my confidence. I learned new strategies with amazing peer support!",
        image: "https://i.ibb.co/pBbTxxzz/photo-1495995424756-6a5a3f9e7543-q-80-w-1176-auto-format-fit-crop-ixlib-rb-4-1.jpg",
    },
    {
        name: "Ayesha Siddiqua",
        field: "IELTS Preparation",
        testimonial:
            "Personalized guidance and friendly environment made my IELTS prep smooth and effective. Highly recommend!",
        image: "https://i.ibb.co/cRw86xQ/photo-1514355315815-2b64b0216b14-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg",
    },
];

const StudentSuccessStories = () => {
    return (
        <section className="my-20 px-4 md:px-8">
            <h2 className="text-3xl font-bold text-center mb-20 text-black">
                Student Success Stories
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {successStories.map((story, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                        viewport={{ once: false, amount: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={story.image}
                                alt={story.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[color:var(--color-primary)]"
                            />
                            <div>
                                <h4 className="font-semibold text-[color:var(--color-primary)]">{story.name}</h4>
                                <p className="text-sm text-gray-600">{story.field}</p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 relative">
                            <FaQuoteLeft className="text-[color:var(--color-accent)] absolute top-[-10px] left-[-10px]" />
                            <p className="ml-6 leading-relaxed">{story.testimonial}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

    );
};

export default StudentSuccessStories;
