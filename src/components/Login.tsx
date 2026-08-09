import { useState } from 'react';
import { Lock, User, LogIn, GraduationCap, Monitor } from 'lucide-react';
import logo from '../assets/logo.svg';

interface LoginProps {
  onLogin: (user: { name: string; role: 'student' | 'teacher'; instructorId?: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Basic mock authentication check
    if (role === 'student') {
      onLogin({
        name: username,
        role: 'student'
      });
    } else {
      // Find matching instructor or default
      let name = username;
      let instructorId = 'sree';
      if (username.toLowerCase().includes('sree')) {
        name = "Sree Ma'am";
        instructorId = 'sree';
      } else if (username.toLowerCase().includes('bhawna')) {
        name = "Bhawna Ma'am";
        instructorId = 'bhawna';
      } else if (username.toLowerCase().includes('murugun')) {
        name = "Murugun Sir";
        instructorId = 'murugun';
      }

      onLogin({
        name,
        role: 'teacher',
        instructorId
      });
    }
  };

  const handleQuickLogin = (selectedRole: 'student' | 'teacher', demoUser: string) => {
    if (selectedRole === 'student') {
      onLogin({
        name: 'Student Nara',
        role: 'student'
      });
    } else {
      let instructorId = 'sree';
      if (demoUser === "Bhawna Ma'am") instructorId = 'bhawna';
      if (demoUser === "Murugun Sir") instructorId = 'murugun';

      onLogin({
        name: demoUser,
        role: 'teacher',
        instructorId
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '2rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="Skillnara Logo" style={{ height: '55px', width: 'auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Sign In to Your Portal</h2>
          <p style={{ fontSize: '0.85rem' }}>Access your interactive dashboard, live streams, and course files.</p>
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={role === 'student' ? 'e.g. student_nara' : 'e.g. sree_instructor'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
            <LogIn size={18} />
            <span>Sign In</span>
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
                As Sree Ma'am (Japanese)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher', "Bhawna Ma'am")}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                As Bhawna Ma'am (Business)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
