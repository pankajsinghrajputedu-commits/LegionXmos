import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Plus, Loader2, Clock, CheckCircle, Circle, MoreVertical, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const HiringsPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [hiringSessions, setHiringSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    loadHirings();
  }, []);

  const loadHirings = async () => {
    try {
      const response = await axios.get(`${API}/hiring-sessions`, { withCredentials: true });
      setHiringSessions(response.data);
    } catch (error) {
      console.error('Error loading hirings:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (sessionId, newStatus) => {
    try {
      await axios.put(`${API}/hiring-sessions/${sessionId}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      setHiringSessions(prev => 
        prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s)
      );
      toast.success(`Hiring marked as ${newStatus}`);
      setMenuOpen(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this hiring session?')) return;
    
    try {
      await axios.delete(`${API}/hiring-sessions/${sessionId}`, { withCredentials: true });
      setHiringSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Hiring session deleted');
      setMenuOpen(null);
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const filteredSessions = hiringSessions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'active') return s.status === 'active';
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return isDark ? 'bg-green-900/50 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return isDark ? 'bg-blue-900/50 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return isDark ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200';
      default: return isDark ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-14 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
            />
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hirings</h1>
              <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Manage all your hiring sessions</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/new-hiring')}
            className="flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
            data-testid="new-hiring-button"
          >
            <Plus size={20} />
            New Hiring
          </button>
        </div>

        {/* Filter Tabs */}
        <div className={`flex gap-2 p-1.5 rounded-xl shadow-sm border w-fit transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          {[
            { key: 'all', label: 'All', count: hiringSessions.length },
            { key: 'active', label: 'Active', count: hiringSessions.filter(s => s.status === 'active').length },
            { key: 'completed', label: 'Completed', count: hiringSessions.filter(s => s.status === 'completed').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === tab.key 
                  ? 'bg-red-800 text-white shadow' 
                  : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Hirings List */}
        {filteredSessions.length === 0 ? (
          <div className={`rounded-2xl shadow-sm border p-12 text-center transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <Briefcase className={isDark ? 'text-slate-500' : 'text-gray-400'} size={40} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No hirings found</h3>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              {filter === 'all' 
                ? "Start your first hiring process to see it here" 
                : `No ${filter} hirings at the moment`}
            </p>
            <button
              onClick={() => navigate('/new-hiring')}
              className="px-6 py-3 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
            >
              Start New Hiring
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-xl shadow-sm border p-5 transition-all group ${isDark ? 'bg-slate-900 border-slate-800 hover:shadow-lg' : 'bg-white border-gray-100 hover:shadow-md'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/hiring?id=${session.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold group-hover:text-red-800 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {session.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(session.status)}`}>
                        {session.status === 'active' && <Circle size={8} className="inline mr-1 fill-current" />}
                        {session.status === 'completed' && <CheckCircle size={12} className="inline mr-1" />}
                        {session.status}
                      </span>
                    </div>
                    {session.description && (
                      <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{session.description}</p>
                    )}
                    <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Created {new Date(session.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === session.id ? null : session.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                    >
                      <MoreVertical size={18} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                    </button>

                    {menuOpen === session.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setMenuOpen(null)}
                        />
                        <div className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-xl border py-2 z-20 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                          <button
                            onClick={() => navigate(`/hiring?id=${session.id}`)}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <Briefcase size={16} />
                            Open Workflow
                          </button>
                          {session.status === 'active' && (
                            <button
                              onClick={() => updateStatus(session.id, 'completed')}
                              className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Mark as Completed
                            </button>
                          )}
                          {session.status === 'completed' && (
                            <button
                              onClick={() => updateStatus(session.id, 'active')}
                              className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                            >
                              <Circle size={16} />
                              Reopen Hiring
                            </button>
                          )}
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </>
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
};

export default HiringsPage;
