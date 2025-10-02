import { useEffect, useState } from "react";
import { getUser } from "../lib/api"; // tu instancia de axios configurada

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUser();
        setUser(data);
      } catch (err) {
        setUser(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
};

export default useAuth;
