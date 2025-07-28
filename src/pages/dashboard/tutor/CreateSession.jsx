import { useForm } from "react-hook-form";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContextProvider";

export default function CreateSession() {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newSession) => {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/study-sessions`, newSession, {
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Study session created (Pending Approval)");
            reset();
            queryClient.invalidateQueries(["tutor-sessions"]);
        },
        onError: () => toast.error("Failed to create session"),
    });

    const onSubmit = (data) => {
        const session = {
            ...data,
            tutorName: user?.displayName,
            tutorEmail: user?.email,
            status: "pending",
            registrationFee: 0,
        };
        mutation.mutate(session);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Create Session</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input className="input" {...register("title")} placeholder="Session Title" required />

                <textarea className="input" {...register("description")} placeholder="Session Description" required />

                <input className="input" type="date" {...register("registrationStart")} placeholder="Registration Start Date" required />
                <input className="input" type="date" {...register("registrationEnd")} placeholder="Registration End Date" required />
                <input className="input" type="date" {...register("classStart")} placeholder="Class Start Date" required />
                <input className="input" type="date" {...register("classEnd")} placeholder="Class End Date" required />

                <input className="input" type="text" {...register("duration")} placeholder="Duration (e.g., 2 Weeks)" required />

                <input className="input" type="text" defaultValue={user?.displayName} readOnly />
                <input className="input" type="email" defaultValue={user?.email} readOnly />

                <button type="submit" className="btn btn-primary w-full">
                    Submit for Approval
                </button>
            </form>
        </div>
    );
}
