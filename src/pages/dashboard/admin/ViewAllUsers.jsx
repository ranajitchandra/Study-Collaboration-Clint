import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecureApi from "../../../hooks/useAxiosSecureApi";

export default function ViewAllUsers() {
    const axiosSecure = useAxiosSecureApi();
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch users
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

    // Handle role update
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

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchText);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-primary mb-4">Manage Users</h2>

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <select
                                            className="select select-bordered"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
                </div>
            )}
        </div>
    );
}
