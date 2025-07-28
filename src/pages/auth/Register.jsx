import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import Lottie from "lottie-react";
import registerAni from "../../assets/registerlottie.json"
import { AuthContext } from "../../context/AuthContextProvider";
import useAxiosApi from "../../hooks/useAxiosApi";

export default function Register() {
    const { createUser, updateProfileUser, loginWithGoogle } = useContext(AuthContext);
    const axiosInstance  = useAxiosApi();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/;


    const validateField = (field, value) => {
        const newErrors = { ...errors };

        if (field === "email") {
            if (!emailRegex.test(value)) {
                newErrors.email = "Invalid email format";
            } else {
                delete newErrors.email;
            }
        }

        if (field === "password") {
            if (!passwordRegex.test(value)) {
                newErrors.password =
                    "Password must be at least 8 characters and include an uppercase and a lowercase letter with a special character.";
            } else {
                delete newErrors.password;
            }
        }

        if (field === "name") {
            if (value.trim() === "") {
                newErrors.name = "Name is required";
            } else {
                delete newErrors.name;
            }
        }

        if (field === "photo") {
            if (value.trim() === "") {
                newErrors.photo = "Photo URL is required";
            } else {
                delete newErrors.photo;
            }
        }

        setErrors(newErrors);
    };

    const handleChange = (setter, field) => (e) => {
        const value = e.target.value;
        setter(value);
        validateField(field, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (photo.trim() === "") {
            newErrors.photo = "Photo URL is required";
        }

        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!passwordRegex.test(password)) {
            newErrors.password =
                "Password must be at least 6 characters and include an uppercase and a lowercase letter.";
        }

        setErrors(newErrors);

        const userData = {
            displayName: name,
            photoURL: photo
        };

        if (Object.keys(newErrors).length === 0) {
            createUser(email, password)
                .then(async(result) => {

                    // update userinfo in the database
                    const userInfo = {
                        email,
                        role: 'student', // default role
                        created_at: new Date().toISOString(),
                        last_log_in: new Date().toISOString()
                    }

                    const userRes = await axiosInstance.post('/users', userInfo);
                    console.log(userRes.data);
                    

                    updateProfileUser(userData)
                        .then(() => {
                            toast.success(`Welcome, ${result.user.displayName}`);
                        });
                    navigate("/");
                })
                .catch((err) => {
                    console.log(err.message);
                    toast.info("You have created before");
                });
        }
    };

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then((result) => {
                toast.success(`Login Successful, ${result.user.displayName}`);
                navigate(location.state || "/");
            })
            .catch(() => toast.error("Google Login Failed"));
    };

    return (
        <div className="flex justify-evenly items-center gap-4 min-h-screen bg-base-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-md shadow-2xl w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Register</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-accent">Name</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 rounded border ${errors.name ? "border-red-500" : "border-primary"
                            } focus:outline-none focus:ring-2 focus:ring-primary transition`}
                        value={name}
                        onChange={handleChange(setName, "name")}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-accent">Photo URL</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 rounded border ${errors.photo ? "border-red-500" : "border-primary"
                            } focus:outline-none focus:ring-2 focus:ring-primary transition`}
                        value={photo}
                        onChange={handleChange(setPhoto, "photo")}
                    />
                    {errors.photo && (
                        <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-accent">Email</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 rounded border ${errors.email ? "border-red-500" : "border-primary"
                            } focus:outline-none focus:ring-2 focus:ring-primary transition`}
                        value={email}
                        onChange={handleChange(setEmail, "email")}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-accent">Password</label>
                    <input
                        type="password"
                        className={`w-full px-3 py-2 rounded border ${errors.password ? "border-red-500" : "border-primary"
                            } focus:outline-none focus:ring-2 focus:ring-primary transition`}
                        value={password}
                        onChange={handleChange(setPassword, "password")}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors duration-300"
                >
                    Create
                </button>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex cursor-pointer items-center justify-center text-accent mt-4 py-2 border border-primary rounded bg-white hover:bg-gray-100 transition"
                >
                    <FcGoogle className="mr-2" /> Login with Google
                </button>
                <p className="text-accent mt-4">Already have an account? <Link to="/login" className="text-accent font-bold">Login</Link></p>
            </form>
            <div>
                <Lottie style={{ width: "700px" }} animationData={registerAni}></Lottie>
            </div>
        </div>

    );
}