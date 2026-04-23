import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function EmailVerification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const success = searchParams.get('success');
        const message = searchParams.get('message');

        if (success === 'true') {
            setStatus('success');
            setMessage(message || 'Email verified successfully!');
        } else {
            setStatus('error');
            setMessage(message || 'Email verification failed.');
        }
    }, [searchParams]);

    const handleNavigateToLogin = () => {
        navigate('/auth/login');
    };

    const handleNavigateToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
                <div className="card-glass rounded-xl shadow-xl border p-8 text-center">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                            <h2 className="text-2xl font-bold text-foreground">Verifying Email...</h2>
                            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle className="w-20 h-20 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
                            <p className="text-muted-foreground">{message}</p>
                            
                            <div className="space-y-3">
                                {user ? (
                                    <Button
                                        onClick={handleNavigateToDashboard}
                                        className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNavigateToLogin}
                                        className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold"
                                    >
                                        Sign In to Your Account
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <XCircle className="w-20 h-20 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
                            <p className="text-muted-foreground">{message}</p>
                            
                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate('/auth/register')}
                                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold"
                                >
                                    Create New Account
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 rounded-xl"
                                >
                                    Back to Home
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {status === 'error' && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Need help? <Link to="/contact" className="text-primary hover:underline">Contact support</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
}