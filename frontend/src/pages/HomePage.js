import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Cloud, Sun, CloudRain, Wind, Search, Globe, X, Droplets, TrendingUp, TrendingDown, Star, Play, ExternalLink, ChevronLeft, ChevronRight, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

// Modern Weather Widget with fixed dropdown
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

  const getWeatherIcon = (code) => {
    if (code <= 3) return <Sun size={48} className="text-amber-400" />;
    if (code <= 48) return <Cloud size={48} className="text-slate-400" />;
    return <CloudRain size={48} className="text-blue-400" />;
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Cloud size={18} className="text-slate-400" />
          Weather
        </h3>
      </div>
      
      {/* Search with fixed z-index */}
      <div className="relative mb-4" ref={searchRef}>
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-sm"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}>
              <X size={16} className="text-slate-500 hover:text-white" />
            </button>
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg shadow-xl z-50 overflow-hidden border border-slate-700">
            {suggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => selectCity(city)}
                className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm"
              >
                <span className="font-medium text-white">{city.name}</span>
                <span className="text-slate-500">{city.admin1}, {city.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {weather && (
        <div>
          <p className="text-slate-400 text-xs mb-1">{weather.city}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-light text-white">{weather.temp}°C</p>
              <p className="text-slate-500 text-xs mt-1">Feels {weather.feelsLike}°</p>
            </div>
            {getWeatherIcon(weather.code)}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Wind size={14} />
              {weather.windSpeed} km/h
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Droplets size={14} />
              {weather.humidity}%
            </div>
            <div className="text-slate-400 text-xs">
              H:{weather.high}° L:{weather.low}°
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// World Clocks Widget with Add/Remove
const WorldClocksWidget = () => {
  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem('worldClocks');
    return saved ? JSON.parse(saved) : [
      { city: 'New York', offset: -5 },
      { city: 'London', offset: 0 },
      { city: 'Tokyo', offset: 9 },
      { city: 'Dubai', offset: 4 }
    ];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [time, setTime] = useState(new Date());

  const availableCities = [
    { city: 'New York', offset: -5 },
    { city: 'Los Angeles', offset: -8 },
    { city: 'Chicago', offset: -6 },
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
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }, [clocks]);

  const addClock = (cityData) => {
    if (!clocks.find(c => c.city === cityData.city)) {
      setClocks([...clocks, cityData]);
    }
    setShowAdd(false);
  };

  const removeClock = (city) => {
    setClocks(clocks.filter(c => c.city !== city));
  };

  const getCityTime = (offset) => {
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * offset));
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Globe size={18} className="text-slate-400" />
          World Clocks
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
        >
          {showAdd ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 max-h-32 overflow-y-auto bg-slate-800 rounded-lg p-2">
          {availableCities.filter(ac => !clocks.find(c => c.city === ac.city)).map((cityData) => (
            <button
              key={cityData.city}
              onClick={() => addClock(cityData)}
              className="w-full text-left px-2 py-1 text-sm text-slate-300 hover:bg-slate-700 rounded"
            >
              {cityData.city}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {clocks.map((clock) => {
          const cityTime = getCityTime(clock.offset);
          return (
            <div key={clock.city} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-500" />
                <div>
                  <p className="text-white text-sm font-medium">{clock.city}</p>
                  <p className="text-slate-500 text-xs">
                    {cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeClock(clock.city)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Stock Widget
const StockWidget = () => {
  const [stocks, setStocks] = useState([
    { symbol: 'SPY', name: 'S&P 500', price: 502.34, change: 1.24, changePercent: 0.25 },
    { symbol: 'QQQ', name: 'Nasdaq 100', price: 438.67, change: -2.15, changePercent: -0.49 },
    { symbol: 'DIA', name: 'Dow Jones', price: 389.12, change: 0.89, changePercent: 0.23 },
    { symbol: 'IWM', name: 'Russell 2000', price: 198.45, change: 1.56, changePercent: 0.79 },
    { symbol: 'VIX', name: 'Volatility Index', price: 14.23, change: -0.34, changePercent: -2.33 }
  ]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteStocks');
    return saved ? JSON.parse(saved) : ['SPY', 'QQQ'];
  });

  useEffect(() => {
    localStorage.setItem('favoriteStocks', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (symbol) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const randomChange = (Math.random() - 0.5) * 0.5;
        const newPrice = stock.price + randomChange;
        const newChange = stock.change + randomChange;
        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(newChange * 100) / 100,
          changePercent: Math.round((newChange / newPrice) * 10000) / 100
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedStocks = [...stocks].sort((a, b) => {
    const aFav = favorites.includes(a.symbol) ? 0 : 1;
    const bFav = favorites.includes(b.symbol) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-400" />
          Market Indices
        </h3>
        <span className="text-xs text-slate-500">Live</span>
      </div>

      <div className="space-y-3">
        {sortedStocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleFavorite(stock.symbol)}
                className="text-slate-500 hover:text-amber-400"
              >
                <Star 
                  size={16} 
                  className={favorites.includes(stock.symbol) ? 'fill-amber-400 text-amber-400' : ''} 
                />
              </button>
              <div>
                <p className="text-white font-medium text-sm">{stock.symbol}</p>
                <p className="text-slate-500 text-xs">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${stock.price.toFixed(2)}</p>
              <p className={`text-xs flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// News Widget with Tabs
const NewsWidget = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsData = {
    latest: [
      { id: 1, title: "Tech Giants Report Strong Q4 Earnings Amid Economic Uncertainty", source: "Business Today", time: "2 hours ago", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80", content: "Major technology companies have reported better-than-expected quarterly earnings, signaling resilience in the tech sector despite broader economic challenges. Analysts attribute this success to continued digital transformation initiatives across industries." },
      { id: 2, title: "Federal Reserve Signals Potential Rate Adjustments in Coming Months", source: "Financial Times", time: "4 hours ago", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80", content: "The Federal Reserve has indicated that interest rate decisions will be data-dependent, with potential adjustments on the horizon as inflation metrics continue to evolve." },
      { id: 3, title: "AI Revolution: How Automation is Reshaping the Job Market", source: "Reuters", time: "6 hours ago", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80", content: "A new report highlights the transformative impact of artificial intelligence on employment, with both job displacement and creation occurring across various sectors." }
    ],
    corporate: [
      { id: 4, title: "Global Hiring Trends: Remote Work Continues to Dominate 2026", source: "HR Today", time: "3 hours ago", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80", content: "Companies worldwide are embracing permanent remote work policies, with studies showing increased productivity and employee satisfaction." },
      { id: 5, title: "Fortune 500 Companies Increase DEI Investments by 40%", source: "Forbes", time: "5 hours ago", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", content: "Diversity, equity, and inclusion initiatives are receiving unprecedented funding as corporations recognize the business value of diverse workforces." },
      { id: 6, title: "Skills-Based Hiring Outperforms Traditional Resume Screening", source: "Harvard Business Review", time: "8 hours ago", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", content: "Research demonstrates that skills-based assessments lead to better hiring outcomes compared to traditional resume-focused approaches." }
    ],
    business: [
      { id: 7, title: "Cryptocurrency Markets Show Signs of Recovery After Volatile Quarter", source: "Bloomberg", time: "1 hour ago", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80", content: "Digital asset markets are stabilizing following a period of significant volatility, with institutional investors showing renewed interest." },
      { id: 8, title: "Supply Chain Innovations Drive Manufacturing Efficiency", source: "Industry Week", time: "4 hours ago", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", content: "New technologies are revolutionizing supply chain management, reducing costs and improving delivery times across manufacturing sectors." },
      { id: 9, title: "Sustainable Business Practices Now Essential for Market Success", source: "The Economist", time: "7 hours ago", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80", content: "Environmental sustainability has become a key differentiator for businesses, with consumers increasingly favoring eco-conscious brands." }
    ],
    videos: [
      { id: 10, title: "CEO Interview: The Future of Work in 2026 and Beyond", source: "CNBC", time: "30 mins", image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80", isVideo: true, videoUrl: "#" },
      { id: 11, title: "Market Analysis: What Investors Need to Know This Week", source: "Bloomberg TV", time: "15 mins", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80", isVideo: true, videoUrl: "#" },
      { id: 12, title: "Tech Talk: AI Tools Transforming HR Departments", source: "TechCrunch", time: "22 mins", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80", isVideo: true, videoUrl: "#" }
    ]
  };

  const currentNews = newsData[activeTab] || [];

  useEffect(() => {
    if (activeTab !== 'videos') {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % currentNews.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [activeTab, currentNews.length]);

  const tabs = [
    { id: 'latest', label: 'Latest' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'business', label: 'Business' },
    { id: 'videos', label: 'Videos' }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCurrentIndex(0); setSelectedArticle(null); }}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-white bg-slate-800 border-b-2 border-red-600' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedArticle ? (
        <div className="p-5">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Back to news
          </button>
          <img src={selectedArticle.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
          <span className="text-xs text-red-500 font-medium">{selectedArticle.source}</span>
          <h3 className="text-xl font-bold text-white mt-2 mb-3">{selectedArticle.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{selectedArticle.content}</p>
        </div>
      ) : activeTab === 'videos' ? (
        <div className="p-5 space-y-3">
          {currentNews.map((video) => (
            <div
              key={video.id}
              className="flex gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="relative w-32 h-20 flex-shrink-0">
                <img src={video.image} alt="" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg group-hover:bg-black/60 transition-colors">
                  <Play size={24} className="text-white" fill="white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium line-clamp-2">{video.title}</h4>
                <p className="text-slate-500 text-xs mt-1">{video.source} • {video.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative h-[400px]">
          {currentNews.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className={`absolute inset-0 transition-all duration-700 cursor-pointer ${
                idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img src={item.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded mb-2 inline-block">
                  {item.source}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  {item.time}
                  <ExternalLink size={14} />
                </p>
              </div>
            </div>
          ))}
          
          {/* Navigation */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + currentNews.length) % currentNews.length); }}
              className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % currentNews.length); }}
              className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {currentNews.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Hirings Widget
const HiringsWidget = () => {
  const navigate = useNavigate();
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHirings();
  }, []);

  const fetchHirings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/hiring-sessions`, { withCredentials: true });
      setHirings(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching hirings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Hirings</h3>
        <button
          onClick={() => navigate('/hirings')}
          className="text-xs text-slate-400 hover:text-white"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : hirings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm mb-3">No hiring sessions yet</p>
          <button
            onClick={() => navigate('/new-hiring')}
            className="text-red-500 hover:text-red-400 text-sm font-medium"
          >
            Start your first hiring
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {hirings.map((hiring) => (
            <div
              key={hiring.id}
              onClick={() => navigate('/hiring', { state: { sessionId: hiring.id } })}
              className="p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-white text-sm font-medium truncate">{hiring.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(hiring.status)}`}>
                  {hiring.status}
                </span>
              </div>
              {hiring.description && (
                <p className="text-slate-500 text-xs mt-1 truncate">{hiring.description}</p>
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
  const [stats, setStats] = useState({ total_jds: 0, total_assessments: 0, total_candidates: 0, total_scored: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL}
              alt="LegionX" 
              className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.location.reload()}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
              <p className="text-slate-500 text-sm">Your HR Command Center</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/new-hiring')}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-500 transition-all"
            data-testid="new-hiring-button"
          >
            <Plus size={18} />
            Start New Hiring
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Hirings', value: stats.total_jds },
            { label: 'Assessments', value: stats.total_assessments },
            { label: 'Candidates', value: stats.total_candidates },
            { label: 'Scored', value: stats.total_scored }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - News */}
          <div className="lg:col-span-2">
            <NewsWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <HiringsWidget />
            <WeatherWidget />
            <WorldClocksWidget />
          </div>
        </div>

        {/* Stock Widget - Full Width */}
        <StockWidget />
      </div>
    </div>
  );
};

export default HomePage;
