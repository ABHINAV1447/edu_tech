import { useState, useEffect } from 'react';
import { Sun, Moon, BookOpen, Video, LayoutDashboard, Menu, X, Monitor, LogOut, FileText, Shield, Bell } from 'lucide-react';
import logo from '../assets/logo.svg';

interface UserType {
  name: string;
  role: 'student' | 'teacher' | 'admin';
  instructorId?: string;
  email?: string;
  isEmailVerified?: boolean;
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'Live Stream', message: 'Live lecture "Business Japanese Keigo" starting in 10 minutes', time: 'Just now', read: false },
    { id: '2', type: 'Assignment', message: 'New assignment posted: "Topic Marker は vs Subject Marker が"', time: '2h ago', read: false },
    { id: '3', type: 'Recording VOD', message: 'Recorded Lecture published to S3: "Sonkeigo Verbs Intro"', time: '5h ago', read: false }
  ]);

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
    { id: 'assignments', label: 'Assignments', icon: FileText },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Control', icon: Shield });
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

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
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          
          {/* Real-time Notification Bell Drawer Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-ghost"
              style={{
                padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px',
                backgroundColor: 'var(--bg-tertiary)', position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={18} style={{ color: 'var(--primary)' }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px', backgroundColor: '#f43f5e',
                  color: '#ffffff', borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifications && (
              <div className="glass-card animate-fade-in" style={{
                position: 'absolute', top: '50px', right: 0, width: '320px',
                backgroundColor: '#18191c', border: '1px solid var(--border-color)',
                borderRadius: '16px', padding: '1rem', boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                zIndex: 1000, color: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Notifications ({notifications.length})</h4>
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#ff9000', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Mark all read
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ff9000' }}>{n.type}</span>
                        <span style={{ fontSize: '0.65rem', color: '#9aa0a6' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, color: '#e8eaed', lineHeight: 1.4 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                background: user.role === 'admin' ? 'linear-gradient(135deg, var(--accent-rose) 0%, var(--primary) 100%)' : user.role === 'teacher' ? 'linear-gradient(135deg, var(--secondary) 0%, var(--accent-rose) 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
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
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role}
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
    </nav>
  );
}
