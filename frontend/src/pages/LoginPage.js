import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('choice'); // 'choice', 'email', 'otp'
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState(null);

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { email });
      setMode('otp');
      setReceivedOtp(response.data.otp);
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, 
        { email, otp },
        { withCredentials: true }
      );
      
      toast.success(isSignUp ? 'Account created!' : 'Login successful!');
      navigate('/dashboard', { state: { user: response.data.user }, replace: true });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://customer-assets.emergentagent.com/job_f15728e6-3b8b-4f2b-948d-ac6bc57b2b14/artifacts/dre5uctd_11904047_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-red-950/70" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Large Logo */}
            <div className="text-center space-y-4">
              <img 
                src={LOGO_URL}
                alt="LegionX" 
                className="h-20 w-auto mx-auto cursor-pointer hover:scale-105 transition-transform"
                onClick={() => window.location.href = '/'}
              />
              <h1 className="text-3xl font-bold text-white">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-white/70">
                {isSignUp ? 'Sign up to get started with LegionX' : 'Sign in to continue to LegionX'}
              </p>
            </div>

            {mode === 'choice' && (
              <div className="space-y-4">
                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl font-semibold text-gray-800 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  data-testid="google-login-button"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/60">OR</span>
                  </div>
                </div>

                {/* Email */}
                <button
                  onClick={() => setMode('email')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  data-testid="email-login-button"
                >
                  <Mail size={20} />
                  Continue with Email
                </button>

                {/* Toggle Sign In/Sign Up */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <span className="font-semibold text-red-400 hover:text-red-300">
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/90">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 bg-white/10 backdrop-blur border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    data-testid="email-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            )}

            {mode === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setMode('email')}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-white/70">
                    We sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-white">{email}</span>
                  </p>
                  {receivedOtp && (
                    <div className="mt-3 p-4 bg-green-500/20 backdrop-blur border border-green-400/30 rounded-xl">
                      <p className="text-xs text-green-300 font-semibold uppercase tracking-wide">For Testing - Your OTP:</p>
                      <p className="text-3xl font-bold text-green-400 tracking-[0.3em] mt-1">{receivedOtp}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/90">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-4 text-center text-3xl font-bold bg-white/10 backdrop-blur border border-white/30 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none tracking-[0.5em] transition-all"
                    data-testid="otp-input"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Verifying...
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Verify & Login'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMode('email')}
                  className="w-full text-sm text-white/60 hover:text-white transition-colors"
                >
                  Didn't receive code? Try again
                </button>
              </form>
            )}
          </div>

          <div className="text-center mt-6 text-sm text-white/50">
            By continuing, you agree to our Terms & Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
