import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookies from "react-cookies";


const ProtectedRoute = () => {
    if (!cookies.load("access")) {
        return <Navigate to="/account/login" />
    }
    return <Outlet />;
}


export default ProtectedRoute;
