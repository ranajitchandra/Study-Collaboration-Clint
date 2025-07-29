import { useContext } from "react"
import { Navigate, useLocation } from "react-router"
import { AuthContext } from "../context/AuthContextProvider"
import Loading from "../components/Loading"



export default function PrivateRoute({ children }) {


    const { user, loading } = useContext(AuthContext)
    const location = useLocation()

    if (loading) {
        return (
            <>
                <Loading></Loading>
            </>
        )
    } else if (!user) {
        return <Navigate state={location.pathname} to="/login"></Navigate>
    } else {
        return children
    }
}