import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FileText, Upload, Sparkles, Loader2, File, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const JDInput = () => {
  const [searchParams] = useSearchParams();
  const existingHiringId = searchParams.get('hiring');
  const [mode, setMode] = useState('text');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingAssessment, setGeneratingAssessment] = useState(false);
  const [parsedJD, setParsedJD] = useState(null);
  const [hiringName, setHiringName] = useState('');
  const [hiringSessionId, setHiringSessionId] = useState(existingHiringId || null);
  const navigate = useNavigate();

  useEffect(() => {
    // If we have an existing hiring session, load its details
    if (existingHiringId) {
      loadHiringSession(existingHiringId);
    }
  }, [existingHiringId]);

  const loadHiringSession = async (id) => {
    try {
      const response = await axios.get(`${API}/hiring-sessions/${id}`, { withCredentials: true });
      setHiringName(response.data.session.name);
      setHiringSessionId(id);
    } catch (error) {
      console.error('Error loading hiring session:', error);
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
    if (mode === 'text' && !description.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    if (mode === 'upload' && !file) {
      toast.error('Please upload a file');
      return;
    }
    if (!hiringName.trim() && !hiringSessionId) {
      toast.error('Please enter a hiring name');
      return;
    }

    setLoading(true);
    try {
      let hiringId = hiringSessionId;
      
      // Create hiring session only if we don't have one
      if (!hiringId) {
        const hiringRes = await axios.post(
          `${API}/hiring-sessions?name=${encodeURIComponent(hiringName)}`,
          {},
          { withCredentials: true }
        );
        hiringId = hiringRes.data.id;
        setHiringSessionId(hiringId);
      }

      let response;
      if (mode === 'text') {
        response = await axios.post(`${API}/jd`, { description, hiring_session_id: hiringId });
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hiring_session_id', hiringId);
        response = await axios.post(`${API}/jd/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setParsedJD({ ...response.data, hiring_session_id: hiringId });
      toast.success('Job description parsed successfully!');
    } catch (error) {
      console.error('Error parsing JD:', error);
      toast.error(error.response?.data?.detail || 'Failed to parse job description');
    } finally {
      setLoading(false);
    }
  };

  const generateAssessment = async () => {
    setGeneratingAssessment(true);
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${API}/assessment/generate`, {
        job_id: parsedJD.id,
      });
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsed);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      toast.success(`Assessment generated in ${Math.ceil(elapsed / 1000)}s!`);
      navigate(`/assessments?id=${response.data.id}&hiring=${parsedJD.hiring_session_id}`);
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error('Failed to generate assessment');
    } finally {
      setGeneratingAssessment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Job Description</h1>
          <p className="text-gray-600">Paste text or upload a file to start a new hiring process</p>
        </div>

        {/* Hiring Name */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Hiring Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={hiringName}
              onChange={(e) => setHiringName(e.target.value)}
              placeholder="e.g., Senior Marketing Manager - Jan 2026"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 ${
                existingHiringId ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              data-testid="hiring-name-input"
              disabled={!!existingHiringId}
            />
            {existingHiringId && (
              <p className="text-sm text-gray-500">Using existing hiring session</p>
            )}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4">
          <button
            onClick={() => setMode('text')}
            data-testid="mode-text-button"
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              mode === 'text'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
            }`}
          >
            <FileText className="inline mr-2" size={20} />
            Paste Text
          </button>
          <button
            onClick={() => setMode('upload')}
            data-testid="mode-upload-button"
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
            }`}
          >
            <Upload className="inline mr-2" size={20} />
            Upload File
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {mode === 'text' ? (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Job Description</label>
              <textarea
                data-testid="jd-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-64 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all resize-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Upload File (PDF, DOC, DOCX, Image)</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  id="file-upload"
                  data-testid="file-input"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full p-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all text-center"
                >
                  {file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-red-800">
                        {file.type.includes('image') ? <ImageIcon size={32} /> : <File size={32} />}
                      </div>
                      <div className="text-gray-900 font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload size={48} className="mx-auto text-gray-400" />
                      <div className="text-gray-900 font-medium">Click to upload or drag and drop</div>
                      <div className="text-sm text-gray-500">PDF, DOC, DOCX, PNG, JPG (Max 10MB)</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          <button
            data-testid="parse-jd-button"
            onClick={parseJD}
            disabled={loading || (mode === 'text' && !description.trim()) || (mode === 'upload' && !file) || !hiringName.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-800 px-8 py-4 text-white font-semibold shadow-md hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-animate"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
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

        {parsedJD && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Parsed Details</h2>
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                ✓ Ready
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">Title</div>
                <div className="text-lg font-semibold text-gray-900" data-testid="parsed-title">{parsedJD.title}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">Seniority</div>
                <div className="text-lg font-semibold text-gray-900">{parsedJD.seniority}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">Domain</div>
                <div className="text-lg font-semibold text-gray-900">{parsedJD.domain}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">Role</div>
                <div className="text-lg font-semibold text-gray-900">{parsedJD.role}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase">Required Skills</div>
              <div className="flex flex-wrap gap-2">
                {parsedJD.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-red-50 text-red-800 text-sm font-medium border border-red-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              data-testid="generate-assessment-button"
              onClick={generateAssessment}
              disabled={generatingAssessment}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-800 to-red-700 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 btn-animate"
            >
              {generatingAssessment ? (
                <>
                  <div className="flex items-center gap-3">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Generating 50 Questions...</span>
                    <span className="text-sm opacity-80">(~10-15s)</span>
                  </div>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Assessment (50 Questions)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDInput;
