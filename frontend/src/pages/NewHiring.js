import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const NewHiring = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a hiring name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/hiring-sessions`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true }
      );
      
      if (response.data && response.data.id) {
        toast.success('Hiring session created!');
        navigate(`/hiring?id=${response.data.id}`);
      } else {
        toast.error('Failed to create hiring session');
      }
    } catch (error) {
      console.error('Error creating hiring session:', error);
      if (error.response?.status === 401 || error.response?.status === 422) {
        toast.error('Please login first');
        navigate('/login');
      } else {
        const errorMessage = typeof error.response?.data?.detail === 'string' 
          ? error.response.data.detail 
          : 'Failed to create hiring session';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/hirings')}
            className={`flex items-center gap-2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={20} />
            Back to Hirings
          </button>
          <img 
            src={LOGO_URL}
            alt="LegionX" 
            className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/home')}
          />
        </div>

        <div className={`rounded-xl shadow-sm border p-8 transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-white" size={32} />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Start New Hiring</h1>
            <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Create a hiring session to begin your recruitment process</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Hiring Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Senior Software Engineer - Q1 2026"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'border-gray-300 text-gray-900'
                }`}
                data-testid="hiring-name-input"
                required
              />
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Give your hiring session a descriptive name</p>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional: Add details about this hiring..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'border-gray-300 text-gray-900'
                }`}
                data-testid="hiring-description-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="create-hiring-button"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                'Create & Start'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewHiring;
