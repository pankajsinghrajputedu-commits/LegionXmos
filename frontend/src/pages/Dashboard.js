import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Sparkles, Users, Trophy, Plus, Loader2, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_jds: 0, total_assessments: 0, total_candidates: 0, total_scored: 0 });
  const [hiringSessions, setHiringSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, { withCredentials: true }),
        axios.get(`${API}/hiring-sessions`, { withCredentials: true })
      ]);
      
      setStats(statsRes.data);
      setHiringSessions(sessionsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewHiring = () => {
    navigate('/new-hiring');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Date/Time */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your hiring processes</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Date and Time Display */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Calendar size={18} className="text-red-800" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{formatDate(currentTime)}</div>
                <div className="text-gray-500">{formatTime(currentTime)}</div>
              </div>
            </div>
            <button
              onClick={createNewHiring}
              className="flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
              data-testid="new-hiring-button"
            >
              <Plus size={20} />
              Start New Hiring
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total_jds}</div>
                <div className="text-sm text-gray-600">Job Descriptions</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total_assessments}</div>
                <div className="text-sm text-gray-600">Assessments</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total_candidates}</div>
                <div className="text-sm text-gray-600">Candidates</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-amber-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.total_scored}</div>
                <div className="text-sm text-gray-600">Scored</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Hiring Sessions</h2>
            <button
              onClick={createNewHiring}
              className="text-red-800 hover:text-red-700 font-semibold text-sm"
            >
              + New
            </button>
          </div>

          {hiringSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 mb-4">No hiring sessions yet</p>
              <button
                onClick={createNewHiring}
                className="px-6 py-2.5 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 btn-animate"
              >
                Start Your First Hiring
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {hiringSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/hiring?id=${session.id}`)}
                  className="p-5 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md cursor-pointer transition-all"
                  data-testid={`hiring-session-${session.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.name}</h3>
                      {session.description && (
                        <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          session.status === 'active' ? 'bg-green-100 text-green-700' :
                          session.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-red-800 hover:bg-red-50 rounded-lg font-medium text-sm">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;