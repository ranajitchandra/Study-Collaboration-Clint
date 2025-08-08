import { Link, NavLink, Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import useUserRole from "../hooks/useUserRole";
import { FaBook, FaChalkboardTeacher, FaClipboardList, FaFileAlt, FaHome, FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";

export default function DashboardLayout() {
    const { user, logOutUser } = useContext(AuthContext);
    const { role, roleLoading } = useUserRole()

    const handleLogout = () => {
        logOutUser()
            .then(() => {
                toast.success(`Logout Successful, `);
                navigate("/login")
            })
    };

    return (
        <div className="drawer lg:drawer-open bg-base-100 min-h-screen max-w-7xl mx-auto">
            {/* Drawer Toggle Button (Mobile) */}
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                {/* Top Navbar */}
                <div className="w-full navbar bg-base-200 lg:hidden px-4">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost lg:hidden">
                        <FiMenu className="text-xl" />
                    </label>
                    <div className="flex-1 text-xl font-bold">Dashboard</div>
                </div>

                {/* Main Page Content */}
                <div className="p-4">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar Drawer */}
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-55 min-h-full bg-base-200 text-base-content space-y-1">
                    <h2 className="text-lg font-semibold mb-4">Hello, {user?.displayName || "User"}</h2>

                    {/* 🔁 Dynamic Role-Based Links */}

                    {/* Tutor */}
                    {!roleLoading && role === 'tutor' && (
                        <>
                            <li><NavLink to="/dashboard/create-study-session"><FaChalkboardTeacher className="inline-block mr-2" />Create Study Session</NavLink></li>
                            <li><NavLink to="/dashboard/my-study-sessions"><FaClipboardList className="inline-block mr-2" />My Study Sessions</NavLink></li>
                        </>
                    )}

                    {/* Admin */}
                    {!roleLoading && role === 'admin' && (
                        <>
                            <li><NavLink to="/dashboard/view-all-users"><FaUserFriends className="inline-block mr-2" />View All Users</NavLink></li>
                            <li><NavLink to="/dashboard/admin-view-all-study-sessions"><FaClipboardList className="inline-block mr-2" />All Study Session</NavLink></li>
                            <li><NavLink to="/dashboard/materials-list"><FaBook className="inline-block mr-2" />Materials List</NavLink></li>
                        </>
                    )}

                    {/* Student */}
                    {!roleLoading && role === 'student' && (
                        <>
                            <li><NavLink to="/dashboard/booked-sessions"><FaBook className="inline-block mr-2" />Booked Sessions</NavLink></li>
                            <li><NavLink to="/dashboard/create-note"><FaNoteSticky className="inline-block mr-2" />Create Note</NavLink></li>
                            <li><NavLink to="/dashboard/notes"><FaFileAlt className="inline-block mr-2" />Notes</NavLink></li>
                            <li><NavLink to="/dashboard/study-materials"><FaBook className="inline-block mr-2" />Study Materials</NavLink></li>
                        </>
                    )}

                    <div className="divider"></div>

                    <li><Link to="/"><FaHome className="inline-block mr-2" />Back to Home</Link></li>
                    <li><button onClick={handleLogout}><FaSignOutAlt className="inline-block mr-2" />Logout</button></li>
                </ul>
            </div>
        </div>
    );
}
