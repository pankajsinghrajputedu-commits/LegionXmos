import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Plus, Loader2, Clock, CheckCircle, Circle, MoreVertical, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const HiringsPage = () => {
  const navigate = useNavigate();
  const [hiringSessions, setHiringSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
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
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleLogoClick = () => {
    window.location.reload();
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hirings</h1>
              <p className="text-gray-600">Manage all your hiring sessions</p>
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
        <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
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
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Hirings List */}
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hirings found</h3>
            <p className="text-gray-600 mb-6">
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
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/hiring?id=${session.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
                        {session.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(session.status)}`}>
                        {session.status === 'active' && <Circle size={8} className="inline mr-1 fill-current" />}
                        {session.status === 'completed' && <CheckCircle size={12} className="inline mr-1" />}
                        {session.status}
                      </span>
                    </div>
                    {session.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>

                    {menuOpen === session.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setMenuOpen(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                          <button
                            onClick={() => navigate(`/hiring?id=${session.id}`)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
