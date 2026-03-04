import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, CheckCircle, Loader2, Search, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Scoring = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [submissionsRes, scoresRes] = await Promise.all([
        axios.get(`${API}/submissions`, { withCredentials: true }),
        axios.get(`${API}/scores`, { withCredentials: true })
      ]);
      
      setSubmissions(submissionsRes.data);
      setScores(scoresRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreForSubmission = (submissionId) => {
    return scores.find(s => s.submission_id === submissionId);
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  if (selectedScore) {
    return (
      <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedScore(null)}
            className={`font-semibold ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back to All Submissions
          </button>

          <div className={`rounded-xl shadow-sm border p-6 space-y-6 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Evaluation Results</h2>
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                <CheckCircle size={14} />
                Scored
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Candidate</div>
                <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedScore.candidate_name}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{selectedScore.candidate_email}</div>
              </div>

              <div className="space-y-2">
                <div className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Total Score</div>
                <div className="text-4xl font-bold text-red-800">{selectedScore.total_score.toFixed(1)}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>out of {selectedScore.question_scores.length * 10}</div>
              </div>

              <div className="space-y-2">
                <div className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Percentage</div>
                <div className="text-4xl font-bold text-green-600">{selectedScore.percentage.toFixed(1)}%</div>
                <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-green-600 transition-all duration-1000"
                    style={{ width: `${selectedScore.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border p-6 space-y-6 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <TrendingUp size={20} />
              Question Breakdown
            </h3>

            <div className="space-y-4">
              {selectedScore.question_scores.map((qs, idx) => (
                <div key={qs.question_id} className={`p-4 rounded-lg border space-y-3 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Question {idx + 1}</div>
                    <div className="text-lg font-bold text-red-800">{qs.score.toFixed(1)}/10</div>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-red-800 transition-all duration-700"
                      style={{ width: `${(qs.score / 10) * 100}%` }}
                    />
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{qs.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-xl shadow-sm border p-6 space-y-4 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <h3 className="text-xl font-bold text-green-700">Strengths</h3>
              <ul className="space-y-3">
                {selectedScore.strengths.map((strength, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-xl shadow-sm border p-6 space-y-4 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <h3 className="text-xl font-bold text-amber-700">Areas for Improvement</h3>
              <ul className="space-y-3">
                {selectedScore.weaknesses.map((weakness, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <TrendingUp size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendation - Highlighted */}
          <div className={`rounded-xl shadow-sm border p-6 space-y-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-red-800/50' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
            <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Sparkles className="text-red-800" size={24} />
              AI Recommendation
            </h3>
            <p className={`leading-relaxed text-lg ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              {selectedScore.recommendations || 'No AI recommendation available for this candidate.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Scoring</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>View detailed AI evaluations for all candidate submissions</p>
        </div>

        <div className={`rounded-xl shadow-sm border p-4 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder="Search by candidate name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className={`rounded-xl shadow-sm border p-12 text-center transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <TrendingUp className={isDark ? 'text-slate-500' : 'text-gray-400'} size={32} />
            </div>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>No submissions found</p>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              Candidates need to complete assessments first
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubmissions.map((submission) => {
              const score = getScoreForSubmission(submission.id);
              return (
                <div
                  key={submission.id}
                  onClick={() => score && setSelectedScore(score)}
                  className={`rounded-xl shadow-sm border p-6 transition-all ${
                    score ? 'cursor-pointer hover:shadow-md' : ''
                  } ${isDark ? 'bg-slate-900 border-slate-800 hover:border-red-800/50' : 'bg-white border-gray-200 hover:border-red-300'}`}
                  data-testid={`submission-${submission.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-800 font-bold text-lg">
                          {submission.candidate_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{submission.candidate_name}</div>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{submission.candidate_email}</div>
                        <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                          Submitted: {new Date(submission.submitted_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {score ? (
                        <>
                          <div className="text-3xl font-bold text-red-800">{score.percentage.toFixed(1)}%</div>
                          <button className="mt-2 px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
                            View Details →
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Loader2 className="animate-spin" size={20} />
                          <span className="text-sm font-semibold">Scoring...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoring;
