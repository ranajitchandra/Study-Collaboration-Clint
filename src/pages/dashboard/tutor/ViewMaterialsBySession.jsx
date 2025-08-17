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

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-60">
                <Loading />
            </div>
        );

    if (error)
        return (
            <p className="text-center text-red-600 font-semibold mt-6">
                Failed to load materials.
            </p>
        );

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6  rounded-2xl">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                Materials for Session: {materials[0]?.sessionTitle || "Untitled"}
            </h2>

            {materials.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No materials uploaded yet.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((item) => (
                        <div
                            key={item._id}
                            className="bg-gradient-to-b from-base-100 via-base-200 to-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 p-5 flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>

                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4 border border-base-300"
                                />
                            )}

                            <div className="flex flex-col gap-2 mt-auto">
                                {item.driveLink && (
                                    <a
                                        href={item.driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent font-semibold hover:text-accent-content underline transition-colors duration-200"
                                    >
                                        View Google Drive Resource
                                    </a>
                                )}
                                {item.imageUrl && (
                                    <a
                                        href={item.imageUrl}
                                        download
                                        className="btn btn-sm btn-outline btn-primary w-fit"
                                    >
                                        Download Image
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
