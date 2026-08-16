import { useState } from 'react';
import { User, Award, BookMarked, Settings, Flame, ShieldCheck, Download, Plus, Trash2, Edit, Save, Bell, Mail } from 'lucide-react';

interface UserType {
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email?: string;
  isEmailVerified?: boolean;
}

interface StudentProfileProps {
  user: UserType;
  setActiveTab: (tab: string) => void;
}

interface StudyNote {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
}

export default function StudentProfile({ user, setActiveTab }: StudentProfileProps) {
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'certificates' | 'notes' | 'settings'>('overview');

  // Editable Profile State
  const [bio, setBio] = useState(localStorage.getItem('student_bio') || 'Passionate Japanese learner preparing for JLPT N5 exam. Interested in anime culture, business etiquette, and full-stack coding.');
  const [targetGoal, setTargetGoal] = useState(localStorage.getItem('student_goal') || 'Pass JLPT N5 with 95%+ by Dec 2026');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Avatar Selection State
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('student_avatar') || avatars[0]);

  // Personal Notes State
  const [notes, setNotes] = useState<StudyNote[]>([
    {
      id: '1',
      title: 'Difference Between は (wa) and が (ga)',
      category: 'Japanese Grammar',
      content: 'は emphasizes what comes AFTER it (the predicate). が emphasizes what comes BEFORE it (the subject). Example: わたしは田中です vs わたしが田中です (I am the one who is Tanaka).',
      date: 'Aug 10, 2026'
    },
    {
      id: '2',
      title: 'Business Honorifics: Sonkeigo Verbs',
      category: 'Business Keigo',
      content: 'Irasshaimasu (to go/come/be), Meshiagarimasu (to eat/drink), Os仰い (to say). Used when speaking to superiors or clients.',
      date: 'Aug 12, 2026'
    }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Japanese Grammar');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Settings State
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email || 'student.nara@skillnara.edu');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveBio = () => {
    localStorage.setItem('student_bio', bio);
    localStorage.setItem('student_goal', targetGoal);
    localStorage.setItem('student_avatar', selectedAvatar);
    setIsEditingBio(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNoteObj: StudyNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      content: newNoteContent.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setNotes([newNoteObj, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Student Header Card */}
      <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          {/* Avatar with Ring */}
          <div style={{ position: 'relative' }}>
            <img
              src={selectedAvatar}
              alt={user.name}
              style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 8px 25px rgba(255, 144, 0, 0.3)' }}
            />
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '50%', padding: '4px', display: 'flex' }} title="Email Verified">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user.name}</h2>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={13} /> Verified Learner
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{user.email || 'student.nara@skillnara.edu'}</p>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '0.25rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                Level 4 Scholar • 2,450 XP
              </span>
              <span style={{ backgroundColor: 'rgba(255, 144, 0, 0.15)', border: '1px solid rgba(255, 144, 0, 0.3)', borderRadius: '15px', padding: '0.25rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#ff9000', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Flame size={14} /> 5-Day Study Streak
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="btn btn-secondary"
            style={{ borderRadius: '20px', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <Edit size={15} />
            <span>{isEditingBio ? 'Close Edit' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className="btn btn-primary"
            style={{ borderRadius: '20px', fontSize: '0.85rem' }}
          >
            Join Live Class
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '5px', borderRadius: '25px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        <button
          onClick={() => setProfileSubTab('overview')}
          className={`btn btn-sm ${profileSubTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <User size={15} />
          <span>Identity & Progress</span>
        </button>

        <button
          onClick={() => setProfileSubTab('certificates')}
          className={`btn btn-sm ${profileSubTab === 'certificates' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Award size={15} />
          <span>Certificates & Badges (2)</span>
        </button>

        <button
          onClick={() => setProfileSubTab('notes')}
          className={`btn btn-sm ${profileSubTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <BookMarked size={15} />
          <span>Personal Study Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setProfileSubTab('settings')}
          className={`btn btn-sm ${profileSubTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Settings size={15} />
          <span>Account Settings</span>
        </button>
      </div>

      {/* SUB-TAB 1: IDENTITY & PROGRESS OVERVIEW */}
      {profileSubTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Left Column: Bio & Skill Radar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Bio Card */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>About & Study Goals</h3>
                {!isEditingBio && (
                  <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Edit
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose Avatar</label>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
                      {avatars.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="avatar option"
                          onClick={() => setSelectedAvatar(url)}
                          style={{
                            width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
                            border: selectedAvatar === url ? '3px solid var(--primary)' : '2px solid transparent',
                            opacity: selectedAvatar === url ? 1 : 0.6
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bio Summary</label>
                    <textarea
                      rows={3}
                      className="form-input"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      style={{ fontSize: '0.85rem', resize: 'none', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Target Goal</label>
                    <input
                      type="text"
                      className="form-input"
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                    />
                  </div>

                  <button onClick={handleSaveBio} className="btn btn-primary btn-sm" style={{ borderRadius: '15px', alignSelf: 'flex-start', gap: '0.3rem' }}>
                    <Save size={14} />
                    <span>Save Bio Changes</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{bio}</p>
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Target Milestone</span>
                    <p style={{ fontWeight: 700, marginTop: '0.2rem', fontSize: '0.9rem' }}>{targetGoal}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skill Mastery Radar */}
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Japanese Skill Mastery Radar</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Grammar & Particles (は vs が, ~tai)</span>
                    <strong style={{ color: 'var(--primary)' }}>78%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ width: '78%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Vocabulary & Kanji Recognition</span>
                    <strong style={{ color: 'var(--secondary)' }}>64%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ width: '64%', height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Business Etiquette & Keigo</span>
                    <strong style={{ color: 'var(--accent-mint)' }}>90%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--accent-mint)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Achievements Showcase */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Earned Badges Showcase</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '2rem' }}>🎌</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>Kanji Explorer</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mastered 100+ N5 Kanji</span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '2rem' }}>🔥</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>Streak Champion</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>5 Days Active Study</span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '2rem' }}>💼</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>Keigo Specialist</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Passed Keigo Quiz 100%</span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '2rem' }}>🤖</span>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>AI Tutor Scholar</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Asked SkillBot 15+ Qs</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: CERTIFICATES & BADGES */}
      {profileSubTab === 'certificates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Certificate Card 1 */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--primary-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 144, 0, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} />
              </div>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                Verified Certificate
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skillnara Official Credential</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.2rem' }}>Elementary Japanese JLPT N5 Honor Certificate</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Issued by Skillnara Institute • Instructor Sree Ma'am • Completed Aug 2026
              </p>
            </div>

            <button
              onClick={() => alert(`Downloading Official PDF Certificate for ${user.name}...`)}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '20px', gap: '0.4rem', alignSelf: 'flex-start' }}
            >
              <Download size={14} />
              <span>Download PDF Certificate</span>
            </button>
          </div>

          {/* Certificate Card 2 */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} />
              </div>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                Verified Certificate
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skillnara Official Credential</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.2rem' }}>Business Japanese Keigo & Etiquette Masterclass</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Issued by Skillnara Institute • Instructor Bhawna Ma'am • Completed Aug 2026
              </p>
            </div>

            <button
              onClick={() => alert(`Downloading Official PDF Certificate for ${user.name}...`)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '20px', gap: '0.4rem', alignSelf: 'flex-start' }}
            >
              <Download size={14} />
              <span>Download PDF Certificate</span>
            </button>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: PERSONAL STUDY NOTES */}
      {profileSubTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Add New Note Form */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add Study Note / Rule</h3>

            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Passive Verbs (~reru / ~rareru)"
                  className="form-input"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
                <select
                  className="form-input"
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                >
                  <option value="Japanese Grammar">Japanese Grammar</option>
                  <option value="Kanji & Vocabulary">Kanji & Vocabulary</option>
                  <option value="Business Keigo">Business Keigo</option>
                  <option value="Coding Notes">Coding Notes</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Note Content & Examples</label>
                <textarea
                  rows={4}
                  placeholder="Type your study notes, rules, or vocabulary meanings..."
                  className="form-input"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ borderRadius: '20px', gap: '0.4rem', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Save to My Notes</span>
              </button>
            </form>
          </div>

          {/* Saved Notes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Saved Notebook Entries</h3>

            {notes.map(note => (
              <div key={note.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {note.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{note.date}</span>
                    <button onClick={() => handleDeleteNote(note.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{note.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{note.content}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 4: ACCOUNT SETTINGS */}
      {profileSubTab === 'settings' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Account & Security Preferences</h3>

          <form onSubmit={(e) => { e.preventDefault(); alert('Account settings updated successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Display Name</label>
              <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', borderRadius: '10px', fontSize: '0.9rem' }}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', borderRadius: '10px', fontSize: '0.9rem' }}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} style={{ color: 'var(--primary)' }} />
                <div>
                  <strong style={{ fontSize: '0.88rem' }}>Live Class Reminders</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive email reminders 15 mins before live broadcasts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', marginTop: '0.5rem', justifyContent: 'center' }}>
              <span>Save Account Settings</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
