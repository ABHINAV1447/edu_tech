import { useState } from 'react';
import { CreditCard, Lock, X, CheckCircle2, Loader2, QrCode, Smartphone, Building } from 'lucide-react';

interface CourseType {
  id: string;
  title: string;
  price: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseType | null;
  onSuccess: (courseId: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, course, onSuccess }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card'>('razorpay');
  const [razorpaySubMethod, setRazorpaySubMethod] = useState<'upi' | 'card' | 'netbanking' | 'qr'>('upi');
  
  // Form Inputs
  const [upiId, setUpiId] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [razorpayOrderId, setRazorpayOrderId] = useState('');

  if (!isOpen || !course) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    setRazorpayOrderId(`order_rzp_${Math.floor(100000 + Math.random() * 900000)}`);
    
    // Simulate Razorpay gateway transaction verification delay
    setTimeout(() => {
      setPaymentStatus('success');
    }, 1800);
  };

  const handleSuccessClose = () => {
    onSuccess(course.id);
    setPaymentStatus('idle');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(2, 12, 21, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2rem',
        backgroundColor: paymentMethod === 'razorpay' ? '#0f172a' : 'var(--bg-secondary)',
        border: paymentMethod === 'razorpay' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-color)',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        {/* Close Button */}
        {paymentStatus !== 'processing' && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              background: 'none',
              border: 'none'
            }}
          >
            <X size={20} />
          </button>
        )}

        {paymentStatus === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{
                  backgroundColor: '#0284c7', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800,
                  padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  RAZORPAY VERIFIED
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Unlock Course Access</h3>
            </div>

            {/* Course Summary */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Selected Course</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.1rem', color: '#ffffff' }}>
                  {course.title}
                </h4>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 850, color: '#38bdf8' }}>
                {course.price}
              </span>
            </div>

            {/* Payment Method Switcher (Razorpay vs Direct Card) */}
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '20px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                style={{
                  flex: 1,
                  background: paymentMethod === 'razorpay' ? '#0284c7' : 'transparent',
                  color: paymentMethod === 'razorpay' ? '#ffffff' : '#94a3b8',
                  border: 'none', borderRadius: '16px', padding: '0.45rem',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem'
                }}
              >
                <span>Razorpay Gateway</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  background: paymentMethod === 'card' ? '#0284c7' : 'transparent',
                  color: paymentMethod === 'card' ? '#ffffff' : '#94a3b8',
                  border: 'none', borderRadius: '16px', padding: '0.45rem',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem'
                }}
              >
                <CreditCard size={14} />
                <span>Credit / Debit</span>
              </button>
            </div>

            {/* RAZORPAY SUB-METHODS */}
            {paymentMethod === 'razorpay' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Razorpay Options Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setRazorpaySubMethod('upi')}
                    style={{
                      padding: '0.5rem 0.2rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                      backgroundColor: razorpaySubMethod === 'upi' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: razorpaySubMethod === 'upi' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                      color: razorpaySubMethod === 'upi' ? '#38bdf8' : '#ffffff', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem'
                    }}
                  >
                    <Smartphone size={15} />
                    <span>UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRazorpaySubMethod('qr')}
                    style={{
                      padding: '0.5rem 0.2rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                      backgroundColor: razorpaySubMethod === 'qr' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: razorpaySubMethod === 'qr' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                      color: razorpaySubMethod === 'qr' ? '#38bdf8' : '#ffffff', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem'
                    }}
                  >
                    <QrCode size={15} />
                    <span>QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRazorpaySubMethod('card')}
                    style={{
                      padding: '0.5rem 0.2rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                      backgroundColor: razorpaySubMethod === 'card' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: razorpaySubMethod === 'card' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                      color: razorpaySubMethod === 'card' ? '#38bdf8' : '#ffffff', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem'
                    }}
                  >
                    <CreditCard size={15} />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRazorpaySubMethod('netbanking')}
                    style={{
                      padding: '0.5rem 0.2rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                      backgroundColor: razorpaySubMethod === 'netbanking' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: razorpaySubMethod === 'netbanking' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                      color: razorpaySubMethod === 'netbanking' ? '#38bdf8' : '#ffffff', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem'
                    }}
                  >
                    <Building size={15} />
                    <span>NetBanking</span>
                  </button>
                </div>

                <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {razorpaySubMethod === 'upi' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Razorpay VPA / UPI ID (Google Pay, PhonePe, Paytm)</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. mobile@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                      />
                    </div>
                  )}

                  {razorpaySubMethod === 'qr' && (
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '110px', height: '110px', backgroundColor: '#ffffff', margin: '0 auto 0.75rem auto', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <QrCode size={90} color="#000000" />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>Scan QR code with GPay, PhonePe, or Paytm</span>
                    </div>
                  )}

                  {razorpaySubMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          style={{ padding: '0.55rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          style={{ padding: '0.55rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                        />
                      </div>
                    </div>
                  )}

                  {razorpaySubMethod === 'netbanking' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={{ padding: '0.55rem', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        <option value="SBI" style={{ color: '#000' }}>State Bank of India (SBI)</option>
                        <option value="HDFC" style={{ color: '#000' }}>HDFC Bank</option>
                        <option value="ICICI" style={{ color: '#000' }}>ICICI Bank</option>
                        <option value="Axis" style={{ color: '#000' }}>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0284c7', color: '#ffffff', border: 'none',
                      padding: '0.75rem', borderRadius: '25px', fontSize: '0.9rem', fontWeight: 800,
                      cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
                    }}
                  >
                    Pay {course.price} via Razorpay
                  </button>
                </form>
              </div>
            )}

            {/* DIRECT CREDIT CARD FORM */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ paddingLeft: '2.5rem', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="form-input"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{ borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>CVV Code</label>
                    <input
                      type="password"
                      required
                      maxLength={3}
                      className="form-input"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      style={{ borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', marginTop: '0.5rem' }}>
                  <span>Pay {course.price} & Unlock Access</span>
                </button>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
              <Lock size={12} />
              <span>Razorpay 256-bit SSL Encrypted Transaction</span>
            </div>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '3rem 0', gap: '1.5rem', textAlign: 'center', color: '#ffffff'
          }}>
            <Loader2 size={48} className="spinner" style={{ color: '#38bdf8', animation: 'spin 1.5s linear infinite' }} />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verifying Razorpay Transaction</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Connecting to Razorpay Secure Gateway... Order ID: <strong>{razorpayOrderId}</strong>
              </p>
            </div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="animate-fade-in" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 0', gap: '1.5rem', textAlign: 'center', color: '#ffffff'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={38} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Razorpay Payment Successful!</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Transaction Verified • Payment ID: <strong>{razorpayOrderId}</strong>
              </p>
            </div>
            <div style={{
              padding: '1rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px',
              fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', width: '100%'
            }}>
              <p>You have unlocked lifetime access to <strong>{course.title}</strong>.</p>
            </div>
            <button
              onClick={handleSuccessClose}
              className="btn btn-primary"
              style={{ borderRadius: '25px', padding: '0.65rem 2rem', fontSize: '0.9rem' }}
            >
              Start Learning Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
