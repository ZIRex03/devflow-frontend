
import { useAppSelector } from '@/hooks/reduxHooks'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from './routes';


const ProtectedRoute = () => {
    const location = useLocation();
    const { currentUser, isLoading } = useAppSelector(({ users }) => users);

    if(isLoading){
        return(
            <div>
                Loading...
            </div>
        )
    }

    if (!currentUser) {
        return <Navigate to={ROUTES.USERFORM} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute