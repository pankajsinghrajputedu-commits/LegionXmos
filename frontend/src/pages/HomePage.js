import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Cloud, Sun, CloudRain, Wind, Search, Globe, RefreshCw, ChevronLeft, ChevronRight, ExternalLink, MapPin, Droplets, X, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

// Weather Widget with fixed dropdown
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const fetchWeather = async (lat, lon, cityName) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      setWeather({
        city: cityName,
        temp: Math.round(weatherRes.data.current.temperature_2m),
        feelsLike: Math.round(weatherRes.data.current.apparent_temperature),
        humidity: weatherRes.data.current.relative_humidity_2m,
        windSpeed: Math.round(weatherRes.data.current.wind_speed_10m),
        code: weatherRes.data.current.weather_code,
        high: Math.round(weatherRes.data.daily.temperature_2m_max[0]),
        low: Math.round(weatherRes.data.daily.temperature_2m_min[0])
      });
      setShowSuggestions(false);
      setSuggestions([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
      setSuggestions(res.data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectCity = (city) => {
    fetchWeather(city.latitude, city.longitude, `${city.name}, ${city.country}`);
  };

  useEffect(() => {
    fetchWeather(40.7128, -74.006, 'New York, US');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCity(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getWeatherBg = (code) => {
    if (code <= 3) return 'from-orange-400 via-pink-500 to-purple-600';
    if (code <= 48) return 'from-gray-400 via-gray-500 to-gray-600';
    if (code <= 67) return 'from-blue-400 via-blue-500 to-indigo-600';
    return 'from-gray-500 to-gray-700';
  };

  const getWeatherIcon = (code) => {
    if (code <= 3) return <Sun size={64} className="text-yellow-300 drop-shadow-lg" />;
    if (code <= 48) return <Cloud size={64} className="text-white drop-shadow-lg" />;
    return <CloudRain size={64} className="text-blue-200 drop-shadow-lg" />;
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${weather ? getWeatherBg(weather.code) : 'from-blue-500 to-purple-600'} p-6 text-white shadow-2xl`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      
      {/* Search with fixed z-index */}
      <div className="relative z-20" ref={searchRef}>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 mb-6">
          <Search size={20} className="text-white/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search any city worldwide..."
            className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}>
              <X size={18} className="text-white/70 hover:text-white" />
            </button>
          )}
          {loading && <RefreshCw size={18} className="animate-spin" />}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100" style={{ zIndex: 9999 }}>
            {suggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => selectCity(city)}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0"
              >
                <MapPin size={16} className="text-gray-400" />
                <span className="font-medium">{city.name}</span>
                <span className="text-gray-400 text-sm">{city.admin1}, {city.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {weather && (
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm flex items-center gap-1 mb-1">
                <MapPin size={14} />
                {weather.city}
              </p>
              <p className="text-7xl font-light tracking-tight">{weather.temp}°</p>
              <p className="text-white/70 text-sm mt-1">Feels like {weather.feelsLike}°</p>
            </div>
            <div className="text-right">
              {getWeatherIcon(weather.code)}
              <p className="text-sm mt-2">H: {weather.high}° L: {weather.low}°</p>
            </div>
          </div>
          
          <div className="flex gap-6 mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Wind size={18} className="text-white/70" />
              <span className="text-sm">{weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-white/70" />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Auto-rotating News Carousel - BIGGER
const NewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [news] = useState([
    {
      title: "Tech Giants Report Strong Q4 Earnings Amid Economic Uncertainty",
      source: "Business Today",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      category: "Business"
    },
    {
      title: "Global Hiring Trends: Remote Work Continues to Dominate 2026",
      source: "HR Today",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
      category: "HR"
    },
    {
      title: "AI Recruitment Tools See 300% Growth in Enterprise Adoption",
      source: "Tech Crunch",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      category: "Technology"
    },
    {
      title: "Workplace Culture: How Companies Are Adapting to Gen Z Expectations",
      source: "Forbes",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      category: "Culture"
    },
    {
      title: "Skills-Based Hiring Outperforms Traditional Resume Screening",
      source: "Harvard Business Review",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      category: "Hiring"
    },
    {
      title: "Employee Retention Strategies That Actually Work in 2026",
      source: "SHRM",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      category: "Management"
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const goTo = (index) => setCurrentIndex(index);
  const prev = () => setCurrentIndex((currentIndex - 1 + news.length) % news.length);
  const next = () => setCurrentIndex((currentIndex + 1) % news.length);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
      {/* Main News - BIGGER */}
      <div className="relative h-[500px]">
        {news.map((item, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-700 ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <span className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full mb-4 inline-block">
                {item.category}
              </span>
              <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
                {item.title}
              </h3>
              <p className="text-white/70 text-base flex items-center gap-2">
                {item.source}
                <ExternalLink size={16} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={28} className="text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={28} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {news.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Analog Clock Component
const AnalogClock = ({ city, offset, onRemove, isDark }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
  const cityTime = new Date(utc + (3600000 * offset));
  
  const seconds = cityTime.getSeconds();
  const minutes = cityTime.getMinutes();
  const hours = cityTime.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="flex flex-col items-center group relative">
      {onRemove && (
        <button
          onClick={() => onRemove(city)}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <X size={12} />
        </button>
      )}
      <div className={`relative w-20 h-20 rounded-full border-2 shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 h-1.5 rounded ${isDark ? 'bg-slate-500' : 'bg-gray-400'}`}
            style={{
              top: '6px',
              left: '50%',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              transformOrigin: '50% 34px'
            }}
          />
        ))}
        <div
          className={`absolute w-1 h-5 rounded-full origin-bottom ${isDark ? 'bg-white' : 'bg-gray-800'}`}
          style={{ bottom: '50%', left: '50%', transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />
        <div
          className={`absolute w-0.5 h-7 rounded-full origin-bottom ${isDark ? 'bg-slate-300' : 'bg-gray-600'}`}
          style={{ bottom: '50%', left: '50%', transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        />
        <div
          className="absolute w-0.5 h-8 bg-red-600 rounded-full origin-bottom"
          style={{ bottom: '50%', left: '50%', transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        />
        <div className="absolute w-2 h-2 bg-red-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className={`mt-2 text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{city}</p>
      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  );
};

// Hirings Widget
const HiringsWidget = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHirings();
  }, []);

  const fetchHirings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/hiring-sessions`, { withCredentials: true });
      setHirings(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching hirings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700';
      case 'completed': return isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700';
      default: return isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-500 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Hirings</h3>
        <button
          onClick={() => navigate('/hirings')}
          className="text-sm text-red-800 hover:text-red-600 font-medium"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-14 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
          ))}
        </div>
      ) : hirings.length === 0 ? (
        <div className="text-center py-6">
          <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No hiring sessions yet</p>
          <button
            onClick={() => navigate('/new-hiring')}
            className="text-red-800 hover:text-red-600 text-sm font-medium"
          >
            Start your first hiring
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {hirings.map((hiring) => (
            <div
              key={hiring.id}
              data-testid={`hiring-item-${hiring.id}`}
              onClick={() => navigate(`/hiring?id=${hiring.id}`)}
              className={`p-3 rounded-xl transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-slate-800/50 hover:bg-slate-800 border-transparent hover:border-red-800/50' 
                  : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium truncate flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{hiring.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ml-2 ${getStatusColor(hiring.status)}`}>
                  {hiring.status}
                </span>
              </div>
              {hiring.description && (
                <p className={`text-xs mt-1 truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{hiring.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ total_jds: 0, total_assessments: 0, total_candidates: 0, total_scored: 0 });
  const [worldClocks, setWorldClocks] = useState(() => {
    const saved = localStorage.getItem('worldClocks');
    return saved ? JSON.parse(saved) : [
      { city: 'New York', offset: -5 },
      { city: 'London', offset: 0 },
      { city: 'Tokyo', offset: 9 },
      { city: 'Dubai', offset: 4 }
    ];
  });
  const [showAddClock, setShowAddClock] = useState(false);

  const availableCities = [
    { city: 'New York', offset: -5 },
    { city: 'Los Angeles', offset: -8 },
    { city: 'Chicago', offset: -6 },
    { city: 'Toronto', offset: -5 },
    { city: 'London', offset: 0 },
    { city: 'Paris', offset: 1 },
    { city: 'Berlin', offset: 1 },
    { city: 'Moscow', offset: 3 },
    { city: 'Dubai', offset: 4 },
    { city: 'Mumbai', offset: 5.5 },
    { city: 'Singapore', offset: 8 },
    { city: 'Hong Kong', offset: 8 },
    { city: 'Tokyo', offset: 9 },
    { city: 'Sydney', offset: 11 },
    { city: 'Auckland', offset: 13 }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(worldClocks));
  }, [worldClocks]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addClock = (cityData) => {
    if (!worldClocks.find(c => c.city === cityData.city) && worldClocks.length < 6) {
      setWorldClocks([...worldClocks, cityData]);
    }
    setShowAddClock(false);
  };

  const removeClock = (city) => {
    setWorldClocks(worldClocks.filter(c => c.city !== city));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/home')}
            />
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back!</h1>
              <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Your HR Command Center</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/new-hiring')}
            className="flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
            data-testid="new-hiring-button"
          >
            <Plus size={20} />
            Start New Hiring
          </button>
        </div>

        {/* Quick Stats - Uniform design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Hirings', value: stats.total_jds },
            { label: 'Assessments', value: stats.total_assessments },
            { label: 'Candidates', value: stats.total_candidates },
            { label: 'Scored', value: stats.total_scored }
          ].map((stat, idx) => (
            <div key={idx} className={`rounded-2xl p-5 shadow-lg transition-colors duration-500 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
              <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* News Section - BIGGER */}
          <div className="lg:col-span-2">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Corporate & HR News</h2>
            <NewsCarousel />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeatherWidget />
            
            {/* Hirings Widget */}
            <HiringsWidget />
            
            {/* World Clocks with Add/Remove */}
            <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-500 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Globe size={20} className="text-red-800" />
                  World Clocks
                </h3>
                <button
                  onClick={() => setShowAddClock(!showAddClock)}
                  className="text-sm text-red-800 hover:text-red-600 font-medium"
                >
                  {showAddClock ? 'Cancel' : '+ Add'}
                </button>
              </div>
              
              {showAddClock && (
                <div className={`mb-4 max-h-40 overflow-y-auto rounded-xl p-2 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  {availableCities.filter(ac => !worldClocks.find(c => c.city === ac.city)).map((cityData) => (
                    <button
                      key={cityData.city}
                      onClick={() => addClock(cityData)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {cityData.city}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {worldClocks.map((clock) => (
                  <AnalogClock 
                    key={clock.city} 
                    city={clock.city} 
                    offset={clock.offset}
                    onRemove={worldClocks.length > 1 ? removeClock : null}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
