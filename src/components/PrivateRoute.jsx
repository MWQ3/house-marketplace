import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loading from "./Loading"

const PrivateRoute = () => {
    const { loggedIn, loading } = useAuthStatus()
    const location = useLocation()
    console.log(location.pathname)

    if(loading) {
       return < Loading />
    }
    
  return loggedIn ? < Outlet /> : < Navigate to='/sign-in' />
}

export default PrivateRoute