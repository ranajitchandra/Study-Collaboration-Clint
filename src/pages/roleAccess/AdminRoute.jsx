import React, { Children, useContext } from 'react';
import { Navigate } from 'react-router';
import Loading from '../../components/Loading';
import { AuthContext } from '../../context/AuthContextProvider';
import useUserRole from '../../hooks/useUserRole';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default AdminRoute;