import { FaTwitter, FaFacebookF, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-10 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <p className="text-sm mb-4">
                        A garden is a peaceful, vibrant space filled with blooming flowers, where tools like spades and trowels help maintain the land. Butterflies flutter between blossoms, making every garden a beautiful blend of nature, care, and joy.
                    </p>

                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl"><img className="hidden lg:block w-8 bg-white p-0.5 rounded"  alt="Logo" /></span> Job Portal
                    </h2>
                    <div className="flex space-x-4 mt-4 text-lg">
                        <FaTwitter />
                        <FaFacebookF />
                        <FaMapMarkerAlt />
                        <FaInstagram />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Gardening</li>
                        <li>Lawn Service</li>
                        <li>Leaf Removal</li>
                        <li>Irrigation System</li>
                        <li>Decoration</li>
                        <li>Trimming</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Free a Quote</li>
                        <li>Terms and Condition</li>
                        <li>FAQ</li>
                        <li>Contact us</li>
                        <li>Sales Support</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                        <li>About us</li>
                        <li>Leadership</li>
                        <li>Careers</li>
                        <li>News & article</li>
                        <li>Legal Notice</li>
                    </ul>
                </div>
            </div>

            <div className="flex items-center justify-center py-2 mt-5 text-md">
                <span>© {new Date().getFullYear()} Garden World. All Rights Reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;



