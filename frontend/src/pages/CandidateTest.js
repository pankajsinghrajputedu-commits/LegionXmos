import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CandidateTest = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    loadTest();
  }, [linkId]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && started) {
      handleSubmit();
    }
  }, [started, timeLeft]);

  const loadTest = async () => {
    try {
      const response = await axios.get(`${API}/test/${linkId}`);
      setTest(response.data);
    } catch (error) {
      console.error('Error loading test:', error);
      toast.error('Test not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!started) return;
    
    if (!candidateName || !candidateEmail) {
      toast.error('Please enter your name and email');
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = test.questions.map((q) => ({
        question_id: q.question_id,
        answer: answers[q.question_id] || '',
      }));

      const response = await axios.post(`${API}/test/submit`, {
        link_id: linkId,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        answers: answersArray,
      });

      toast.success('Test submitted successfully!');
      navigate(`/test-submitted?id=${response.data.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return 'text-red-600 bg-red-50 border-red-200';
    if (timeLeft < 600) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h1>
          <p className="text-gray-600">The test link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{test.job_title}</h1>
            <p className="text-gray-600">Assessment Test</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Your Name *</label>
              <input
                data-testid="candidate-name-input"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Your Email *</label>
              <input
                data-testid="candidate-email-input"
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-semibold text-blue-900">Test Instructions:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>{test.questions.length} questions</li>
                <li>60 minutes time limit</li>
                <li>Answer all questions to the best of your ability</li>
                <li>Test will auto-submit when time expires</li>
              </ul>
            </div>
          </div>

          <button
            data-testid="start-test-button"
            onClick={() => setStarted(true)}
            disabled={!candidateName || !candidateEmail}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-800 px-8 py-4 font-semibold text-white shadow-lg hover:bg-red-700 btn-animate disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {test.questions.length} | Answered: {answeredCount}
              </div>
              <div className="w-64 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-red-800 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTimeColor()}`}>
              <Timer size={18} />
              <span className="font-mono font-bold text-lg" data-testid="timer">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                {currentQ.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{currentQ.text}</h2>
          </div>

          {currentQ.type === 'mcq' && currentQ.options ? (
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  data-testid={`option-${idx}`}
                  onClick={() => handleAnswerChange(currentQ.question_id, option)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQ.question_id] === option
                      ? 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              data-testid="answer-textarea"
              value={answers[currentQ.question_id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.question_id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-48 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all resize-none"
            />
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              data-testid="previous-button"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion < test.questions.length - 1 ? (
              <button
                data-testid="next-button"
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-6 py-3 rounded-lg bg-red-800 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                data-testid="submit-test-button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit Test
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Question Navigator</div>
          <div className="flex flex-wrap gap-2">
            {test.questions.map((q, idx) => (
              <button
                key={q.question_id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                  currentQuestion === idx
                    ? 'bg-red-800 text-white'
                    : answers[q.question_id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTest;
