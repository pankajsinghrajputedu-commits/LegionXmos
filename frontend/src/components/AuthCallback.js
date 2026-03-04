import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        const hash = window.location.hash;
        const sessionId = new URLSearchParams(hash.substring(1)).get('session_id');

        if (!sessionId) {
          console.error('No session_id found');
          toast.error('Authentication failed');
          navigate('/', { replace: true });
          return;
        }

        console.log('Processing session_id:', sessionId.substring(0, 10) + '...');

        const response = await axios.post(`${BACKEND_URL}/api/auth/session`, {
          session_id: sessionId
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Session exchange successful');
        const user = response.data.user;
        
        // Clear the hash
        window.history.replaceState(null, '', window.location.pathname);
        
        toast.success('Login successful!');
        
        // Navigate to dashboard with user data
        setTimeout(() => {
          navigate('/dashboard', { state: { user }, replace: true });
        }, 100);
        
      } catch (error) {
        console.error('Auth callback error:', error.response?.data || error.message);
        toast.error('Authentication failed. Please try again.');
        navigate('/', { replace: true });
      }
    };

    processSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-red-800 mx-auto" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
