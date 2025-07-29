
import Lottie from 'lottie-react';
import { Link } from 'react-router';
import err from '../assets/err.json'

const ErrorPage = () => {

    return (
        <>

            <div className="max-h-screen bg-white text-center px-4 flex flex-col items-center justify-center">
                <Lottie style={{ width: "800px"}} animationData={err} loop={true} />
                <p className="text-xl text-gray-600 mb-6">
                    Oops! The page you're looking for doesn't exist.
                </p>

                <Link to="/"
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                >
                    Go Home
                </Link>
            </div>








        </>
    );
};

export default ErrorPage;
