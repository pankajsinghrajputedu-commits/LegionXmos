import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";
const PROMO_VIDEO = "https://customer-assets.emergentagent.com/job_unzip-start-1/artifacts/mf9pgyia_Video%20Project.mp4";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="https://customer-assets.emergentagent.com/job_f15728e6-3b8b-4f2b-948d-ac6bc57b2b14/artifacts/dre5uctd_11904047_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Fixed Header - Glass Effect */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-16 sm:h-20 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 sm:px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all text-sm sm:text-base border border-white/20"
                data-testid="signin-button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 sm:px-6 py-2.5 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-600 transition-all text-sm sm:text-base shadow-lg shadow-red-900/50"
                data-testid="signup-button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24 text-center">
          <div className="space-y-8">
            {/* Glass Badge */}
            <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold mb-6 shadow-xl">
              AI-Powered Hiring Platform
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight min-h-[140px] sm:min-h-[180px] md:min-h-[200px]">
              <span className="text-red-600 block mb-2 sm:mb-4">Transform Your</span>
              <div className="h-[1.2em] overflow-hidden relative">
                <div className="animate-scroll-words">
                  <span className="block text-white py-1">Hiring Process</span>
                  <span className="block text-white py-1">Talent Acquisition</span>
                  <span className="block text-white py-1">Recruitment</span>
                  <span className="block text-white py-1">Hiring Process</span>
                </div>
              </div>
            </h2>
            
            {/* Glass Subtitle Box */}
            <div className="max-w-3xl mx-auto px-8 py-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
              <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
                End to end AI-powered recruitment solution for modern teams
              </p>
            </div>
            
            {/* Glass CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl text-base sm:text-lg font-bold shadow-2xl shadow-red-900/50 hover:shadow-red-900/80 hover:scale-105 transition-all backdrop-blur-sm"
                data-testid="get-started-button"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl text-base sm:text-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </section>

        {/* Video Showcase Section - Glass Container */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            {/* Glass Frame around video */}
            <div className="p-3 sm:p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="rounded-2xl overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                >
                  <source src={PROMO_VIDEO} type="video/mp4" />
                </video>
              </div>
            </div>
            
            {/* Glass Label below video */}
            <div className="mt-8 text-center">
              <div className="inline-block px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <p className="text-white text-lg sm:text-xl font-light tracking-wider">
                  smooth design
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Smarter Features - Glass Effect */}
        <section className="py-24 sm:py-32 relative">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl mb-12 border border-white/20 shadow-xl">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <span className="text-white font-semibold">AI Enabler Solutions</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Smarter Features. Faster
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mt-2 sm:mt-4">
              Hiring.
            </h2>

            {/* Glass Subtitle */}
            <div className="mt-12 inline-block px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
              <p className="text-lg sm:text-xl text-gray-200 font-serif">
                Candidates you need to attract, engage and hire - all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: AI Agents - Glass Effect */}
        <section className="py-24 sm:py-32 relative">
          {/* Gradient Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl mb-12 border border-white/20 shadow-xl">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <span className="text-white font-semibold">What we do</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              AI Agents for Hiring. All the
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mt-2 sm:mt-4">
              insights you need.
            </h2>

            {/* Glass Description */}
            <div className="mt-12 max-w-3xl mx-auto px-8 py-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
              <p className="text-lg sm:text-xl text-gray-200 font-serif leading-relaxed">
                Behind every answer lies insight. Our AI specialists work together to uncover
                candidate's true potential, ensuring you hire not just faster, but smarter.
              </p>
            </div>
          </div>
        </section>

        {/* Footer - Solid (No Glass) */}
        <footer className="bg-gray-100 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
              {/* Logo & Tagline - BIG LOGO */}
              <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
                <img 
                  src={LOGO_URL}
                  alt="LegionX" 
                  className="h-32 sm:h-40 w-auto mb-6"
                />
                <p className="text-gray-600 font-serif text-base text-center lg:text-left">
                  Hire the best talent, faster with AI
                </p>
              </div>

              {/* Navigation Links */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Features</a>
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Pricing</a>
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Demo</a>
                  </div>
                  <div className="space-y-4">
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">About Us</a>
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Careers</a>
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Blog</a>
                  </div>
                  <div className="space-y-4">
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">FAQ</a>
                    <a href="#" className="block text-gray-900 font-semibold hover:text-red-800 transition-colors">Contact Us</a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="lg:col-span-1 text-center lg:text-left">
                <p className="text-gray-900 font-semibold mb-5">Follow Our Socials:</p>
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  {/* X (Twitter) */}
                  <a href="#" className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-red-800 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-red-800 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-red-800 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-sm">
                2026 LegionX. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-600 text-sm hover:text-red-800 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-600 text-sm hover:text-red-800 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-600 text-sm hover:text-red-800 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
