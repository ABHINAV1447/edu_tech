import { useState } from 'react';
import { Lock, User, LogIn, GraduationCap, Monitor, Mail, CheckCircle, X, Sparkles } from 'lucide-react';
import logo from '../assets/logo.svg';

interface LoginProps {
  onLogin: (user: { name: string; role: 'student' | 'teacher'; instructorId?: string; email?: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Welcome Email Notification Modal State
  const [showWelcomeEmail, setShowWelcomeEmail] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string; role: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || (authMode === 'signup' && !email.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    if (authMode === 'signup') {
      // Save new registration to localStorage
      const existing = JSON.parse(localStorage.getItem('skillnara_registered_users') || '[]');
      const newUser = {
        id: `usr-${Date.now()}`,
        name: username,
        email: email || `${username.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`,
        role,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Active'
      };
      existing.push(newUser);
      localStorage.setItem('skillnara_registered_users', JSON.stringify(existing));

      // Trigger Welcome Email Notification modal
      setRegisteredUser({ name: username, email: email || `${username.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`, role });
      setShowWelcomeEmail(true);
    } else {
      // Sign in logic
      executeLogin(username, role);
    }
  };

  const executeLogin = (userStr: string, userRole: 'student' | 'teacher') => {
    if (userRole === 'student') {
      onLogin({
        name: userStr,
        role: 'student',
        email: email || `${userStr.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`
      });
    } else {
      let name = userStr;
      let instructorId = 'sree';
      if (userStr.toLowerCase().includes('sree')) {
        name = "Sree Ma'am";
        instructorId = 'sree';
      } else if (userStr.toLowerCase().includes('bhawna')) {
        name = "Bhawna Ma'am";
        instructorId = 'bhawna';
      } else if (userStr.toLowerCase().includes('murugun')) {
        name = "Murugun Sir";
        instructorId = 'murugun';
      }

      onLogin({
        name,
        role: 'teacher',
        instructorId,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`
      });
    }
  };

  const handleQuickLogin = (selectedRole: 'student' | 'teacher', demoUser: string) => {
    executeLogin(demoUser, selectedRole);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '2rem'
    }}>
      {/* Official Skillnara Welcome Email Preview Modal */}
      {showWelcomeEmail && registeredUser && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 12, 21, 0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '560px', width: '100%', padding: '2rem', borderRadius: '20px',
            backgroundColor: '#18191c', border: '1px solid var(--primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#ffffff'
          }}>
            {/* Email Banner Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Welcome Email Dispatched
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Skillnara Registration Confirmation</h3>
                </div>
              </div>
              <button onClick={() => { setShowWelcomeEmail(false); executeLogin(registeredUser.name, role); }} style={{ background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Email Metadata */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', color: '#9aa0a6' }}>
              <div><strong style={{ color: '#ffffff' }}>From:</strong> Skillnara Welcome Desk &lt;welcome@skillnara.edu&gt;</div>
              <div><strong style={{ color: '#ffffff' }}>To:</strong> {registeredUser.name} &lt;{registeredUser.email}&gt;</div>
              <div><strong style={{ color: '#ffffff' }}>Subject:</strong> Welcome to Skillnara! Your Registration is Confirmed 🎉</div>
            </div>

            {/* Email Body Preview */}
            <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#e8eaed', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p>Dear <strong>{registeredUser.name}</strong>,</p>
              <p>Welcome to <strong>Skillnara</strong>! We are thrilled to confirm your account registration as a <strong>{registeredUser.role === 'teacher' ? 'Instructor' : 'Student Learner'}</strong>.</p>
              
              <div style={{ backgroundColor: 'rgba(255, 144, 0, 0.1)', borderLeft: '3px solid #ff9000', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0', fontSize: '0.82rem' }}>
                <strong>🚀 What you can do on Skillnara:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                  <li>Join live Google Meet broadcasts with screen share & captions</li>
                  <li>Replay past lectures & use SkillBot AI Tutor chatbot</li>
                  <li>Download course materials, slides & homework exercises</li>
                </ul>
              </div>

              <p>Happy Learning!<br /><em>The Skillnara Academic Team</em></p>
            </div>

            <button
              onClick={() => { setShowWelcomeEmail(false); executeLogin(registeredUser.name, role); }}
              className="btn btn-primary"
              style={{ borderRadius: '25px', padding: '0.65rem 1.8rem', alignSelf: 'center', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
            >
              <span>Continue to Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem'
      }}>
        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="Skillnara Logo" style={{ height: '55px', width: 'auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>
            {authMode === 'signin' ? 'Sign In to Skillnara' : 'Create Your Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {authMode === 'signin' ? 'Access your dashboard, live broadcasts & AI tutor' : 'Join 5,000+ learners connected globally'}
          </p>
        </div>

        {/* Sign In vs Register Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', borderRadius: '25px', padding: '3px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(''); }}
            className={`btn btn-sm ${authMode === 'signin' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: '20px', fontSize: '0.8rem' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); }}
            className={`btn btn-sm ${authMode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: '20px', fontSize: '0.8rem', gap: '0.3rem' }}
          >
            <Sparkles size={13} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Role tabs switcher */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '0.25rem',
          borderRadius: '50px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: '50px', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <GraduationCap size={16} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('teacher'); setError(''); }}
            className={`btn btn-sm ${role === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: '50px', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            <Monitor size={16} />
            <span>Instructor</span>
          </button>
        </div>

        {/* Login / Signup Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid var(--accent-rose)',
              borderRadius: '8px',
              color: 'var(--accent-rose)',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Full Name / Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={role === 'student' ? 'e.g. Student Nara' : 'e.g. Sree Ma\'am'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Email Address (For Registration Email)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="e.g. student@gmail.com"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', marginTop: '0.5rem', gap: '0.5rem' }}>
            {authMode === 'signin' ? <LogIn size={18} /> : <CheckCircle size={18} />}
            <span>{authMode === 'signin' ? 'Sign In' : 'Register & Send Email'}</span>
          </button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        {/* Quick Demo Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>
            Or Quick Access Demo
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('student', 'Student Nara')}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              Login as Student (Student Nara)
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher', "Sree Ma'am")}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                Sree Ma'am
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher', "Bhawna Ma'am")}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                Bhawna Ma'am
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
