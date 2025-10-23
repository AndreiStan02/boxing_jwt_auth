import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

const Home = () => {
    const navigate = useNavigate()
    const redirectUrl = "/login"
    const {
        mutate: exit,
        isPending,
        isError
    } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            navigate(redirectUrl,{
                replace: true
            })
        }
    });

  return (
      <div className="flex justify-center align-middle h-screen">
          <button className='btn btn-m mb-2 mt-4' disabled={isPending} onClick={(e) => {
              e.preventDefault();
              exit();
          }}>{ isPending ? <span className="loading loading-dots loading-xl"></span> : 'Log out'}</button>

      </div>
  )
}

export default Home
