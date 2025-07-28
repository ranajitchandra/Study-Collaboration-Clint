import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import { AuthContext } from "../../../context/AuthContextProvider";

export default function UpdateStudySession() {
    const { id: sessionId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue } = useForm();
    const axiosSecure = useAxiosSecureApi();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext); // optional if tutorEmail/tutoreName needed

    // 🔁 Pre-fill form with existing session
    useEffect(() => {
        axiosSecure.get(`/study-sessions/${sessionId}`)
            .then(res => {
                const session = res.data;

                // Format date fields as yyyy-mm-dd
                const formattedSession = {
                    title: session.title || "",
                    description: session.description || "",
                    registrationStart: session.registrationStart?.substring(0, 10),
                    registrationEnd: session.registrationEnd?.substring(0, 10),
                    classStart: session.classStart?.substring(0, 10),
                    classEnd: session.classEnd?.substring(0, 10),
                    duration: session.duration || "",
                    status: session.status || "pending"
                };

                reset(formattedSession); // 👈 reset entire form
            })
            .catch(err => {
                console.error("Failed to load session", err);
                toast.error("Failed to load session data");
            });
    }, [sessionId, axiosSecure, reset]);

    // 🛠 Submit update request
    const onSubmit = async (data) => {
        const updatedSession = {
            action: "update",
            title: data.title,
            description: data.description,
            registrationStart: new Date(data.registrationStart),
            registrationEnd: new Date(data.registrationEnd),
            classStart: new Date(data.classStart),
            classEnd: new Date(data.classEnd),
            duration: data.duration,
            status: data.status
        };

        try {
            setLoading(true);
            const res = await axiosSecure.patch(`/study-sessions/${sessionId}`, updatedSession);
            console.log("Update response:", res.data);
            toast.success("Study session updated successfully");
            navigate("/dashboard/admin-view-all-study-sessions");
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            toast.error("Failed to update session");
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
                Update Study Session
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
                <div>
                    <label className="label">
                        <span className="label-text">Session Status</span>
                    </label>
                    <select
                        {...register("status")}
                        className="select select-bordered w-full"
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
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

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
                >
                    {loading ? "Updating..." : "Update"}
                </motion.button>
            </form>
        </motion.div>
    );
}
