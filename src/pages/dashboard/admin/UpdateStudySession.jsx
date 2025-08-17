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
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecureApi();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axiosSecure.get(`/study-sessions/${sessionId}`)
            .then(res => {
                const session = res.data;
                reset({
                    title: session.title || "",
                    description: session.description || "",
                    registrationStart: session.registrationStart?.slice(0, 10),
                    registrationEnd: session.registrationEnd?.slice(0, 10),
                    classStart: session.classStart?.slice(0, 10),
                    classEnd: session.classEnd?.slice(0, 10),
                    duration: session.duration || "",
                    status: session.status || "pending",
                    registrationFee: session.registrationFee || 0,
                });
            })
            .catch(err => {
                console.error("Failed to load session", err);
                toast.error("Failed to load session data");
            });
    }, [sessionId, axiosSecure, reset]);

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
            status: data.status,
            registrationFee: parseFloat(data.registrationFee),
        };

        try {
            setLoading(true);
            const res = await axiosSecure.patch(`/study-sessions/${sessionId}`, updatedSession);
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
            className="max-w-3xl mx-auto p-8 bg-base-100 shadow-xl rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <h2 className="text-3xl font-bold mb-6 text-primary text-center">
                Update Study Session
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Title */}
                <div>
                    <label className="label"><span className="label-text font-medium">Session Title</span></label>
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
                    <label className="label"><span className="label-text font-medium">Session Description</span></label>
                    <textarea
                        {...register("description")}
                        placeholder="Session Description"
                        className="textarea textarea-bordered w-full"
                        rows={4}
                        required
                    />
                </div>

                {/* Registration Fee */}
                <div>
                    <label className="label"><span className="label-text font-medium">Registration Fee (TK)</span></label>
                    <input
                        {...register("registrationFee")}
                        type="number"
                        step="0.01"
                        placeholder="Enter fee amount"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="label"><span className="label-text font-medium">Session Status</span></label>
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
                                <span className="label-text font-medium">
                                    {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
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
                    <label className="label"><span className="label-text font-medium">Session Duration</span></label>
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
