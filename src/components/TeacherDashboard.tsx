import { useState } from 'react';
import { 
  Tv, Video, Trash2, Edit, Check, FileText, 
  Sparkles, DollarSign, TrendingUp, BarChart2, CreditCard, Send, RefreshCw
} from 'lucide-react';

interface RecordedLesson {
  id: string;
  title: string;
  course: string;
  instructor: string;
  duration: string;
  totalTimeSeconds: number;
  uploadedDate: string;
  views: string;
  description: string;
  materials: { name: string; size: string }[];
}

interface TeacherDashboardProps {
  instructorName: string;
  recordedLessons: RecordedLesson[];
  onUploadRecording: (lesson: RecordedLesson) => void;
  onUpdateRecording: (lesson: RecordedLesson) => void;
  onDeleteRecording: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

interface GeneratedQuizItem {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

export default function TeacherDashboard({
  instructorName,
  recordedLessons,
  onUploadRecording,
  onUpdateRecording,
  onDeleteRecording,
  setActiveTab
}: TeacherDashboardProps) {
  
  // Dashboard Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'quiz' | 'analytics' | 'payouts'>('stream');

  // Lecture Creation Form States
  const [liveTitle, setLiveTitle] = useState('Topic Markers: Master the Difference Between は (wa) and が (ga)');
  const [liveCourse, setLiveCourse] = useState('JLPT N5 Masterclass');
  
  // Upload Recording Form States
  const [recTitle, setRecTitle] = useState('');
  const [recCourse, setRecCourse] = useState('JLPT N5 Masterclass');
  const [recDuration, setRecDuration] = useState('02:10');
  const [recDescription, setRecDescription] = useState('');
  const [recAttachment, setRecAttachment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Editing Recording States
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // AI Quiz Generator States
  const [quizTopic, setQuizTopic] = useState('Business Japanese Keigo Honorifics (Sonkeigo vs Kenjougo)');
  const [quizDifficulty, setQuizDifficulty] = useState('Intermediate');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuizItem[]>([
    {
      id: 1,
      question: 'Which verb is the humble (Kenjougo) form used when speaking about your own action of eating or drinking?',
      options: [
        { key: 'A', text: '召し上がる (Meshiagaru)' },
        { key: 'B', text: 'いただく (Itadaku)' },
        { key: 'C', text: '食べます (Tabemasu)' }
      ],
      correctKey: 'B',
      explanation: 'いただく is the humble verb used for oneself when addressing senior clients or bosses.'
    },
    {
      id: 2,
      question: 'When addressing a corporate client on the phone, which phrase expresses "I called you"?',
      options: [
        { key: 'A', text: '本日お電話を差し上げました (Kenjougo)' },
        { key: 'B', text: '電話をかけました (Polite standard)' },
        { key: 'C', text: '電話をいただいた (Received call)' }
      ],
      correctKey: 'A',
      explanation: 'お電話を差し上げる is the respectful humble expression for making a phone call.'
    }
  ]);

  // Course Options
  const courseOptions = [
    'JLPT N5 Masterclass',
    'JLPT N4 Accelerator',
    'Business Japanese Etiquette',
    'Digital Marketing & Strategy',
    'Career Certifications Training'
  ];

  const handleGenerateAiQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;

    setIsGeneratingQuiz(true);
    setTimeout(() => {
      setGeneratedQuiz([
        {
          id: Date.now(),
          question: `AI Question on ${quizTopic}: What is the primary linguistic function of Kenjougo?`,
          options: [
            { key: 'A', text: 'Elevating the action of the listener/customer' },
            { key: 'B', text: 'Humbling the speaker\'s action to show respect' },
            { key: 'C', text: 'Informal friendly conversation between peers' }
          ],
          correctKey: 'B',
          explanation: 'Kenjougo lowers the speaker\'s action relative to the listener.'
        },
        {
          id: Date.now() + 1,
          question: `Practice Exercise: Identify the correct respectful form for 行く (to go).`,
          options: [
            { key: 'A', text: 'いらっしゃる (Irassharu)' },
            { key: 'B', text: '参る (Mairu)' },
            { key: 'C', text: '行きます (Ikimasu)' }
          ],
          correctKey: 'A',
          explanation: 'いらっしゃる is Sonkeigo (respectful) for go/come/be.'
        }
      ]);
      setIsGeneratingQuiz(false);
    }, 1200);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recDescription.trim()) {
      alert('Please fill out the recording title and description.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      const parts = recDuration.split(':');
      const min = parseInt(parts[0]) || 0;
      const sec = parseInt(parts[1]) || 0;
      const totalSecs = min * 60 + sec;

      const newLesson: RecordedLesson = {
        id: 'rec-' + Date.now(),
        title: recTitle,
        course: recCourse,
        instructor: instructorName,
        duration: recDuration,
        totalTimeSeconds: totalSecs || 120,
        uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        views: '0 views',
        description: recDescription,
        materials: recAttachment ? [{ name: recAttachment, size: '1.5 MB' }] : []
      };

      onUploadRecording(newLesson);
      setIsUploading(false);
      setUploadSuccess(true);
      
      setRecTitle('');
      setRecDescription('');
      setRecAttachment('');
    }, 800);
  };

