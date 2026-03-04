import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { FileText, Sparkles, TrendingUp, Trophy, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'JD Parsing',
      description: 'AI extracts role, skills, and responsibilities from any job description in seconds.',
      path: '/jd-input',
      color: 'from-blue-400 to-blue-600',
      testId: 'home-jd-card',
    },
    {
      icon: Sparkles,
      title: 'Assessment Generation',
      description: 'Generate tailored, role-specific tests with MCQs, scenarios, and tasks automatically.',
      path: '/assessments',
      color: 'from-purple-400 to-purple-600',
      testId: 'home-assessment-card',
    },
    {
      icon: TrendingUp,
      title: 'AI Scoring',
      description: 'Consistent, detailed evaluation with reasoning for every answer and candidate.',
      path: '/scoring',
      color: 'from-cyan-400 to-cyan-600',
      testId: 'home-scoring-card',
    },
    {
      icon: Trophy,
      title: 'Leaderboard',
      description: 'Ranked candidates with strengths, weaknesses, and hiring recommendations.',
      path: '/leaderboard',
      color: 'from-amber-400 to-amber-600',
      testId: 'home-leaderboard-card',
    },
  ];

  const stats = [
    { label: 'Assessment Generation', value: '<60s', color: 'text-blue-400' },
    { label: 'Consistent Scoring', value: '100%', color: 'text-purple-400' },
    { label: 'Functions Supported', value: 'All', color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen p-8 noise-bg">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 pt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-sm font-semibold text-blue-400 mb-4">
            <Zap size={16} />
            <span>AI-Powered Hiring Companion</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Beat Claude
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            AI that reads JDs, generates tests, scores candidates, and recommends who moves forward
            — all without a single human hour spent reviewing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              data-testid="get-started-button"
              onClick={() => navigate('/jd-input')}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, idx) => (
            <GlassCard key={idx} className="p-6 text-center space-y-2">
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
              >
                <GlassCard
                  hover
                  className="p-8 space-y-4 cursor-pointer h-full group"
                  onClick={() => navigate(feature.path)}
                  data-testid={feature.testId}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:gap-3 transition-all duration-300">
                    Explore
                    <ArrowRight size={16} />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        <GlassCard className="p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to transform your hiring process?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start by pasting a job description. Our AI will handle the rest.
          </p>
          <button
            data-testid="cta-button"
            onClick={() => navigate('/jd-input')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles size={20} />
            Create Your First Assessment
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;