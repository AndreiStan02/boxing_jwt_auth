import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Home from "../pages/Home.jsx";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return isLoading ? (
      <div className="flex justify-center align-middle h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    ) : user? (
        <div>
          <Home />
          <Outlet />
        </div>
    ) : (
         <Navigate
      to="/login"
      replace
      state={{
        redirectUrl: window.location.pathname,
      }}
    />
    )
}

export default AppContainer
