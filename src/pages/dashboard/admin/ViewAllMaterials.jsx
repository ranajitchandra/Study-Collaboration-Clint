import { useEffect, useState } from "react";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading";

export default function MaterialsWithSessionList() {
    const axiosSecure = useAxiosSecureApi();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = () => {
        setLoading(true);
        axiosSecure.get("/admin/materials")
            .then(res => setMaterials(res.data))
            .catch(err => {
                toast.error("Failed to load materials with session title");
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This material will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/admin/materials/${id}`);
                    setMaterials(prev => prev.filter(mat => mat._id !== id));
                    toast.success("Material deleted successfully");
                } catch (err) {
                    toast.error("Failed to delete material");
                    console.error(err);
                }
            }
        });
    };

    if (loading) return <p className="text-center mt-10"><Loading /></p>;

    return (
        <motion.div
            className="max-w-6xl mx-auto p-6 bg-base-100 shadow-lg rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-content">
                Materials with Study Session Title
            </h2>

            {materials.length === 0 ? (
                <p className="text-center text-neutral-content">No materials found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full rounded-lg border border-neutral shadow-sm">
                        <thead className="bg-primary text-primary-content">
                            <tr>
                                <th>#</th>
                                <th>Material Title</th>
                                <th>Image</th>
                                <th>Session Title</th>
                                <th>Drive Link</th>
                                <th>Added By</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((mat, i) => (
                                <tr
                                    key={mat._id}
                                    className="hover:bg-base-200 transition-colors duration-200"
                                >
                                    <td className="text-base-content font-medium">{i + 1}</td>
                                    <td className="text-primary font-semibold">{mat.title}</td>
                                    <td>
                                        <img
                                            src={mat.imageUrl}
                                            alt={mat.title}
                                            className="w-10 h-10 object-cover rounded shadow-sm"
                                        />
                                    </td>
                                    <td className="text-secondary-content font-medium">{mat.sessionTitle || "Unknown"}</td>
                                    <td>
                                        <a
                                            href={mat.driveLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline text-accent font-medium"
                                        >
                                            Open Drive
                                        </a>
                                    </td>
                                    <td className="text-base-content">{mat.tutorEmail}</td>
                                    <td className="text-neutral-content">{new Date(mat.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(mat._id)}
                                            className="btn btn-xs bg-error text-error-content border-none"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}
