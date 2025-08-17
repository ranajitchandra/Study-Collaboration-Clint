import { Link, NavLink, useNavigate } from "react-router"
import PlusTrail from "./PlusTrail"
import { toast } from "react-toastify"
import { useContext } from "react"
import Loading from "./Loading"
import { AuthContext } from "../context/AuthContextProvider"
import mainLogo from "../assets/logo.png"

export default function Navbar() {
    const { user, loading, logOutUser, theTheme, setTheTheme } = useContext(AuthContext)
    const navigate = useNavigate()

    if (loading) {
        return <Loading />
    }

    function handleLogOut() {
        logOutUser()
            .then(() => {
                toast.success("Logout Successful")
                navigate("/login")
            })
    }

    return (
        <>
            <div className="max-w-7xl px-10 mx-auto navbar bg-base-100 shadow-md border-b border-gray-300 sticky top-0 z-50">
                {/* Navbar Start */}
                <div className="navbar-start">
                    {/* Mobile Dropdown */}
                    <div className="dropdown">
                        <div tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                            <li>
                                <NavLink to="/" className="px-4 py-2 hover:text-primary duration-300">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/tutors" className="px-4 py-2 hover:text-primary duration-300">Tutors</NavLink>
                            </li>
                            <li>
                                <NavLink to="/study-sessions" className="px-4 py-2 hover:text-primary duration-300">Study Sessions</NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img width="32" className="ml-4" src={mainLogo} alt="logo" />
                        <span className="text-xl lg:text-3xl font-bold text-primary">Study Collab</span>
                    </div>
                </div>

                {/* Navbar Center (Desktop Menu) */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-4 px-1 font-medium">
                        <li>
                            <NavLink to="/" className="px-4 py-2 hover:text-primary duration-300">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/tutors" className="px-4 py-2 hover:text-primary duration-300">Tutors</NavLink>
                        </li>
                        <li>
                            <NavLink to="/study-sessions" className="px-4 py-2 hover:text-primary duration-300">Study Sessions</NavLink>
                        </li>
                    </ul>
                </div>

                {/* Navbar End */}
                <div className="navbar-end">
                    {user ? (
                        <>
                            <input onClick={() => setTheTheme(!theTheme)} type="checkbox" defaultChecked className="toggle toggle-sm mr-5" />
                            <div className="flex gap-2">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0}
                                        className="btn btn-ghost btn-circle avatar tooltip tooltip-left"
                                        data-tip={user.displayName}>
                                        <div className="w-10 rounded-full border border-primary">
                                            <img src={user.photoURL} alt="User" />
                                        </div>
                                    </div>

                                    <ul tabIndex={0}
                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-4 w-60 p-4 shadow">
                                        <li className="border-b border-gray-200">
                                            <Link to="/dashboard" className="flex items-center gap-2 text-primary font-semibold">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className="border-b border-gray-200 py-1">
                                            <span>Name: <span className="font-bold">{user.displayName}</span></span>
                                        </li>
                                        <li className="border-b border-gray-200 py-1">
                                            <span>Email: <span className="font-bold">{user.email}</span></span>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogOut}
                                                className="btn btn-outline btn-primary w-full mt-2">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="navbar-center lg:flex">
                            <ul className="menu menu-horizontal gap-4 px-1">
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="btn btn-primary px-5 rounded-sm">
                                        Signin
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <PlusTrail />
        </>
    )
}
