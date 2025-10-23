import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "../lib/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const {mutate: sendPasswordReset, isPending, isSuccess, isError} = useMutation({
        mutationFn: sendPasswordResetEmail
    })
    return (
      <div className="bg-accent w-full h-screen flex items-center justify-center relative">
        <div className="w-1/2 h-1/2 flex items-center justify-center relative overflow-hidden rounded-3xl p-4 bg-black">
            <div className="w-3/4 overflow-hidden p-1">
                <p className='text-3xl font-bold mb-4'>BoxLink</p>
                <fieldset className="fieldset mb-4">
                    <legend className="fieldset-legend text-accent-contents">Reset your password.</legend>
                        <form onSubmit={(e) => {
                            e.preventDefault(); sendPasswordReset(email);
                        }}>
                            <input
                                type="text"
                                className="input mb-1 w-full"
                                placeholder="User Name or Email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                                autoComplete="email"
                            />

                            <button
                                type="submit"
                                className='btn btn-m w-full mb-2 mt-4'
                                disabled={!email || isPending}
                            >
                                {isPending ? 'Sending email...' : 'Reset Password'}
                            </button>
                        </form>
                </fieldset>
                <p className='text-xs'>Go back to <Link to="/login" className='link'>Sign in</Link> or <Link to="/register" className='link'>Sign up</Link></p>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword
