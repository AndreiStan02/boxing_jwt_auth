import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { verifyEmail } from '../lib/api';

const VerifyEmail = () => {
    const { code } = useParams();
    const { isPending, isSuccess, isError } = useQuery({
        queryKey: ["emailVerification", code],
        queryFn: () => verifyEmail(code)
    });

    return (
        <div className="bg-accent w-full min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md flex items-center justify-center relative overflow-hidden rounded-3xl p-8 bg-black">
                {isPending ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-accent-contents">Verifying email...</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-6">
                        <p className="text-3xl font-bold mb-2">BoxLink</p>

                        <div className={`w-full p-4 rounded-xl flex items-center gap-3 ${
                            isSuccess
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                        }`}>
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                isSuccess ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                                {isSuccess ? (
                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                )}
                            </div>
                            <span className={isSuccess ? 'text-green-400' : 'text-red-400'}>
                                {isSuccess ? 'Email verified!' : 'Invalid link'}
                            </span>
                        </div>

                        {isError && (
                            <p className="text-sm text-accent text-center">
                                The link is either invalid or expired.{' '}
                                <Link to="/password/forgot" replace className="link">
                                    Get a new link
                                </Link>
                            </p>
                        )}

                        <Link to="/login" replace className="link text-sm">
                            {isSuccess ? 'Go to login' : 'Back to home'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