  const handleStartEditing = (lesson: RecordedLesson) => {
    setEditingLessonId(lesson.id);
    setEditTitle(lesson.title);
    setEditDescription(lesson.description);
  };

  const handleSaveEdit = (lesson: RecordedLesson) => {
    if (!editTitle.trim()) return;
    onUpdateRecording({
      ...lesson,
      title: editTitle,
      description: editDescription
    });
    setEditingLessonId(null);
  };

  const handleStartLiveBroadcast = () => {
    localStorage.setItem('skillnara_live_class_active', 'true');
    localStorage.setItem('skillnara_active_live_title', liveTitle);
    localStorage.setItem('skillnara_active_live_course', liveCourse);
    setActiveTab('live');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(255, 144, 0, 0.15) 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span className="gradient-text" style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instructor Workspace
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Welcome back, {instructorName}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage live broadcasts, generate AI quizzes, inspect attendance heatmaps, and track earnings.
          </p>
        </div>

        <button
          onClick={handleStartLiveBroadcast}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.8rem', borderRadius: '30px', gap: '0.5rem', fontSize: '0.95rem', boxShadow: 'var(--primary-glow) 0 8px 25px' }}
        >
          <Tv size={18} />
          <span>Launch Live Broadcast Now</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('stream')}
          className={`btn ${activeSubTab === 'stream' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '25px', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Video size={16} />
          <span>Broadcast & Recordings</span>
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`btn ${activeSubTab === 'quiz' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '25px', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Sparkles size={16} />
          <span>Automated AI Quiz Generator</span>
        </button>
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`btn ${activeSubTab === 'analytics' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '25px', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <BarChart2 size={16} />
          <span>Attendance Heatmaps</span>
        </button>
        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`btn ${activeSubTab === 'payouts' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '25px', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <DollarSign size={16} />
          <span>Earnings & Payout Portal</span>
        </button>
      </div>

      {/* SUB-TAB 1: BROADCAST & RECORDINGS */}
      {activeSubTab === 'stream' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="teacher-grid">
          
          {/* Left Column: Launch Broadcast & Upload Recording */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Launch Live Broadcast Card */}
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Tv size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Start Live Lecture</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Broadcast live video, screen share, and interactive whiteboard to enrolled students</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Course Assignment</label>
                  <select
                    value={liveCourse}
                    onChange={(e) => setLiveCourse(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Lecture Title</label>
                  <input
                    type="text"
                    value={liveTitle}
                    onChange={(e) => setLiveTitle(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  onClick={handleStartLiveBroadcast}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', borderRadius: '25px', gap: '0.5rem', justifyContent: 'center' }}
                >
                  <Video size={16} />
                  <span>Start Live Broadcast Now</span>
                </button>
              </div>
            </div>

            {/* Upload Recorded Lecture Card */}
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upload Pre-Recorded Lesson</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publish video files & attachments directly to the Recorded Archive</p>
                </div>
              </div>

              {uploadSuccess && (
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-mint)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <Check size={16} />
                  <span>Lesson successfully uploaded and published to archive!</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Course Category</label>
                  <select
                    value={recCourse}
                    onChange={(e) => setRecCourse(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Lesson Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Lesson 6: Keigo Polite Honorific Speech"
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Duration (MM:SS)</label>
                    <input
                      type="text"
                      placeholder="02:15"
                      value={recDuration}
                      onChange={(e) => setRecDuration(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>PDF Attachment</label>
                    <input
                      type="text"
                      placeholder="e.g., Keigo_Cheatsheet.pdf"
                      value={recAttachment}
                      onChange={(e) => setRecAttachment(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Lesson Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a brief summary of what students will learn..."
                    value={recDescription}
                    onChange={(e) => setRecDescription(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-secondary"
                  style={{ width: '100%', borderRadius: '25px', justifyContent: 'center' }}
                >
                  {isUploading ? 'Uploading Video...' : 'Publish to Recorded Archive'}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Manage Published Lessons */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Published Archive ({recordedLessons.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '680px', overflowY: 'auto' }}>
              {recordedLessons.map(lesson => {
                const isEditing = editingLessonId === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.85rem' }}
                        />
                        <textarea
                          rows={2}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.8rem', resize: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingLessonId(null)} className="btn btn-ghost btn-sm" style={{ borderRadius: '15px' }}>Cancel</button>
                          <button onClick={() => handleSaveEdit(lesson)} className="btn btn-primary btn-sm" style={{ borderRadius: '15px' }}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)' }}>{lesson.course}</span>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.1rem' }}>{lesson.title}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button
                              onClick={() => handleStartEditing(lesson)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => onDeleteRecording(lesson.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {lesson.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Views: {lesson.views}</span>
                          <span>Duration: {lesson.duration}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: AUTOMATED AI QUIZ GENERATOR */}
      {activeSubTab === 'quiz' && (
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '2rem' }} className="teacher-grid">
          
          {/* AI Generator Form */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: 'var(--accent-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Quiz Generator</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-create multiple choice quizzes from lesson topics</p>
              </div>
            </div>

            <form onSubmit={handleGenerateAiQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Quiz Topic / Key Concepts</label>
                <textarea
                  rows={3}
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g. Sonkeigo vs Kenjougo honorific verb structures..."
                  className="form-input"
                  style={{ fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Difficulty Level</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="Beginner">Beginner (JLPT N5)</option>
                  <option value="Intermediate">Intermediate (JLPT N4 / Keigo)</option>
                  <option value="Advanced">Advanced (Business Corporate)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingQuiz}
                className="btn btn-primary"
                style={{ width: '100%', borderRadius: '25px', gap: '0.5rem', justifyContent: 'center' }}
              >
                {isGeneratingQuiz ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>SkillBot AI is Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate AI Quiz Questions</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Quiz Preview */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Generated Quiz Questions ({generatedQuiz.length})</h3>
              <button
                onClick={() => alert('Quiz questions pushed to live classroom poll system!')}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '15px', gap: '0.3rem' }}
              >
                <Send size={13} />
                <span>Push to Live Class Polls</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {generatedQuiz.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px',
                    backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Question {idx + 1}</span>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q.question}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {q.options.map(opt => (
                      <div
                        key={opt.key}
                        style={{
                          padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                          backgroundColor: opt.key === q.correctKey ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                          border: opt.key === q.correctKey ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                          color: opt.key === q.correctKey ? 'var(--accent-mint)' : 'var(--text-primary)',
                          fontWeight: opt.key === q.correctKey ? 700 : 400
                        }}
                      >
                        {opt.key}. {opt.text} {opt.key === q.correctKey && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    💡 <strong>Explanation</strong>: {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: ATTENDANCE HEATMAPS */}
      {activeSubTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="grid-4">
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peak Stream Attendance</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>243 Students</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)' }}>↑ +18% vs last week</span>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Completion Rate</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.2rem' }}>92.4%</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)' }}>High engagement</span>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Live Hand Raises</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>58 Questions</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active participation</span>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chat Messages Sent</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-mint)', marginTop: '0.2rem' }}>1,280 msgs</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)' }}>↑ High chat interaction</span>
            </div>
          </div>

          {/* Attendance & Drop-off Heatmap Graph */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>60-Minute Live Attendance Heatmap</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Minute-by-minute audience retention for "Business Japanese: Keigo Masterclass"</p>
            </div>

            {/* Visual Heatmap Bars */}
            <div style={{ display: 'flex', height: '160px', alignItems: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              {[95, 98, 100, 97, 94, 96, 99, 92, 95, 91, 88, 85].map((val, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${val}%`,
                      backgroundColor: val > 90 ? 'var(--primary)' : 'var(--secondary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`Minute ${(idx + 1) * 5}: ${val}% retention`}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{(idx + 1) * 5}m</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>0m: Class Started (230 joined)</span>
              <span>30m: Live Whiteboard Practice (243 peak)</span>
              <span>60m: Call Concluded (210 present)</span>
            </div>
          </div>

          {/* Registered Users Roster & Registration Analytics */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registered Learners & User Analytics</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time user registration tracking across Skillnara platform</p>
              </div>
              <span style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.35rem 0.85rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
                Total Registered: 5,420 Users
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Learner Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Account Role</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Registration Date</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Welcome Email</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...(JSON.parse(localStorage.getItem('skillnara_registered_users') || '[]')),
                    { name: 'Student Nara (You)', email: 'student.nara@skillnara.edu', role: 'student', joinedDate: 'Aug 01, 2026', status: 'Active' },
                    { name: 'John Smith', email: 'john.smith@gmail.com', role: 'student', joinedDate: 'Aug 08, 2026', status: 'Active' },
                    { name: 'Aimi Sato', email: 'aimi.sato@yahoo.co.jp', role: 'student', joinedDate: 'Aug 10, 2026', status: 'Active' },
                    { name: 'Kenji Suzuki', email: 'kenji.suzuki@outlook.com', role: 'student', joinedDate: 'Aug 12, 2026', status: 'Active' },
                    { name: 'Priya Patel', email: 'priya.patel@tech.in', role: 'student', joinedDate: 'Aug 14, 2026', status: 'Active' }
                  ].map((userItem, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{userItem.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{userItem.email}</td>
                      <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>
                        <span style={{
                          backgroundColor: userItem.role === 'teacher' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 144, 0, 0.15)',
                          color: userItem.role === 'teacher' ? 'var(--secondary)' : 'var(--primary)',
                          padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700
                        }}>
                          {userItem.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{userItem.joinedDate}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-mint)', fontWeight: 600 }}>Sent ✓</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {userItem.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: EARNINGS & PAYOUT PORTAL */}
      {activeSubTab === 'payouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Revenue Overview Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="grid-3">
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Gross Sales</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>$14,850.00</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)' }}>From 98 Course Enrollments</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Instructor Share (80%)</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>$11,880.00</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>20% platform commission</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 144, 0, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Balance</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>$2,450.00</h2>
                <button
                  onClick={() => alert('Payout request of $2,450.00 submitted to your linked Stripe account!')}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '15px', marginTop: '0.25rem', padding: '0.3rem 1rem' }}
                >
                  Withdraw Now
                </button>
              </div>
            </div>
          </div>

          {/* Payout Transactions History Table */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Payout History & Withdrawal Logs</h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Payout ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payout Method</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Gross Sales</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Net Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'PAY-8921', date: 'Aug 01, 2026', method: 'Direct Bank Transfer (Stripe)', gross: '$4,200.00', net: '$3,360.00', status: 'Completed' },
                    { id: 'PAY-7612', date: 'Jul 01, 2026', method: 'PayPal (bhawna.sensei@edu.com)', gross: '$3,800.00', net: '$3,040.00', status: 'Completed' },
                    { id: 'PAY-6450', date: 'Jun 01, 2026', method: 'Direct Bank Transfer (Stripe)', gross: '$4,400.00', net: '$3,520.00', status: 'Completed' }
                  ].map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{row.id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{row.date}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{row.method}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{row.gross}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-mint)' }}>{row.net}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Responsive Stylesheet */}
      <style>{`
        @media (max-width: 900px) {
          .teacher-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
