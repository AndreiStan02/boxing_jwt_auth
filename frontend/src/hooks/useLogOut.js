import { useState } from "react";
import { logout } from "../lib/api";
import { navigate } from "../lib/navigation";

export const useLogOut = () => {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const logOut = async () => {
    setIsPending(true);
    setIsError(false);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err.message);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { logOut, isPending, isError };
};
