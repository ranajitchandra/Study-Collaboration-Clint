import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContextProvider";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";

export default function CreateStudySession() {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecureApi();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        const session = {
            ...data,
            tutorName: user?.displayName,
            tutorEmail: user?.email,
            status: "pending",
            registrationFee: 0,
        };

        console.log("Creating session:", session);
        
        try {
            setLoading(true);
            const res = await axiosSecure.post("/study-sessions", session);
            console.log("Session created:", res.data);
            toast.success("Study session created (Pending Approval)");
            reset();
        } catch (error) {
            console.error("Error creating session:", error.response?.data || error.message);
            toast.error("Failed to create session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto p-8 bg-base-100 shadow-lg rounded-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <h2 className="text-3xl font-bold mb-6 text-primary text-center">
                Create Study Session
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="label">
                        <span className="label-text">Session Title</span>
                    </label>
                    <input
                        {...register("title")}
                        type="text"
                        placeholder="Session Title"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="label">
                        <span className="label-text">Session Description</span>
                    </label>
                    <textarea
                        {...register("description")}
                        placeholder="Session Description"
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["registrationStart", "registrationEnd", "classStart", "classEnd"].map((field, i) => (
                        <div key={i}>
                            <label className="label">
                                <span className="label-text">
                                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                                </span>
                            </label>
                            <input
                                {...register(field)}
                                type="date"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Duration */}
                <div>
                    <label className="label">
                        <span className="label-text">Session Duration</span>
                    </label>
                    <input
                        {...register("duration")}
                        type="text"
                        placeholder="e.g., 2 Weeks"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Tutor Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Tutor Name</span>
                        </label>
                        <input
                            value={user?.displayName || ""}
                            type="text"
                            readOnly
                            className="input input-bordered w-full bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Tutor Email</span>
                        </label>
                        <input
                            value={user?.email || ""}
                            type="email"
                            readOnly
                            className="input input-bordered w-full bg-gray-100"
                        />
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
                >
                    {loading ? "Submitting..." : "Submit for Approval"}
                </motion.button>
            </form>
        </motion.div>
    );
}
