import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from '../assets/signBackground.jpg';
import { register } from "../lib/api";

const Register = () => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {
        mutate: createAccount,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate('/',{
                replace: true
            })
        }
    });
  return (
      <div className="h-screen w-screen flex items-center justify-center p-4 overflow-hidden shadow-2xl shadow-accent">
          <div className='h-full w-full shadow-2xl rounded-3xl shadow-accent flex'>
            <div className="w-2/5 h-full flex items-center justify-center relative overflow-hidden rounded-l-3xl p-4">
                <div className="w-3/4 overflow-hidden p-1">
                <p className='text-3xl font-bold mb-4'>BoxLink</p>
                <p className='text-xl mb-1'>Create your account to join the fight!</p>
                <p className='text-m mb-4 text-accent'>We Are Happy To See You Join Us</p>
                <fieldset className="fieldset mb-4">
                <legend className="fieldset-legend text-accent-contents">Create your new account.</legend>
                <form onSubmit={(e) => { e.preventDefault(); createAccount({ username: userName, email: email, password: password, confirmPassword: confirmPassword});}}>
                    <input type="text" className="input mb-1 w-full" placeholder="User Name" value={userName} onChange={(e) => {setUserName(e.target.value)}}/>
                    <input type="text" className="input mb-1 w-full" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    <input type="password" className="input mb-1 w-full" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    <input type="password" className="input mb-1 w-full" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                    <button type="submit" className='btn btn-m w-full mb-2 ' disabled={!email || !userName || password.length < 6 || isPending}>{isPending ? 'Signing up...' : 'Sign up'}</button>
                </form>
                </fieldset>
                <p className='text-xs'>Already have an account? <Link to="/login" className='link'>Log in.</Link></p>
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

export default Register
