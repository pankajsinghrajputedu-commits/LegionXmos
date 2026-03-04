import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Medal, TrendingUp, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">{rank}</div>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'border-yellow-300 bg-yellow-50';
    if (rank === 2) return 'border-gray-300 bg-gray-50';
    if (rank === 3) return 'border-amber-300 bg-amber-50';
    return 'border-gray-200 bg-white';
  };

  const filteredAssessments = assessments.filter(a =>
    (a.job_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  if (selectedAssessment && !loadingLeaderboard) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => {
              setSelectedAssessment(null);
              setLeaderboard([]);
            }}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Back to All Assessments
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAssessment.job_title}</h2>
            <p className="text-gray-600">{leaderboard.length} candidates ranked</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Trophy size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No scored candidates yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`bg-white rounded-xl shadow-sm border-2 ${getRankColor(entry.rank)} p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-16">
                      {getRankIcon(entry.rank)}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">{entry.candidate_name}</h3>
                          <p className="text-sm text-gray-600">{entry.candidate_email}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-4xl font-bold text-red-800">{entry.percentage.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">{entry.total_score.toFixed(1)} points</div>
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-red-800 transition-all duration-1000"
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-green-700 uppercase flex items-center gap-1">
                            <TrendingUp size={12} />
                            Strengths
                          </div>
                          <ul className="space-y-1">
                            {entry.strengths.slice(0, 3).map((strength, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-600">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-blue-700 uppercase">AI Recommendation</div>
                          <p className="text-sm text-gray-700 line-clamp-3">{entry.recommendations}</p>
                        </div>
                      </div>
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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">View ranked candidates for all assessments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assessments by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 mb-4">No assessments found</p>
            <button
              onClick={() => navigate('/jd-input')}
              className="px-6 py-2.5 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 btn-animate"
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:border-red-300 hover:shadow-md transition-all"
                data-testid={`assessment-${assessment.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{assessment.job_title || 'Untitled Assessment'}</h3>
                    <p className="text-sm text-gray-600">{assessment.questions?.length || 0} questions</p>
                    <p className="text-xs text-gray-500 mt-1">
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
            <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-red-800" size={48} />
              <p className="text-gray-900 font-semibold">Loading leaderboard...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
