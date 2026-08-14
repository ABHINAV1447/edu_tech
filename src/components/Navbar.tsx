import { useState, useEffect } from 'react';
import { Sun, Moon, BookOpen, Video, LayoutDashboard, Menu, X, Monitor, LogOut } from 'lucide-react';
import logo from '../assets/logo.svg';

interface UserType {
  name: string;
  role: 'student' | 'teacher';
  instructorId?: string;
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  user: UserType | null;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Classroom', icon: Monitor },
    { id: 'recorded', label: 'Recorded Archive', icon: Video },
  ];

  return (
    <nav className="glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
          <img src={logo} alt="Skillnara Logo" style={{ height: '48px', width: 'auto' }} />
        </div>

        {/* Desktop Links */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '20px',
                  fontWeight: 500
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-ghost"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--bg-tertiary)'
            }}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} style={{ color: 'var(--accent-gold)' }} /> : <Moon size={18} style={{ color: 'var(--primary)' }} />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: user.role === 'teacher' ? 'linear-gradient(135deg, var(--secondary) 0%, var(--accent-rose) 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: 'var(--primary-glow) 0 4px 10px'
              }}>
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontWeight: 800, padding: '1px 6px', borderRadius: '8px' }}>
                    Verified ✓
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.role === 'teacher' ? 'Instructor' : 'Student'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-ghost"
                style={{
                  padding: '0.4rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--bg-tertiary)'
                }}
                title="Sign Out"
              >
                <LogOut size={14} style={{ color: 'var(--accent-rose)' }} />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost mobile-menu-btn"
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '50%'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {isOpen && (
        <div className="mobile-menu-dropdown animate-fade-in" style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsOpen(false);
                }}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem'
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </button>
            );
          })}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
           {user && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: user.role === 'teacher' ? 'linear-gradient(135deg, var(--secondary) 0%, var(--accent-rose) 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {user.role === 'teacher' ? 'Instructor Portal' : 'Student Account'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', borderRadius: '20px', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Media Queries (Injected as Style Tag for Vanilla CSS support) */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
