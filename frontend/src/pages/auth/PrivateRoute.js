import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const token = localStorage.getItem('token');
    //todo - ask for is not checking validness of the token, right idea?
    return (token ? <Outlet/> : <Navigate to="/login"/>)
}

export default PrivateRoutes
