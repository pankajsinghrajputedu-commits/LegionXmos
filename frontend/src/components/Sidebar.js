import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Sparkles, TrendingUp, Trophy, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home', testId: 'nav-home' },
    { icon: Briefcase, label: 'Hirings', path: '/hirings', testId: 'nav-hirings' },
    { icon: Sparkles, label: 'Assessments', path: '/assessments', testId: 'nav-assessments' },
    { icon: TrendingUp, label: 'Scoring', path: '/scoring', testId: 'nav-scoring' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', testId: 'nav-leaderboard' },
  ];

  return (
    <>
      {/* Hamburger Menu Button - animates to X */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 left-4 z-[60] p-3 rounded-lg shadow-lg transition-all duration-300",
          isDark 
            ? "bg-slate-800 border border-slate-700 hover:bg-slate-700" 
            : "bg-white border border-gray-200 hover:bg-gray-50"
        )}
        data-testid="sidebar-toggle"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={cn(
            "w-full h-0.5 rounded transition-all duration-300 origin-center",
            isDark ? "bg-white" : "bg-gray-700",
            isOpen && "rotate-45 translate-y-[9px]"
          )} />
          <span className={cn(
            "w-full h-0.5 rounded transition-all duration-300",
            isDark ? "bg-white" : "bg-gray-700",
            isOpen && "opacity-0 scale-0"
          )} />
          <span className={cn(
            "w-full h-0.5 rounded transition-all duration-300 origin-center",
            isDark ? "bg-white" : "bg-gray-700",
            isOpen && "-rotate-45 -translate-y-[9px]"
          )} />
        </div>
      </button>

      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full w-80 z-50 transition-all duration-300 shadow-2xl',
          isDark 
            ? 'bg-slate-900 border-r border-slate-800' 
            : 'bg-white border-r border-gray-200',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Large Logo - with padding for hamburger */}
          <div className={cn(
            "p-6 pt-20 flex justify-center",
            isDark ? "border-b border-slate-800" : "border-b border-gray-200"
          )}>
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-24 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
              data-testid="sidebar-logo"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  data-testid={item.testId}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-red-800 text-white shadow-lg shadow-red-800/30'
                      : isDark 
                        ? 'text-slate-300 hover:bg-slate-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={22} />
                  <span className="text-[15px]">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className={cn("p-4", isDark ? "border-t border-slate-800" : "border-t border-gray-200")}>
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                    isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"
                  )}
                  data-testid="profile-menu-button"
                >
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-11 h-11 rounded-full" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-red-800 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {user.name?.[0] || user.email?.[0]}
                    </div>
                  )}
                  <div className="flex-1 text-left overflow-hidden">
                    <div className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-gray-900")}>{user.name || 'User'}</div>
                    <div className={cn("text-xs truncate", isDark ? "text-slate-400" : "text-gray-500")}>{user.email}</div>
                  </div>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className={cn(
                      "absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl py-2 z-50",
                      isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
                    )}>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                          isDark ? "text-slate-300 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <User size={18} />
                        Your Profile
                      </button>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                          isDark ? "text-slate-300 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <Settings size={18} />
                        Settings
                      </button>
                      <div className={cn("my-2", isDark ? "border-t border-slate-700" : "border-t border-gray-200")} />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        data-testid="logout-button"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className={cn("text-xs text-center mt-4", isDark ? "text-slate-500" : "text-gray-400")}>
              © 2026 LegionX
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
