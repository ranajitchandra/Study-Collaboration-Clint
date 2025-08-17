import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';
import mainLogo from "../assets/logo.png";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="max-w-7xl mx-auto bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)] py-10 px-6 md:px-16">
            <div className=" grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

                {/* Logo & Tagline */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <img width="32" src={mainLogo} alt="Logo" />
                        <span className="text-xl lg:text-2xl font-bold text-[color:var(--color-accent-content)]">Study Collab</span>
                    </div>
                    <p className="text-sm text-[color:var(--color-secondary-content)]">
                        Empowering students and tutors to collaborate and learn effectively.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-accent-content)]">Quick Links</h3>
                    <ul className="space-y-1 text-sm text-[color:var(--color-secondary-content)]">
                        <li><Link to="/" className="hover:text-[color:var(--color-accent)] transition-colors">Home</Link></li>
                        <li><Link to="/study-sessions" className="hover:text-[color:var(--color-accent)] transition-colors">Study Sessions</Link></li>
                        <li><Link to="/tutors" className="hover:text-[color:var(--color-accent)] transition-colors">Tutors</Link></li>
                        <li><Link to="/dashboard" className="hover:text-[color:var(--color-accent)] transition-colors">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-accent-content)]">Policies</h3>
                    <ul className="space-y-1 text-sm text-[color:var(--color-secondary-content)]">
                        <li><Link to="/terms" className="hover:text-[color:var(--color-accent)] transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-[color:var(--color-accent)] transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/faq" className="hover:text-[color:var(--color-accent)] transition-colors">FAQ</Link></li>
                        <li><Link to="/contact" className="hover:text-[color:var(--color-accent)] transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-accent-content)]">Connect with us</h3>
                    <div className="flex space-x-4 text-lg text-[color:var(--color-secondary-content)]">
                        <a href="#" className="hover:text-[color:var(--color-accent)] transition-colors"><FaTwitter /></a>
                        <a href="#" className="hover:text-[color:var(--color-accent)] transition-colors"><FaFacebookF /></a>
                        <a href="#" className="hover:text-[color:var(--color-accent)] transition-colors"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-[color:var(--color-secondary-content)] mt-8 text-sm">
                © {new Date().getFullYear()} Study Collab. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
