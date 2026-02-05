import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '@/app/store/hooks';
import { setCredentials } from '@/app/modules/auth/authSlice';

export const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');

            if (accessToken && refreshToken) {
                // Store tokens
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);

                try {
                    // Fetch user data using relative path to avoid CORS issues if origins differ (localhost vs 127.0.0.1)
                    const response = await axios.get('/api/user', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    const user = response.data;

                    // Sync Redux state
                    dispatch(setCredentials({ user, token: accessToken }));

                    // Redirect based on profile completion status
                    if (user.is_profile_completed) {
                        navigate('/home');
                    } else {
                        navigate('/profile-setup');
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    navigate('/auth');
                }
            } else {
                // Error or missing tokens
                console.error('Missing tokens in callback URL');
                navigate('/auth');
            }

            setIsLoading(false);
        };

        handleCallback();
    }, [searchParams, navigate, dispatch]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p>Logging you in...</p>
            </div>
        </div>
    );
};
