import { useState } from 'react';
import { Tv, Video, Trash2, Edit, Award, Users, Clock, Check, AlertCircle, FileText } from 'lucide-react';

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

export default function TeacherDashboard({
  instructorName,
  recordedLessons,
  onUploadRecording,
  onUpdateRecording,
  onDeleteRecording,
  setActiveTab
}: TeacherDashboardProps) {
  
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

  // Course Options
  const courseOptions = [
    'JLPT N5 Masterclass',
    'JLPT N4 Accelerator',
    'Business Japanese Etiquette',
    'Digital Marketing & Strategy',
    'Career Certifications Training'
  ];

  // Handle uploading simulation
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recDescription.trim()) {
      alert('Please fill out the recording title and description.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate network upload
    setTimeout(() => {
      // Calculate seconds from mm:ss
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
      
      // Reset fields
      setRecTitle('');
      setRecDescription('');
      setRecAttachment('');

      // Auto clear success notice
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 1200);
  };

  const handleEditClick = (lesson: RecordedLesson) => {
    setEditingLessonId(lesson.id);
    setEditTitle(lesson.title);
    setEditDescription(lesson.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim() || !editingLessonId) return;

    const original = recordedLessons.find(l => l.id === editingLessonId);
    if (original) {
      onUpdateRecording({
        ...original,
        title: editTitle,
        description: editDescription
      });
    }
    setEditingLessonId(null);
  };

  const handleGoLive = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate setting this live class
    localStorage.setItem('skillnara_active_live_title', liveTitle);
    localStorage.setItem('skillnara_active_live_course', liveCourse);
    localStorage.setItem('skillnara_live_class_active', 'true');
    setActiveTab('live');
  };

  const myLessons = recordedLessons.filter(l => l.instructor === instructorName);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. Header Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Okaeri, {instructorName}! 🧑‍🏫</h1>
          <p>Manage your live streams, upload lessons, and interact with your students from this teacher dashboard.</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          borderRadius: '50px',
          backgroundColor: 'var(--primary-glow)',
          border: '1px solid var(--border-glow)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <Award size={16} />
          <span>Verified Skillnara Educator</span>
        </div>
      </div>

      {/* 2. Analytics overview */}
      <div className="grid-4" style={{ gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tv size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>8 Lectures</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hosted This Month</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>243 Students</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently Enrolled</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.12)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>92% Pass</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Quiz Grade</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>12.5 hrs</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Stream Time</div>
          </div>
        </div>
      </div>

      {/* 3. Action panels: Create Lecture & Upload Recording */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '2rem' }} className="teacher-panels">
        
        {/* Launch Live Stream Form */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)' }}>
            <Tv size={20} />
            <span>Launch Live Classroom</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Configure and launch an immediate simulated live stream. Pushes an alert to student dashboards to join.
          </p>

          <form onSubmit={handleGoLive} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Lecture Topic</label>
              <input
                type="text"
                className="form-input"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Target Course</label>
              <select
                className="form-input"
                value={liveCourse}
                onChange={(e) => setLiveCourse(e.target.value)}
                style={{ fontSize: '0.9rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                {courseOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Tv size={16} />
              <span>Go Live Stream Now</span>
            </button>
          </form>
        </div>

        {/* Upload Recording Form */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Video size={20} />
            <span>Upload Past Recording Archive</span>
          </h3>
          
          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {uploadSuccess && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid var(--accent-mint)',
                borderRadius: '8px',
                color: 'var(--accent-mint)',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Check size={16} />
                <span>Recording published successfully! Added to the student Recorded Archive.</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }} className="grid-responsive-dashboard">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Hiragana Voiced Sounds"
                  className="form-input"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Duration (mm:ss)</label>
                <input
                  type="text"
                  placeholder="e.g. 02:40"
                  className="form-input"
                  value={recDuration}
                  onChange={(e) => setRecDuration(e.target.value)}
                  style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive-dashboard">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Target Course</label>
                <select
                  className="form-input"
                  value={recCourse}
                  onChange={(e) => setRecCourse(e.target.value)}
                  style={{ fontSize: '0.9rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {courseOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Slides Attachment Name</label>
                <input
                  type="text"
                  placeholder="e.g. N5_Lesson_Slides.pdf"
                  className="form-input"
                  value={recAttachment}
                  onChange={(e) => setRecAttachment(e.target.value)}
                  style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
              <textarea
                placeholder="Write a brief overview of topics covered in the lecture..."
                className="form-input"
                value={recDescription}
                onChange={(e) => setRecDescription(e.target.value)}
                style={{ fontSize: '0.9rem', borderRadius: '8px', resize: 'none', height: '70px' }}
              ></textarea>
            </div>

            <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ borderRadius: '25px', gap: '0.5rem', marginTop: '0.5rem' }}>
              {isUploading ? (
                <span>Publishing Lecture Files...</span>
              ) : (
                <>
                  <Video size={16} />
                  <span>Upload & Publish Recording</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 4. Edit / Manage Uploaded Recordings Table */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
          <FileText size={20} />
          <span>Manage Uploaded Lectures</span>
        </h3>

        {editingLessonId ? (
          <form onSubmit={handleSaveEdit} className="animate-fade-in" style={{
            display: 'flex', flexDirection: 'column', gap: '1rem',
            padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px',
            borderLeft: '4px solid var(--secondary)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Editing Lecture details:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Title</label>
              <input
                type="text"
                className="form-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
              <textarea
                className="form-input"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{ fontSize: '0.9rem', borderRadius: '8px', resize: 'none', height: '60px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <button type="button" onClick={() => setEditingLessonId(null)} className="btn btn-secondary btn-sm" style={{ borderRadius: '15px' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '15px' }}>
                Save Changes
              </button>
            </div>
          </form>
        ) : null}

        <div style={{ overflowX: 'auto' }}>
          {myLessons.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Course</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Upload Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Views</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myLessons.map((lesson) => (
                  <tr key={lesson.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{lesson.title}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{lesson.course}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{lesson.uploadedDate}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{lesson.duration}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{lesson.views}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditClick(lesson)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                          title="Edit Details"
                        >
                          <Edit size={14} style={{ color: 'var(--secondary)' }} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the recording "${lesson.title}"?`)) {
                              onDeleteRecording(lesson.id);
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                          title="Delete Recording"
                        >
                          <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-muted)' }} />
              <h4>No recordings uploaded yet</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Use the upload panel above to publish past lecture recordings.</p>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @media (max-width: 900px) {
          .teacher-panels {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .grid-responsive-dashboard {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
