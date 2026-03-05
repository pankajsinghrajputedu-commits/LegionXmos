import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, Upload, Sparkles, Loader2, Users, Trophy, 
  ArrowLeft, ArrowRight, Check, ChevronRight, File,
  Edit3, Trash2, Plus, Save, X, Mail, Copy, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quick-unzip-5/artifacts/dfj90ofz_Red_Playful_Gifts_Logo__1_-removebg-preview.png";

const HiringWorkflow = () => {
  const [searchParams] = useSearchParams();
  const hiringId = searchParams.get('id');
  const navigate = useNavigate();
  
  // Step state: 1=JD, 2=Assessment, 3=Candidates, 4=Results
  const [currentStep, setCurrentStep] = useState(1);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Step 1: JD
  const [jdMode, setJdMode] = useState('text');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedJD, setParsedJD] = useState(null);
  
  // Step 2: Assessment
  const [assessment, setAssessment] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generationTimer, setGenerationTimer] = useState(60);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [difficulty, setDifficulty] = useState('moderate');
  const [questionCount, setQuestionCount] = useState(30);
  
  // Step 3: Candidates
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '' });
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [testLink, setTestLink] = useState(null);
  
  // Step 4: Results
  const [scores, setScores] = useState([]);
  const [refreshingScores, setRefreshingScores] = useState(false);

  // Countdown timer during generation
  useEffect(() => {
    let interval;
    if (generating && generationTimer > 0) {
      interval = setInterval(() => {
        setGenerationTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [generating, generationTimer]);

  useEffect(() => {
    if (hiringId) {
      loadSession();
    } else {
      setLoading(false);
    }
  }, [hiringId]);

  const loadSession = async () => {
    try {
      const response = await axios.get(`${API}/hiring-sessions/${hiringId}`, { withCredentials: true });
      setSession(response.data.session);
      
      if (response.data.jd) {
        setParsedJD(response.data.jd);
        setCurrentStep(2);
      }
      
      if (response.data.assessments?.length > 0) {
        setAssessment(response.data.assessments[0]);
        setCurrentStep(3);
        loadCandidates();
        loadScores(response.data.assessments[0].id);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load hiring session');
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await axios.get(`${API}/candidates/${hiringId}`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const loadScores = async (assessmentId) => {
    try {
      const response = await axios.get(`${API}/leaderboard/${assessmentId}`);
      setScores(response.data);
      if (response.data.length > 0) {
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or Image');
        return;
      }
      setFile(selectedFile);
    }
  };

  const parseJD = async () => {
    if (jdMode === 'text' && !description.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    if (jdMode === 'upload' && !file) {
      toast.error('Please upload a file');
      return;
    }

    setUploading(true);
    try {
      let response;
      if (jdMode === 'text') {
        response = await axios.post(`${API}/jd`, { 
          description, 
          hiring_session_id: hiringId 
        });
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hiring_session_id', hiringId);
        response = await axios.post(`${API}/jd/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setParsedJD(response.data);
      setCurrentStep(2);
      toast.success('Job description parsed successfully!');
    } catch (error) {
      console.error('Error parsing JD:', error);
      toast.error(error.response?.data?.detail || 'Failed to parse job description');
    } finally {
      setUploading(false);
    }
  };

  const generateAssessment = async () => {
    if (!parsedJD) return;
    
    setGenerating(true);
    setGenerationTimer(60); // Reset timer to 60 seconds
    try {
      const response = await axios.post(`${API}/assessment/generate`, {
        job_id: parsedJD.id,
        difficulty: difficulty,
        question_count: questionCount
      }, { timeout: 120000 }); // 2 min timeout
      setAssessment(response.data);
      setCurrentStep(3);
      toast.success('Assessment generated successfully!');
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate assessment. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const addCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast.error('Please enter name and email');
      return;
    }

    try {
      const response = await axios.post(`${API}/candidates/${hiringId}`, newCandidate, { withCredentials: true });
      setCandidates([response.data, ...candidates]);
      setNewCandidate({ name: '', email: '' });
      toast.success('Candidate added!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add candidate');
    }
  };

  const sendInvites = async () => {
    if (selectedCandidates.length === 0) {
      toast.error('Please select candidates to invite');
      return;
    }

    if (!assessment || !assessment.id) {
      toast.error('Please generate an assessment first before sending invites');
      return;
    }

    setSendingInvites(true);
    try {
      const response = await axios.post(`${API}/candidates/send-invites`, {
        candidate_ids: selectedCandidates,
        assessment_id: assessment.id
      }, { withCredentials: true });
      
      toast.success(`Invites sent to ${response.data.sent} candidates!`);
      if (response.data.invites?.length > 0) {
        // Show test links for manual sharing
        response.data.invites.forEach(inv => {
          console.log(`Test link for ${inv.email}: ${inv.test_link}`);
        });
      }
      setSelectedCandidates([]);
      loadCandidates();
    } catch (error) {
      console.error('Invite error:', error);
      toast.error(error.response?.data?.detail || 'Failed to send invites');
    } finally {
      setSendingInvites(false);
    }
  };

  const createTestLink = async () => {
    try {
      const response = await axios.post(`${API}/test/link`, {
        assessment_id: assessment.id,
      }, { withCredentials: true });
      setTestLink(response.data);
      toast.success('Test link created!');
    } catch (error) {
      toast.error('Failed to create test link');
    }
  };

  const refreshScores = async () => {
    if (!assessment) return;
    setRefreshingScores(true);
    try {
      const response = await axios.get(`${API}/leaderboard/${assessment.id}`);
      setScores(response.data);
      if (response.data.length > 0) {
        toast.success(`${response.data.length} scored submissions found`);
      } else {
        toast.info('No scored submissions yet');
      }
    } catch (error) {
      console.error('Error refreshing scores:', error);
    } finally {
      setRefreshingScores(false);
    }
  };

  // Auto-refresh scores when on Step 4
  useEffect(() => {
    if (currentStep === 4 && assessment) {
      const interval = setInterval(() => {
        refreshScores();
      }, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [currentStep, assessment]);

  const steps = [
    { num: 1, title: 'Job Description', icon: FileText },
    { num: 2, title: 'Generate Assessment', icon: Sparkles },
    { num: 3, title: 'Invite Candidates', icon: Users },
    { num: 4, title: 'Results & Leaderboard', icon: Trophy },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/hirings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
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

        {session && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{session.name}</h1>
            <p className="text-gray-600">{session.description}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div 
                  className={`flex items-center gap-3 cursor-pointer ${currentStep >= step.num ? 'text-red-800' : 'text-gray-400'}`}
                  onClick={() => step.num <= currentStep && setCurrentStep(step.num)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.num ? 'bg-green-500 text-white' :
                    currentStep === step.num ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? <Check size={20} /> : <step.icon size={20} />}
                  </div>
                  <span className="font-semibold hidden md:block">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className={`${currentStep > step.num ? 'text-green-500' : 'text-gray-300'}`} size={24} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Step 1: Job Description */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Job Description</h2>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setJdMode('text')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    jdMode === 'text' ? 'bg-red-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="inline mr-2" size={18} />
                  Paste Text
                </button>
                <button
                  onClick={() => setJdMode('upload')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    jdMode === 'upload' ? 'bg-red-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="inline mr-2" size={18} />
                  Upload File
                </button>
              </div>

              {jdMode === 'text' ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-gray-900"
                  data-testid="jd-textarea"
                />
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    uploading ? 'border-red-400 bg-red-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400'
                  }`}
                  onClick={() => !uploading && document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={48} className="text-red-600 animate-spin" />
                      <span className="font-semibold text-red-800">Uploading & Parsing...</span>
                      <span className="text-sm text-gray-600">AI is analyzing your document</span>
                    </div>
                  ) : file ? (
                    <div className="flex items-center justify-center gap-3">
                      <File size={24} className="text-green-600" />
                      <span className="font-semibold text-gray-900">{file.name}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">Click to upload PDF, DOC, DOCX, or Image</p>
                      <p className="text-sm text-gray-400 mt-2">Max file size: 10MB</p>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={parseJD}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                data-testid="parse-jd-button"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Parse with AI
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Generate Assessment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Parsed Job Description</h2>
              
              {parsedJD && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Title</span>
                    <p className="font-semibold text-gray-900">{parsedJD.title}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Seniority</span>
                    <p className="font-semibold text-gray-900">{parsedJD.seniority}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Domain</span>
                    <p className="font-semibold text-gray-900">{parsedJD.domain}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Skills</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {parsedJD.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!assessment ? (
                <div className="space-y-6">
                  {/* Assessment Configuration */}
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
                    <h3 className="font-semibold text-gray-900 text-lg">Assessment Configuration</h3>
                    
                    {/* Difficulty Level */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'easy', label: 'Easy', desc: 'Basic concepts & fundamentals' },
                          { value: 'moderate', label: 'Moderate', desc: 'Practical application skills' },
                          { value: 'difficult', label: 'Difficult', desc: 'Advanced problem solving' }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setDifficulty(opt.value)}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                              difficulty === opt.value 
                                ? 'border-red-600 bg-red-50 text-red-800' 
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-xs mt-1 opacity-70">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Question Count Slider */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Number of Questions</label>
                        <span className="text-2xl font-bold text-red-800">{questionCount}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="50"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                        style={{
                          background: `linear-gradient(to right, #991b1b 0%, #991b1b ${((questionCount - 20) / 30) * 100}%, #e5e7eb ${((questionCount - 20) / 30) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>20 questions</span>
                        <span>50 questions</span>
                      </div>
                    </div>

                    {/* Info about assessment */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Assessment includes:</strong> MCQs, Short Answers, Scenarios + Basic HR/Corporate Questions (communication, teamwork, problem-solving)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={generateAssessment}
                    disabled={generating}
                    className="w-full flex flex-col items-center justify-center gap-2 px-6 py-4 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                    data-testid="generate-assessment-button"
                  >
                    {generating ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" size={20} />
                          Generating Assessment...
                        </div>
                        <div className="text-3xl font-bold tabular-nums">
                          {Math.floor(generationTimer / 60)}:{(generationTimer % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs opacity-80">AI is creating {questionCount} questions</div>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Assessment
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Generated Questions ({assessment.questions?.length || 0})</h3>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                    >
                      Continue to Candidates
                      <ArrowRight size={18} />
                    </button>
                  </div>
                  
                  {/* Questions List - All viewable/editable */}
                  <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                    {assessment.questions?.map((q, idx) => (
                      <div key={q.question_id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-7 h-7 rounded-full bg-red-800 text-white text-sm flex items-center justify-center font-semibold">{idx + 1}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                q.type === 'mcq' ? 'bg-blue-100 text-blue-700' :
                                q.type === 'short_answer' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>{q.type.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            
                            {editingQuestion === q.question_id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const updatedQuestions = assessment.questions.map(que => 
                                        que.question_id === q.question_id ? { ...que, text: editedText } : que
                                      );
                                      setAssessment({ ...assessment, questions: updatedQuestions });
                                      setEditingQuestion(null);
                                      toast.success('Question updated');
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                                  >
                                    <Save size={14} className="inline mr-1" /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingQuestion(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-900">{q.text}</p>
                            )}
                            
                            {q.options && q.options.length > 0 && !editingQuestion && (
                              <div className="mt-2 grid grid-cols-2 gap-1">
                                {q.options.map((opt, i) => (
                                  <span key={i} className={`text-sm px-2 py-1 rounded ${
                                    q.expected_answer && opt.toLowerCase().startsWith(q.expected_answer.toLowerCase()[0])
                                      ? 'bg-green-100 text-green-700 font-medium'
                                      : 'text-gray-600'
                                  }`}>{opt}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {editingQuestion !== q.question_id && (
                            <button
                              onClick={() => {
                                setEditingQuestion(q.question_id);
                                setEditedText(q.text);
                              }}
                              className="p-2 text-gray-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Candidates */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Invite Candidates</h2>
              
              {/* Bulk Import Section */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Upload size={18} />
                  Bulk Import Candidates
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a 
                    href={`${API}/candidates/template/download`}
                    download="candidates_template.csv"
                    className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg font-medium hover:bg-green-50 flex items-center gap-2"
                  >
                    <File size={16} />
                    Download Template
                  </a>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="csv-upload"
                      accept=".csv,.xlsx,.xls"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await axios.post(`${API}/candidates/${hiringId}/import`, formData, { withCredentials: true });
                          toast.success(`Imported ${res.data.added} candidates!`);
                          if (res.data.skipped > 0) {
                            toast.info(`${res.data.skipped} duplicates skipped`);
                          }
                          loadCandidates();
                        } catch (error) {
                          toast.error(error.response?.data?.detail || 'Import failed');
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label 
                      htmlFor="csv-upload"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 cursor-pointer flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload CSV/Excel
                    </label>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2">File should have columns: name, email</p>
              </div>

              {/* Add Single Candidate */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
                />
                <button
                  onClick={addCandidate}
                  className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Test Link */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Share Test Link</h3>
                {!testLink ? (
                  <button onClick={createTestLink} className="text-blue-700 hover:text-blue-900 font-semibold">
                    Generate Shareable Link
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/test/${testLink.link_id}`}
                      className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/test/${testLink.link_id}`);
                        toast.success('Link copied!');
                      }}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Candidates List */}
              {candidates.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Candidates ({candidates.length})</h3>
                    {selectedCandidates.length > 0 && (
                      <button
                        onClick={sendInvites}
                        disabled={sendingInvites || !assessment}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!assessment ? 'Generate an assessment first' : `Send invites to ${selectedCandidates.length} candidates`}
                      >
                        {sendingInvites ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                        Send Invites ({selectedCandidates.length})
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(c.id)}
                            onChange={() => setSelectedCandidates(prev =>
                              prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                            )}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{c.name}</p>
                            <p className="text-sm text-gray-600">{c.email}</p>
                          </div>
                        </div>
                        {c.status === 'invited' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Invited</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => { loadScores(assessment.id); setCurrentStep(4); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700"
              >
                View Results
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Results & Leaderboard</h2>
                <button
                  onClick={refreshScores}
                  disabled={refreshingScores}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
                >
                  {refreshingScores ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="rotate-180" />}
                  Refresh Scores
                </button>
              </div>
              
              {scores.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No scored submissions yet.</p>
                  <p className="text-sm text-gray-500">Candidates will appear here after completing and having their tests scored.</p>
                  <button
                    onClick={refreshScores}
                    disabled={refreshingScores}
                    className="mt-4 px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
                  >
                    {refreshingScores ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Checking...
                      </span>
                    ) : (
                      'Check for New Submissions'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">{scores.length} candidate(s) scored</p>
                  {scores.map((score, idx) => (
                    <div key={score.submission_id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{score.candidate_name}</p>
                          <p className="text-sm text-gray-600">{score.candidate_email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-800">{score.percentage?.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">{score.total_score?.toFixed(1)} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringWorkflow;
