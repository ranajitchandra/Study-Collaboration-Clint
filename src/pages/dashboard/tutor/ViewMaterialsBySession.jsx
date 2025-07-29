import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import Loading from "../../../components/Loading";

export default function ViewMaterialsBySession() {
    const { id: sessionId } = useParams();
    const axiosSecure = useAxiosSecureApi();

    const { data: materials = [], isLoading, error } = useQuery({
        queryKey: ["materials-by-session", sessionId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/materials/${sessionId}`);
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center text-xl"><Loading></Loading></p>;
    if (error) return <p className="text-center text-red-500">Failed to load materials.</p>;

    return (
        <div className="max-w-5xl mx-auto mt-6 p-4 bg-base-100 shadow rounded">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Materials for Session: {materials[0]?.sessionTitle || "Untitled"}</h2>

            {materials.length === 0 ? (
                <p className="text-gray-500">No materials uploaded yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => (
                        <div
                            key={item._id}
                            className="bg-secondary text-black rounded shadow p-4 space-y-2"
                        >
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <img
                                src={item.imageUrl}
                                alt="Material"
                                className="w-full h-40 object-cover rounded"
                            />
                            <a
                                href={item.driveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                            >
                                View Google Drive Resource
                            </a>
                            <a
                                href={item.imageUrl}
                                download
                                className="btn btn-sm btn-outline btn-accent"
                            >
                                Download Image
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
