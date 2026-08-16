import { useState } from 'react';
import { FileText, Clock, Upload, Plus, Paperclip } from 'lucide-react';

interface UserType {
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

interface Assignment {
  id: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  totalMarks: number;
  description: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  fileKey: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
  status: 'Submitted' | 'Graded';
}

export default function AssignmentsModule({ user }: { user: UserType }) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'asg-1',
      courseTitle: 'Elementary Japanese: JLPT N5 Masterclass',
      title: 'Topic Marker は vs Subject Marker が Practice Worksheet',
      dueDate: 'Aug 20, 2026',
      totalMarks: 100,
      description: 'Complete all 20 translation sentences in the attached PDF. Distinguish clearly when は or が is used.'
    },
    {
      id: 'asg-2',
      courseTitle: 'Professional Business Communication & Keigo Etiquette',
      title: 'Corporate Email Writing & Sonkeigo Verbs Assignment',
      dueDate: 'Aug 24, 2026',
      totalMarks: 100,
      description: 'Write a polite Japanese business email to a client requesting a meeting reschedule using Sonkeigo and Kenjougo.'
    }
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 'sub-1',
      assignmentId: 'asg-1',
      studentName: 'Student Nara',
      fileKey: 'Wa_vs_Ga_Worksheet_StudentNara.pdf',
      submittedAt: 'Aug 14, 2026',
      marks: 95,
      feedback: 'Excellent work on sentences #4 and #12! Watch out for the suffering passive in #18.',
      status: 'Graded'
    }
  ]);

  // Form State for Teacher
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Elementary Japanese: JLPT N5 Masterclass');
  const [newDueDate, setNewDueDate] = useState('Aug 28, 2026');
  const [newDesc, setNewDesc] = useState('');

  // Form State for Student Submission
  const [selectedAsgId, setSelectedAsgId] = useState('asg-1');
  const [submittedFileName, setSubmittedFileName] = useState('');

  // Grading State for Teacher
  const [gradingMarks, setGradingMarks] = useState(90);
  const [gradingFeedback, setGradingFeedback] = useState('Great effort!');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      courseTitle: newCourse,
      title: newTitle.trim(),
      dueDate: newDueDate,
      totalMarks: 100,
      description: newDesc.trim() || 'Complete the exercises and submit your PDF file.'
    };

    setAssignments([newAsg, ...assignments]);
    setNewTitle('');
    setNewDesc('');
    alert(`Assignment "${newAsg.title}" created successfully!`);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedFileName.trim()) {
      alert('Please specify a filename or upload a file.');
      return;
    }

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: selectedAsgId,
      studentName: user.name,
      fileKey: submittedFileName.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Submitted'
    };

    setSubmissions([newSub, ...submissions]);
    setSubmittedFileName('');
    alert('Assignment submitted successfully to Amazon S3 bucket!');
  };

  const handleGradeSubmission = (subId: string) => {
    setSubmissions(submissions.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          marks: Number(gradingMarks),
          feedback: gradingFeedback,
          status: 'Graded'
        };
      }
      return s;
    }));
    alert('Marks and feedback assigned successfully!');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={24} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Course Assignments & Submissions System</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Database Schema: <code>Assignments</code> & <code>Submissions</code> (S3 File Storage)
          </p>
        </div>
      </div>

      {/* TEACHER / ADMIN CREATION & GRADING SECTION */}
      {(user.role === 'teacher' || user.role === 'admin') ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Create Assignment Form */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Create New Course Assignment</h3>

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanji Writing Drill & Sentences"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Select Course</label>
                <select
                  className="form-input"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                >
                  <option value="Elementary Japanese: JLPT N5 Masterclass">JLPT N5 Masterclass</option>
                  <option value="Professional Business Communication & Keigo Etiquette">Business Keigo Etiquette</option>
                  <option value="Full-Stack Web Development & Coding Boot Camp">Full-Stack Web Boot Camp</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Due Date</label>
                <input
                  type="text"
                  className="form-input"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Instructions & Details</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ fontSize: '0.85rem', resize: 'none', marginTop: '0.25rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ borderRadius: '20px', gap: '0.4rem', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Publish Assignment</span>
              </button>
            </form>
          </div>

          {/* Submissions & Grading Portal */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Student Submissions to Grade ({submissions.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {submissions.map(sub => (
                <div key={sub.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{sub.studentName}</strong>
                    <span style={{ backgroundColor: sub.status === 'Graded' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 144, 0, 0.15)', color: sub.status === 'Graded' ? 'var(--accent-mint)' : 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {sub.status} {sub.marks && `(${sub.marks}/100)`}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Paperclip size={14} />
                    <span>File Key: <code>s3://skillnara-assignments/{sub.fileKey}</code></span>
                  </div>

                  {/* Grading Inputs */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Assign Marks (0-100):</label>
                      <input
                        type="number"
                        style={{ width: '70px', padding: '0.3rem', borderRadius: '6px', fontSize: '0.85rem' }}
                        value={gradingMarks}
                        onChange={(e) => setGradingMarks(Number(e.target.value))}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Write feedback for student..."
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '6px', fontSize: '0.82rem', width: '100%' }}
                    />
                    <button
                      onClick={() => handleGradeSubmission(sub.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '15px', alignSelf: 'flex-start', fontSize: '0.75rem' }}
                    >
                      Save Marks & Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* STUDENT SUBMISSION VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Active Assignments List */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Active Homework Assignments ({assignments.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assignments.map(a => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAsgId(a.id)}
                  style={{
                    padding: '1.25rem', border: selectedAsgId === a.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{a.courseTitle}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{a.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={12} /> Due: {a.dueDate}</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-mint)' }}>Total: {a.totalMarks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Work Form */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Submit Your Work to S3</h3>

            <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Selected Assignment</label>
                <input
                  type="text"
                  disabled
                  value={assignments.find(a => a.id === selectedAsgId)?.title || ''}
                  className="form-input"
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem', backgroundColor: 'var(--bg-tertiary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Upload File Name (S3 Key)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese_Homework_StudentNara.pdf"
                  className="form-input"
                  value={submittedFileName}
                  onChange={(e) => setSubmittedFileName(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ borderRadius: '20px', gap: '0.4rem', justifyContent: 'center' }}>
                <Upload size={16} />
                <span>Upload to Amazon S3 & Submit</span>
              </button>
            </form>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

            {/* Results & Marks Showcase */}
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Your Graded Results</h4>
            {submissions.filter(s => s.studentName === user.name && s.status === 'Graded').map(s => (
              <div key={s.id} style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-mint)' }}>
                  <span>Score: {s.marks}/100 Marks</span>
                  <span>{s.status} ✓</span>
                </div>
                <p style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                  💡 <strong>Feedback:</strong> {s.feedback}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
