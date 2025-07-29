import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContextProvider";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";

export default function UploadMaterials() {
    const { user } = useContext(AuthContext);
    const { id :sessionId } = useParams(); // get sessionId from route
    const axiosSecure = useAxiosSecureApi();
    const { register, handleSubmit, reset } = useForm();
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setUploading(true);

            // Upload image to ImgBB
            const imageFile = data.image[0];
            const formData = new FormData();
            formData.append("image", imageFile);
            const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                method: "POST",
                body: formData,
            });
            const imgData = await res.json();

            if (!imgData.success) throw new Error("Image upload failed");
            
            const material = {
                title: data.title,
                sessionId,
                tutorEmail: user.email,
                imageUrl: imgData.data.display_url,
                driveLink: data.driveLink,
            };
            console.log(sessionId, "--", material);

            const response = await axiosSecure.post("/materials", material);

            if (response.data.insertedId) {
                toast.success("Material uploaded successfully");
                reset();
                navigate("/dashboard/my-study-sessions")
            } else {
                toast.error("Failed to upload material");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-base-100 shadow rounded">
            <h2 className="text-2xl font-bold text-primary mb-4">Upload Material</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="label">Title</label>
                    <input
                        {...register("title", { required: true })}
                        type="text"
                        placeholder="Material Title"
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Tutor Email */}
                <div>
                    <label className="label">Tutor Email</label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        readOnly
                        className="input input-bordered w-full bg-gray-100"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="label">Upload Image</label>
                    <input
                        {...register("image", { required: true })}
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                {/* Google Drive Link */}
                <div>
                    <label className="label">Google Drive Link</label>
                    <input
                        {...register("driveLink", { required: true })}
                        type="url"
                        placeholder="https://drive.google.com/..."
                        className="input input-bordered w-full"
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${uploading ? "btn-disabled" : ""}`}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}
