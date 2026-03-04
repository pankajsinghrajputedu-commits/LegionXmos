import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Medal, TrendingUp, Loader2, Search, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await axios.get(`${API}/assessments`, { withCredentials: true });
      setAssessments(response.data);
    } catch (error) {
      console.error('Error loading assessments:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (assessmentId) => {
    setLoadingLeaderboard(true);
    try {
      const response = await axios.get(`${API}/leaderboard/${assessmentId}`);
      setLeaderboard(response.data);
      setSelectedAssessment(assessments.find(a => a.id === assessmentId));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={28} />;
    if (rank === 2) return <Medal className="text-gray-400" size={28} />;
    if (rank === 3) return <Medal className="text-amber-600" size={28} />;
    return <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>{rank}</div>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return isDark ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-300 bg-yellow-50';
    if (rank === 2) return isDark ? 'border-slate-600 bg-slate-800/50' : 'border-gray-300 bg-gray-50';
    if (rank === 3) return isDark ? 'border-amber-700 bg-amber-900/20' : 'border-amber-300 bg-amber-50';
    return isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white';
  };

  const filteredAssessments = assessments.filter(a =>
    (a.job_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  if (selectedAssessment && !loadingLeaderboard) {
    return (
      <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => {
              setSelectedAssessment(null);
              setLeaderboard([]);
              setExpandedCandidate(null);
            }}
            className={`font-semibold ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back to All Assessments
          </button>

          <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedAssessment.job_title}</h2>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>{leaderboard.length} candidates ranked</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className={`rounded-xl shadow-sm border p-12 text-center transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <Trophy size={48} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
              <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No scored candidates yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${getRankColor(entry.rank)}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-16">
                      {getRankIcon(entry.rank)}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.candidate_name}</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{entry.candidate_email}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-4xl font-bold text-red-800">{entry.percentage.toFixed(1)}%</div>
                          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{entry.total_score.toFixed(1)} points</div>
                        </div>
                      </div>

                      <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-red-800 transition-all duration-1000"
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-green-700 uppercase flex items-center gap-1">
                            <CheckCircle size={12} />
                            Strengths
                          </div>
                          <ul className="space-y-1">
                            {entry.strengths.slice(0, 3).map((strength, idx) => (
                              <li key={idx} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                <span className="text-green-600">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* AI Recommendation - Always visible */}
                        <div className={`space-y-2 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-red-50/50'}`}>
                          <div className="text-xs font-semibold text-red-800 uppercase flex items-center gap-1">
                            <Sparkles size={12} />
                            AI Recommendation
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {entry.recommendations || 'No recommendation available'}
                          </p>
                        </div>
                      </div>

                      {/* Expand for more details */}
                      <button
                        onClick={() => setExpandedCandidate(expandedCandidate === entry.rank ? null : entry.rank)}
                        className={`text-sm font-medium ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-800 hover:text-red-600'}`}
                      >
                        {expandedCandidate === entry.rank ? '- Show Less' : '+ View Full Feedback'}
                      </button>

                      {expandedCandidate === entry.rank && (
                        <div className={`mt-4 p-4 rounded-lg space-y-4 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                          <div>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>All Strengths</h4>
                            <ul className="space-y-1">
                              {entry.strengths.map((strength, idx) => (
                                <li key={idx} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {entry.weaknesses && entry.weaknesses.length > 0 && (
                            <div>
                              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Areas for Improvement</h4>
                              <ul className="space-y-1">
                                {entry.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    <TrendingUp size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30' : 'bg-gradient-to-r from-red-50 to-orange-50'}`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              <Sparkles className="text-red-800" size={18} />
                              Full AI Recommendation
                            </h4>
                            <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                              {entry.recommendations || 'No detailed recommendation available for this candidate.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Leaderboard</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>View ranked candidates for all assessments</p>
        </div>

        <div className={`rounded-xl shadow-sm border p-4 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search assessments by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className={`rounded-xl shadow-sm border p-12 text-center transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <Trophy className={isDark ? 'text-slate-500' : 'text-gray-400'} size={32} />
            </div>
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No assessments found</p>
            <button
              onClick={() => navigate('/new-hiring')}
              className="px-6 py-2.5 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Create First Assessment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAssessments.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => loadLeaderboard(assessment.id)}
                className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:border-red-800/50' : 'bg-white border-gray-200 hover:border-red-300'
                }`}
                data-testid={`assessment-${assessment.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{assessment.job_title || 'Untitled Assessment'}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{assessment.questions?.length || 0} questions</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      Generated: {assessment.generated_at ? new Date(assessment.generated_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700">
                    View Leaderboard →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {loadingLeaderboard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-8 flex flex-col items-center gap-4 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <Loader2 className="animate-spin text-red-800" size={48} />
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading leaderboard...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
