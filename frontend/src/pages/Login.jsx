import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/loginBackground.jpg";
import { login } from "../lib/api";

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const redirectUrl = location.state?.redirectUrl || "/"

    const {
        mutate: signIn,
        isPending,
        isError
    } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate(redirectUrl,{
                replace: true
            })
        }
    });

  return (
      <div className="h-screen w-screen flex items-center justify-center p-4 overflow-hidden">
        <div className='h-full w-full shadow-2xl rounded-3xl shadow-accent flex'>
            <div className="w-2/5 h-full flex items-center justify-center relative overflow-hidden rounded-l-3xl p-4">
                <div className="w-3/4 overflow-hidden p-1">
                <p className='text-3xl font-bold mb-4'>BoxLink</p>
                <p className='text-xl mb-1'>Welcome Back Boxer!</p>
                <p className='text-m mb-4 text-accent'>We Are Happy To See You Back Again</p>
                <fieldset className="fieldset mb-4">
                    <legend className="fieldset-legend text-accent-contents">Log into your account.</legend>
                          <form onSubmit={(e) => {
                              e.preventDefault(); signIn({ usernameOrEmail: email, unhashedPassword: password, });
                    }}>
                        <input
                            type="text"
                            className="input mb-1 w-full"
                            placeholder="User Name or Email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                            autoComplete="email"
                        />
                        <input
                            type="password"
                            className="input w-full"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            autoComplete="current-password"
                        />
                        <div className="flex justify-end">
                            <p className='text-xs'><Link to="/password/forgot" className='link'>Forgot Password?</Link></p>
                        </div>
                        <button
                            type="submit"
                            className='btn btn-m w-full mb-2 mt-4'
                            disabled={!email || password.length < 6 || isPending}
                        >
                            {isPending ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </fieldset>
                <p className='text-xs'>Dont have an account? <Link to="/register" className='link'>Sign up.</Link></p>
                </div>
            </div>
            <div className="w-3/5 h-full relative overflow-hidden rounded-r-3xl">
                <img
                src={bgImage}
                alt="Background"
                className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute bottom-8 left-8 right-8 text-white text-xs opacity-70 z-10">
                <p>© 2025 BoxLink. All rights reserved.</p>
                <p>By using our services, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
