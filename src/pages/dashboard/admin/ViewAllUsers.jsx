import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";
import Loading from "../../../components/Loading";

export default function ViewAllUsers() {
    const axiosSecure = useAxiosSecureApi();
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (query = "") => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/users?search=${query}`);
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await axiosSecure.patch(`/users/${userId}`, { role: newRole });
            if (res.data.modifiedCount > 0) {
                toast.success("Role updated successfully");
                fetchUsers(searchText);
            }
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchText);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-base-100 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Manage Users</h2>

            <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="input input-bordered w-full md:flex-1 focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" className="btn btn-primary w-full md:w-auto">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loading />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-base-200 shadow-sm">
                    <table className="table w-full">
                        <thead className="bg-base-200 text-base-content">
                            <tr>
                                <th className="text-left">#</th>
                                <th className="text-left">Email</th>
                                <th className="text-left">Role</th>
                                <th className="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-base-200 transition-colors duration-200"
                                >
                                    <td>{index + 1}</td>
                                    <td className="font-medium">{user.email}</td>
                                    <td>
                                        <span
                                            className={`badge ${user.role === "admin"
                                                    ? "badge-error"
                                                    : user.role === "tutor"
                                                        ? "badge-primary"
                                                        : "badge-info"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="select select-bordered w-full max-w-xs"
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user._id, e.target.value)
                                            }
                                        >
                                            <option value="student">Student</option>
                                            <option value="tutor">Tutor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <p className="text-center text-gray-500 py-6">
                            No users found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
