import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Link as LinkIcon, Copy, Check, Loader2, Edit3, Trash2, Plus, Save, X, Users, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Assessments = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('id');
  const hiringSessionId = searchParams.get('hiring');
  const [assessment, setAssessment] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [testLink, setTestLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedOptions, setEditedOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const navigate = useNavigate();

  // Candidate management state
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '' });
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [sendingInvites, setSendingInvites] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      loadAssessment();
    } else {
      loadAllAssessments();
    }
    if (hiringSessionId) {
      loadCandidates();
    }
  }, [assessmentId, hiringSessionId]);

  const loadAllAssessments = async () => {
    try {
      const response = await axios.get(`${API}/assessments`);
      setAllAssessments(response.data);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssessment = async () => {
    try {
      const response = await axios.get(`${API}/assessment/${assessmentId}`);
      setAssessment(response.data);
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast.error('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await axios.get(`${API}/candidates/${hiringSessionId}`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const createTestLink = async () => {
    try {
      const response = await axios.post(`${API}/test/link`, {
        assessment_id: assessmentId,
      });
      setTestLink(response.data);
      toast.success('Test link created!');
    } catch (error) {
      console.error('Error creating test link:', error);
      toast.error('Failed to create test link');
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/test/${testLink.link_id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const startEditing = (question) => {
    setEditingQuestion(question.question_id);
    setEditedText(question.text);
    setEditedOptions(question.options || []);
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
    setEditedText('');
    setEditedOptions([]);
  };

  const saveQuestion = async (questionId) => {
    setSaving(true);
    const updatedQuestions = assessment.questions.map(q => {
      if (q.question_id === questionId) {
        return {
          ...q,
          text: editedText,
          options: editedOptions.length > 0 ? editedOptions : q.options
        };
      }
      return q;
    });

    try {
      await axios.put(`${API}/assessment/${assessmentId}/questions`, updatedQuestions);
      setAssessment({ ...assessment, questions: updatedQuestions });
      cancelEditing();
      toast.success('Question updated!');
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    const updatedQuestions = assessment.questions.filter(q => q.question_id !== questionId);
    
    try {
      await axios.put(`${API}/assessment/${assessmentId}/questions`, updatedQuestions);
      setAssessment({ ...assessment, questions: updatedQuestions });
      toast.success('Question deleted!');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const addCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast.error('Please enter name and email');
      return;
    }

    try {
      const response = await axios.post(`${API}/candidates/${hiringSessionId}`, newCandidate);
      setCandidates([response.data, ...candidates]);
      setNewCandidate({ name: '', email: '' });
      toast.success('Candidate added!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error(error.response?.data?.detail || 'Failed to add candidate');
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await axios.delete(`${API}/candidates/${candidateId}`);
      setCandidates(candidates.filter(c => c.id !== candidateId));
      toast.success('Candidate removed');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to remove candidate');
    }
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c.id));
    }
  };

  const sendInvites = async () => {
    if (selectedCandidates.length === 0) {
      toast.error('Please select candidates to invite');
      return;
    }

    setSendingInvites(true);
    try {
      const response = await axios.post(`${API}/candidates/send-invites`, {
        candidate_ids: selectedCandidates,
        assessment_id: assessmentId
      });
      
      toast.success(`Invites sent to ${response.data.sent} candidates!`);
      setSelectedCandidates([]);
      loadCandidates();
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invites');
    } finally {
      setSendingInvites(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-800" size={48} />
      </div>
    );
  }

  // Show all assessments list when no specific ID
  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Assessments</h1>
            <p className="text-gray-600">{allAssessments.length} assessments created</p>
          </div>

          {allAssessments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Sparkles size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Assessments Yet</h2>
              <p className="text-gray-600 mb-6">Create your first assessment by uploading a job description</p>
              <button
                onClick={() => navigate('/jd-input')}
                className="px-6 py-3 rounded-lg bg-red-800 text-white font-semibold hover:bg-red-700 btn-animate"
              >
                Create Assessment
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {allAssessments.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/assessments?id=${a.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-red-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{a.job_title || 'Untitled Assessment'}</h3>
                      <p className="text-sm text-gray-600">{a.questions?.length || 0} questions</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {a.generated_at ? new Date(a.generated_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Assessment Not Found</h1>
          <button
            onClick={() => navigate('/assessments')}
            className="px-6 py-3 rounded-lg bg-red-800 text-white font-semibold hover:bg-red-700 btn-animate"
          >
            View All Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment: {assessment.job_title}</h1>
          <p className="text-gray-600">{assessment.questions.length} questions generated</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'questions'
                ? 'border-red-800 text-red-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            data-testid="tab-questions"
          >
            <Sparkles size={18} className="inline mr-2" />
            Questions ({assessment.questions.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'candidates'
                ? 'border-red-800 text-red-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            data-testid="tab-candidates"
          >
            <Users size={18} className="inline mr-2" />
            Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'share'
                ? 'border-red-800 text-red-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            data-testid="tab-share"
          >
            <LinkIcon size={18} className="inline mr-2" />
            Share Link
          </button>
        </div>

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Review & Edit Questions</h2>
              <span className="text-sm text-gray-500">Click edit to modify any question</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {assessment.questions.map((q, idx) => (
                <div key={q.question_id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-700">
                        {q.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {editingQuestion === q.question_id ? (
                        <>
                          <button
                            onClick={() => saveQuestion(q.question_id)}
                            disabled={saving}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                            data-testid={`save-question-${idx}`}
                          >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(q)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                            data-testid={`edit-question-${idx}`}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteQuestion(q.question_id)}
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                            data-testid={`delete-question-${idx}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingQuestion === q.question_id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 resize-none"
                        rows={3}
                      />
                      {q.options && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Options:</label>
                          {editedOptions.map((opt, optIdx) => (
                            <input
                              key={optIdx}
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...editedOptions];
                                newOptions[optIdx] = e.target.value;
                                setEditedOptions(newOptions);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-900 font-medium">{q.text}</p>
                      {q.options && (
                        <div className="space-y-2 pl-11">
                          {q.options.map((option, optIdx) => (
                            <div key={optIdx} className="px-3 py-2 rounded bg-white border border-gray-200 text-sm text-gray-700">
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Add Candidate Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Candidate</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
                  data-testid="candidate-name-input"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900"
                  data-testid="candidate-email-input"
                />
                <button
                  onClick={addCandidate}
                  className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-700 btn-animate flex items-center gap-2"
                  data-testid="add-candidate-button"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </div>

            {/* Candidates List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Candidates ({candidates.length})</h3>
                {candidates.length > 0 && (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                        onChange={selectAllCandidates}
                        className="w-4 h-4 text-red-800 rounded"
                      />
                      Select All
                    </label>
                    <button
                      onClick={sendInvites}
                      disabled={selectedCandidates.length === 0 || sendingInvites}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      data-testid="send-invites-button"
                    >
                      {sendingInvites ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail size={18} />
                          Send Invites ({selectedCandidates.length})
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {candidates.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No candidates added yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => toggleCandidateSelection(candidate.id)}
                          className="w-4 h-4 text-red-800 rounded"
                        />
                        <div className="w-10 h-10 rounded-full bg-red-800 text-white flex items-center justify-center font-semibold">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-600">{candidate.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {candidate.invite_sent_at && (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Invited
                          </span>
                        )}
                        {candidate.test_link_id && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/test/${candidate.test_link_id}`);
                              toast.success('Link copied!');
                            }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                            title="Copy test link"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteCandidate(candidate.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LinkIcon size={24} />
              Share Test Link
            </h2>

            <p className="text-gray-600">
              Generate a shareable link that candidates can use to take this assessment without logging in.
            </p>

            {!testLink ? (
              <button
                data-testid="create-test-link-button"
                onClick={createTestLink}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-800 px-8 py-4 font-semibold text-white shadow-md hover:bg-red-700 btn-animate"
              >
                <Sparkles size={20} />
                Generate Shareable Link
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex-1 font-mono text-sm text-green-700 break-all" data-testid="test-link">
                    {window.location.origin}/test/{testLink.link_id}
                  </div>
                  <button
                    data-testid="copy-link-button"
                    onClick={copyLink}
                    className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Share this link with candidates. They can take the test without logging in.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
