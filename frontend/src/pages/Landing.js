import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Sparkles, Zap, Brain, ClipboardCheck, UserCheck, MessageSquare, ShieldCheck } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

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
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/50">
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
                className="px-4 sm:px-6 py-2.5 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-sm sm:text-base"
                data-testid="signin-button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 sm:px-6 py-2.5 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-600 transition-all text-sm sm:text-base shadow-lg"
                data-testid="signup-button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-32 text-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-sm font-semibold mb-6">
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
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Generate 50 tailored questions from any job description. Test candidates with AI-powered assessments. Get instant scoring and recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-base sm:text-lg font-bold shadow-2xl shadow-red-900/50 hover:shadow-red-900/80 hover:scale-105 transition-all"
                data-testid="get-started-button"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl text-base sm:text-lg font-bold border-2 border-white/20 hover:bg-white hover:text-red-800 transition-all"
              >
                Sign Up Now
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/50">
                <Sparkles className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">50 Questions in 60s</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Generate comprehensive, role-specific assessments with MCQs, scenarios, and tasks automatically</p>
            </div>

            <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/50">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Candidate Tracking</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Import candidates, send test invites, track submissions with real-time updates</p>
            </div>

            <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/50">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant AI Insights</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Automatic scoring with strengths analysis, weaknesses, and hiring recommendations</p>
            </div>
          </div>
        </section>

        {/* NEW SECTION 1: Smarter Features. Faster Hiring. */}
        <section className="bg-gray-100 py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full mb-12">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="text-red-800" size={18} />
              </div>
              <span className="text-white font-semibold text-sm">AI Enabler Solutions</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
              Smarter Features. Faster
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mt-2 sm:mt-4">
              Hiring.
            </h2>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mt-8 sm:mt-12 font-serif max-w-2xl mx-auto">
              Candidates you need to attract, engage and hire - all in one place.
            </p>
          </div>
        </section>

        {/* NEW SECTION 2: AI Agents for Hiring */}
        <section className="bg-gray-200 py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full mb-12">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Brain className="text-red-800" size={18} />
              </div>
              <span className="text-white font-semibold text-sm">What we do</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
              AI Agents for Hiring. All the
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mt-2 sm:mt-4">
              insights you need.
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 mt-8 sm:mt-12 font-serif max-w-3xl mx-auto leading-relaxed">
              Behind every answer lies insight. Our AI specialists work together to uncover
              candidate's true potential, ensuring you hire not just faster, but smarter.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <UserCheck className="text-red-800" size={18} />
                </div>
                <span className="text-white font-semibold text-sm">AI Recruiter</span>
              </div>

              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-red-800" size={18} />
                </div>
                <span className="text-white font-semibold text-sm">AI Interviewer</span>
              </div>

              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-red-800" size={18} />
                </div>
                <span className="text-white font-semibold text-sm">AI Verifier</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Badge */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-800 rounded-full mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="text-red-800" size={18} />
                </div>
                <span className="text-white font-semibold text-sm">How it works</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900">
                Three simple steps
              </h2>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Upload Job Description</h3>
                <p className="text-gray-600 font-serif leading-relaxed">
                  Simply paste or upload your job description. Our AI instantly understands the role requirements.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Generate & Send Tests</h3>
                <p className="text-gray-600 font-serif leading-relaxed">
                  Get 50 tailored questions in seconds. Import candidates and send test invites with one click.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Get AI Recommendations</h3>
                <p className="text-gray-600 font-serif leading-relaxed">
                  View instant scores, detailed analysis, strengths, weaknesses, and hiring recommendations.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-red-800 text-white rounded-xl text-lg font-bold hover:bg-red-700 transition-all shadow-xl"
              >
                Start Hiring Smarter →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-16 w-auto mx-auto mb-6 opacity-80"
            />
            <p className="text-gray-400 text-sm">© 2026 LegionX. AI-Powered Hiring Companion.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
