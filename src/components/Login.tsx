import { useState, useEffect, useRef } from 'react';
import { Lock, User, LogIn, GraduationCap, Monitor, Mail, ShieldCheck, RefreshCw, KeyRound, Sparkles, Settings } from 'lucide-react';
import logo from '../assets/logo.svg';
import { sendVerificationEmail, getStoredEmailConfig, saveEmailConfig } from '../services/emailService';

interface LoginProps {
  onLogin: (user: { name: string; role: 'student' | 'teacher'; instructorId?: string; email?: string; isEmailVerified?: boolean }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Email Sending & Delivery Status
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDeliveryMessage, setEmailDeliveryMessage] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // EmailJS Custom Config State
  const [emailConfig, setEmailConfig] = useState(getStoredEmailConfig());

  // 6-Digit OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'None', width: '0%', color: 'transparent' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: '#f43f5e' };
    if (pass.length < 9 || !/\d/.test(pass)) return { label: 'Medium', width: '66%', color: '#f59e0b' };
    return { label: 'Strong', width: '100%', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (step === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, otpTimer]);

  const triggerRealEmailAutomation = async (userEmail: string, nameStr: string) => {
    setIsSendingEmail(true);
    setError('');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(120);

    // Call Real Email Automation API Service
    const result = await sendVerificationEmail(userEmail, code, nameStr);
    setIsSendingEmail(false);

    if (result.success) {
      setEmailDeliveryMessage(`📧 Verification email sent to ${userEmail}! Please check your email inbox.`);
    } else {
      setError(result.message);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || (authMode === 'signup' && !email.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    if (authMode === 'signup') {
      const userEmail = email.trim() || `${username.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`;
      await triggerRealEmailAutomation(userEmail, username);
      setStep('otp');
    } else {
      // Sign In directly
      executeLogin(username, role, email || `${username.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`, true);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.substring(value.length - 1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto advance focus to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter all 6 verification digits.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setError('Incorrect 6-digit verification code. Please check your email inbox or click Resend.');
      return;
    }

    // OTP Verified successfully!
    const userEmail = email || `${username.toLowerCase().replace(/\s+/g, '')}@skillnara.edu`;
    
    // Save verified registration into localStorage
    const existing = JSON.parse(localStorage.getItem('skillnara_registered_users') || '[]');
    existing.push({
      id: `usr-${Date.now()}`,
      name: username,
      email: userEmail,
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Verified ✓'
    });
    localStorage.setItem('skillnara_registered_users', JSON.stringify(existing));

    executeLogin(username, role, userEmail, true);
  };

  const executeLogin = (userStr: string, userRole: 'student' | 'teacher', userEmail: string, isVerified: boolean) => {
    if (userRole === 'student') {
      onLogin({
        name: userStr,
        role: 'student',
        email: userEmail,
        isEmailVerified: isVerified
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
        email: userEmail,
        isEmailVerified: isVerified
      });
    }
  };

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailConfig(emailConfig);
    setShowConfigModal(false);
    alert('EmailJS settings saved! Verification emails will now route through your EmailJS account.');
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '78vh',
      padding: '2rem',
      position: 'relative'
    }}>

      {/* EmailJS Custom API Keys Modal */}
      {showConfigModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 12, 21, 0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '480px', width: '100%', padding: '2rem', borderRadius: '20px', backgroundColor: '#18191c', color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Configure Real EmailJS Keys</h3>
            <p style={{ fontSize: '0.8rem', color: '#9aa0a6', marginBottom: '1.25rem' }}>
              Connect your EmailJS.com account to send actual emails to any real recipient address.
            </p>

            <form onSubmit={handleSaveEmailConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>EmailJS Service ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailConfig.serviceId}
                  onChange={(e) => setEmailConfig({ ...emailConfig, serviceId: e.target.value })}
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>EmailJS Template ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailConfig.templateId}
                  onChange={(e) => setEmailConfig({ ...emailConfig, templateId: e.target.value })}
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>EmailJS Public Key</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailConfig.publicKey}
                  onChange={(e) => setEmailConfig({ ...emailConfig, publicKey: e.target.value })}
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '20px' }}>
                  Save Keys
                </button>
                <button type="button" onClick={() => setShowConfigModal(false)} className="btn btn-ghost" style={{ flex: 1, borderRadius: '20px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Glass Card */}
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '470px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        boxShadow: 'var(--card-shadow)'
      }}>

        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <img src={logo} alt="Skillnara Logo" style={{ height: '52px', width: 'auto' }} />
          <h2 style={{ fontSize: '1.45rem', marginTop: '0.2rem' }}>
            {step === 'otp' ? 'Verify Email Code (OTP)' : (authMode === 'signin' ? 'Sign In to Skillnara' : 'Create Trusted Account')}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {step === 'otp' ? `Check your email inbox at ${email}` : 'Real Email Automation & Security'}
          </p>
        </div>

        {/* STEP 1: CREDENTIALS INPUT */}
        {step === 'details' && (
          <>
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

            {/* Role Switcher */}
            <div style={{
              display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-tertiary)',
              padding: '0.25rem', borderRadius: '50px', border: '1px solid var(--border-color)'
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

            <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {error && (
                <div style={{
                  padding: '0.75rem 1rem', backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid var(--accent-rose)', borderRadius: '8px',
                  color: 'var(--accent-rose)', fontSize: '0.8rem', fontWeight: 500
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Email Address (Sends Real Email)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <Settings size={12} />
                      <span>EmailJS Settings</span>
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ps6984863@gmail.com"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                  {authMode === 'signup' && password && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: strength.color }}>
                      {strength.label} Password
                    </span>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', borderRadius: '25px', fontSize: '0.9rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {authMode === 'signup' && password && (
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: strength.width, height: '100%', backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSendingEmail} className="btn btn-primary" style={{ borderRadius: '25px', marginTop: '0.5rem', gap: '0.5rem', justifyContent: 'center' }}>
                {isSendingEmail ? (
                  <span>Dispatching Email...</span>
                ) : authMode === 'signup' ? (
                  <>
                    <KeyRound size={18} />
                    <span>Send Real Verification Email</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: 6-DIGIT EMAIL OTP VERIFICATION INPUT */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {emailDeliveryMessage && (
              <div style={{
                padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px',
                color: 'var(--accent-mint)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center'
              }}>
                {emailDeliveryMessage}
              </div>
            )}

            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px', padding: '1rem', textAlign: 'center', fontSize: '0.85rem'
            }}>
              <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                Please check your email inbox at <strong>{email}</strong>
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'block', marginTop: '0.2rem' }}>
                OTP Expires in: {formatTimer(otpTimer)}
              </span>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid var(--accent-rose)', borderRadius: '8px',
                color: 'var(--accent-rose)', fontSize: '0.8rem', fontWeight: 500
              }}>
                {error}
              </div>
            )}

            {/* 6 Digit Passcode Inputs */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  style={{
                    width: '45px', height: '52px', borderRadius: '10px',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                    textAlign: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', gap: '0.5rem', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
              <span>Verify Code & Complete Registration</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <button
                type="button"
                onClick={() => triggerRealEmailAutomation(email, username)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <RefreshCw size={12} />
                <span>Resend Email</span>
              </button>
              <button
                type="button"
                onClick={() => setStep('details')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        {/* Quick Demo Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>
            Or Quick Access Demo
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => executeLogin('Student Nara', 'student', 'student.nara@skillnara.edu', true)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              Login as Student Nara (Verified ✓)
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => executeLogin("Sree Ma'am", 'teacher', 'sree@skillnara.edu', true)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '20px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                Sree Ma'am
              </button>
              <button
                type="button"
                onClick={() => executeLogin("Bhawna Ma'am", 'teacher', 'bhawna@skillnara.edu', true)}
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
