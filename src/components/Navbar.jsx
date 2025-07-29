
import { Link, NavLink, useNavigate } from "react-router"

import PlusTrail from "./PlusTrail"
import { toast } from "react-toastify"
import { useContext } from "react"
import Loading from "./Loading"
import { AuthContext } from "../context/AuthContextProvider"
import mainLogo from "../assets/logo.png"


export default function Navbar() {

    const { user, loading, theTheme, setTheTheme, logOutUser } = useContext(AuthContext)
    const navigate = useNavigate()

    if (loading) {
        return <Loading></Loading>
    }
    function handleLogOut() {
        logOutUser()
            .then(() => {
                toast.success(`Logout Successful, `);
                navigate("/login")
            })
    }

    return (
        <>
            <div className="navbar bg-base-100 shadow-md border-b border-b-gray-300">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                            <li><NavLink to="/" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Home</NavLink></li>
                            <li><NavLink to="#" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Tutors</NavLink></li>
                            <li><NavLink to="#" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Study Sessions</NavLink></li>

                        </ul>
                    </div>
                    <div className="flex items-center gap-3">
                        <img width="32" className="ml-4" src={mainLogo} alt="" />
                        <span className="text-xl lg:text-3xl font-bold text-primary">Study Collab</span>
                    </div>
                </div>

                {/* nav menu */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-4 px-1">
                        <li><NavLink to="/" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Home</NavLink></li>
                        <li><NavLink to="/tutors" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Tutors</NavLink></li>
                        <li><NavLink to="/study-sessions" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Study Sessions</NavLink></li>

                    </ul>
                </div>

                <div className="navbar-end">
                    <input onClick={() => setTheTheme(!theTheme)} type="checkbox" defaultChecked className="toggle toggle-sm mr-5" />
                    {user ?
                        <div className="flex gap-2">
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    className="btn btn-ghost btn-circle avatar tooltip tooltip-left"
                                    data-tip={user.displayName}
                                >
                                    <div className="w-10 rounded-full">
                                        <img
                                            src={user.photoURL}
                                            alt="User"
                                        />
                                    </div>
                                </div>

                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-4 w-60 p-4 shadow"
                                >
                                    <li className="border-b border-gray-200">
                                        <Link to="/dashboard" className="flex items-center gap-2">
                                            <span className="font-bold">DashBoard</span>
                                        </Link>
                                    </li>
                                    <li className="border-b border-gray-200">
                                        <a>
                                            Name: <span className="font-bold">{user.displayName}</span>
                                        </a>
                                    </li>
                                    <li className="border-b border-gray-200">
                                        <a>
                                            Email: <span className="font-bold">{user.email}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <button onClick={() => handleLogOut()}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        :
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal gap-4 px-1">
                                <li><NavLink to="/login" className="hover:bg-primary py-1 px-5 hover:text-white duration-500 rounded-sm">Signin</NavLink></li>
                            </ul>
                        </div>
                    }



                </div>
            </div>

            <PlusTrail></PlusTrail>

        </>
    )
}