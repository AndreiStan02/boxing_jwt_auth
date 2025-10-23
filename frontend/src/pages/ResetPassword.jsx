import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from '../lib/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const {
        mutate: resetUserPassword,
        isPending,
        isSuccess,
        isError,
        error
    } = useMutation({
        mutationFn: resetPassword
    })

    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const exp = Number(searchParams.get("exp"));
    const now = Date.now();
    const linkIsValid = code && exp && exp > now;

    return (
        linkIsValid ? <div className="bg-accent w-full h-screen flex items-center justify-center relative">
            <div className="w-1/2 h-1/2 flex items-center justify-center relative overflow-hidden rounded-3xl p-4 bg-black">
                <div className="w-3/4 overflow-hidden p-1">
                    <p className='text-3xl font-bold mb-4'>BoxLink</p>
                    <fieldset className="fieldset mb-4">
                        <legend className="fieldset-legend text-accent-contents">Set new password.</legend>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                resetUserPassword({ newPassword: password, verificationCode: code });
                            }}>
                                <input
                                    type="password"
                                    className="input mb-1 w-full"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                />

                                <button
                                    type="submit"
                                    className='btn btn-m w-full mb-2 mt-4'
                                    disabled={password.length < 6 || isPending}
                                >
                                    {isPending ? 'Resetting password...' : 'Reset Password'}
                                </button>
                            </form>
                    </fieldset>
                    {isSuccess && <p className='text-green-500 text-sm mb-2'>Password reset successfully!</p>}
                    {isError && <p className='text-red-500 text-sm mb-2'>Error: {error?.message || 'Failed to reset password'}</p>}
                    <p className='text-xs'>Go back to <Link to="/login" className='link'>Sign in</Link> or <Link to="/register" className='link'>Sign up</Link></p>
                </div>
            </div>
        </div> :
        <div className="bg-accent w-full h-screen flex items-center justify-center relative">
            <div className="w-1/2 h-1/2 flex items-center justify-center relative overflow-hidden rounded-3xl p-4 bg-black">
                <div className="w-3/4 overflow-hidden p-1">
                        <p className='text-3xl font-bold mb-4'>BoxLink</p>
                        <p className='text-xl mb-1'>Invalid Link</p>
                        <p className='text-m mb-4 text-accent'>The link is either invalid or expired.</p>
                        <p className='text-xs'><Link to="/password/forgot" className='link'>Request a new password reset link</Link></p>
                </div>
            </div>
        </div>
  )
}

export default ResetPassword
