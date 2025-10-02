import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const AppContainer = () => {
  const { user, loading } = useAuth();
  console.log(user);
    return loading ? (
        <span className="loading loading-dots loading-xl"></span>
    ) : user? (
        <div>
          <h1>Home</h1>
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
