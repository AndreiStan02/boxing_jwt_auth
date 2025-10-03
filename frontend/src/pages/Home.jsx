import { useLogOut } from "../hooks/useLogOut";

const Home = () => {
        const { logOut, isPending, isError } = useLogOut();

  return (
      <div className="flex justify-center align-middle h-screen">
          <button className='btn btn-m mb-2 mt-4' onClick={(e) => {
              e.preventDefault();
              logOut();
          }}>Log out</button>

      </div>
  )
}

export default Home
