import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { GlassCard } from '@/components/GlassCard';
import { CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TestSubmitted = () => {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('id');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId) {
      checkScore();
    }
  }, [submissionId]);

  const checkScore = async () => {
    try {
      const response = await axios.get(`${API}/score/submission/${submissionId}`);
      if (response.data.scored) {
        setScore(response.data.score);
      } else {
        // Retry after 5 seconds if not scored yet
        setTimeout(checkScore, 5000);
      }
    } catch (error) {
      console.error('Error fetching score:', error);
      setTimeout(checkScore, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Test Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for completing the assessment. Your responses have been recorded.
            </p>
          </div>

          {loading && !score && (
            <div className="flex items-center justify-center gap-3 text-red-800">
              <Loader2 className="animate-spin" size={24} />
              <span>AI is scoring your responses...</span>
            </div>
          )}

          {score && (
            <div className="space-y-6 mt-8">
              <div className="p-6 bg-red-50 rounded-xl">
                <div className="text-6xl font-bold text-red-800 mb-2">
                  {score.percentage.toFixed(1)}%
                </div>
                <div className="text-gray-600">Your Score</div>
                <div className="mt-4 w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-800 transition-all duration-1000"
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {score.strengths.map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {score.weaknesses.map((weakness, idx) => (
                      <li key={idx}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl text-left">
                <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                <p className="text-gray-700">{score.recommendations}</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg text-left space-y-2 mt-6">
            <div className="text-sm font-semibold text-blue-800">What happens next?</div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• The hiring team will review your results</li>
              <li>• You will be contacted if selected for the next round</li>
            </ul>
          </div>

          {submissionId && (
            <div className="text-xs text-gray-500 font-mono">
              Submission ID: {submissionId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSubmitted;