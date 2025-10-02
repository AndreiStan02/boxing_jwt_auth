import { useState } from "react";
import { login } from "../lib/api";
import { navigate } from "../lib/navigation";

export const useLogIn = (redirectUrl) => {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const logIn = async (credentials) => {
    setIsPending(true);
    setIsError(false);

    try {
      const { usernameOrEmail, unhashedPassword } = credentials || {};

      if (!usernameOrEmail || !unhashedPassword) {
        throw new Error("Username/Email and password must be provided");
      }

      await login({ usernameOrEmail, unhashedPassword });
      console.log(redirectUrl);
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      console.error(err.message);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { logIn, isPending, isError };
};
