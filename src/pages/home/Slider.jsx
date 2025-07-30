import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 👉 Static slide data
const slides = [
    {
        title: "Explore Knowledge",
        tagline: "Join engaging study sessions today",
        image:
            "https://i.ibb.co/ksPK0ccW/photo-1516919396874-034e0faf44cc-q-80-w-1074-auto-format-fit-crop-ixlib-rb-4-1.jpg"
    },
    {
        title: "Learn Together",
        tagline: "Collaborate with top tutors and peers",
        image:
            "https://i.ibb.co/FkpY6cFk/photo-1523240795612-9a054b0db644-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg"
    },
    {
        title: "Achieve Your Goals",
        tagline: "Boost your skills with guided sessions",
        image:
            "https://i.ibb.co/8Lj1yWCD/photo-1641531105535-1ead3c1784ab-q-80-w-1111-auto-format-fit-crop-ixlib-rb-4-1.jpg"
    },
];

export default function Slider() {
    return (
        <section className="w-full h-[500px] mb-2">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-[500px] bg-cover bg-center relative flex items-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="relative z-10 text-white text-left p-8 max-w-xl ml-10">
                                <h2 className="text-4xl font-bold mb-3">{slide.title}</h2>
                                <p className="text-lg">{slide.tagline}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
