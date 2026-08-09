import { useState } from 'react';
import { CreditCard, Lock, X, CheckCircle2, Loader2 } from 'lucide-react';

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
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!isOpen || !course) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    // Simulate transaction delay
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
      backgroundColor: 'rgba(2, 12, 21, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        position: 'relative'
      }}>
        {/* Close Button */}
        {paymentStatus !== 'processing' && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        )}

        {paymentStatus === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div>
              <span className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Secure checkout
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>Unlock Course Material</h3>
            </div>

            {/* Course Summary */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selected Course</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.1rem', color: 'var(--text-primary)' }}>
                  {course.title}
                </h4>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 850, color: 'var(--primary)' }}>
                {course.price}
              </span>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ paddingLeft: '2.5rem', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="form-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    style={{ borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>CVV Code</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    className="form-input"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    style={{ borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <Lock size={12} />
                <span>SSL Encrypted simulated transaction</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', marginTop: '0.5rem' }}>
                <span>Simulate Payment & Unlock</span>
              </button>
            </form>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '3rem 0', gap: '1.5rem', textAlign: 'center'
          }}>
            <Loader2 size={48} className="spinner" style={{ color: 'var(--primary)', animation: 'spin 1.5s linear infinite' }} />
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Processing Secure Payment</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Connecting to payment simulation gateway...
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
            padding: '2rem 0', gap: '1.5rem', textAlign: 'center'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.12)', color: 'var(--accent-mint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Unlock Successful!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Thank you for enrolling! You now have full access to live classes, worksheets, and recordings for this course.
              </p>
            </div>
            <button
              onClick={handleSuccessClose}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '20px', width: '100%' }}
            >
              Start Studying
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
