import { useState } from 'react';
import { Activity, RefreshCw, Zap } from 'lucide-react';

export default function CloudWatchMonitor() {
  const [s3LifecycleActive, setS3LifecycleActive] = useState(true);
  const [glacierSaved, setGlacierSaved] = useState('$340.00');
  const [cpuLoad, setCpuLoad] = useState(28);
  const [ivsViewerHours] = useState(1120);

  const handleRunLifecycleRule = () => {
    setGlacierSaved('$520.00');
    alert('S3 Lifecycle Rule executed! 45 recorded lectures older than 30 days transitioned to S3 Glacier Flexible Retrieval.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Metrics Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>CloudWatch Metrics & Cost Alarms</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            AWS Target Allocation: $5,000 / month MVP ceiling • Real-time CloudWatch Alarm triggers
          </p>
        </div>

        <button onClick={() => setCpuLoad(Math.floor(20 + Math.random() * 15))} className="btn btn-secondary btn-sm" style={{ borderRadius: '20px', gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* CloudWatch Alarm Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="grid-3">
        
        {/* EC2 CPU Load Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EC2 T4G CPU UTILIZATION</span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
              Normal
            </span>
          </div>

          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{cpuLoad}% CPU</h3>
          
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
            <div style={{ width: `${cpuLoad}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alarm threshold: &gt;80% CPU for 5 mins</span>
        </div>

        {/* Amazon IVS Viewer-Hours Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>AMAZON IVS VIEWER-HOURS</span>
            <span style={{ backgroundColor: 'rgba(255, 144, 0, 0.15)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
              62% Limit
            </span>
          </div>

          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{ivsViewerHours} / 1,800 Hrs</h3>
          
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
            <div style={{ width: '62%', height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '4px' }} />
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alarm alert set at 1,500 viewer-hours</span>
        </div>

        {/* S3 Glacier Savings Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>S3 GLACIER SAVINGS</span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
              Active
            </span>
          </div>

          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-mint)' }}>{glacierSaved} Saved</h3>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-transitioning recordings &gt;30 days</span>
        </div>

      </div>

      {/* S3 Lifecycle Rules & Cost Optimization Tool */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Amazon S3 Storage Lifecycle & Budget Guard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enforces section 9 specification rule: prevents storage costs from exceeding $5,000 ceiling</p>
          </div>

          <button onClick={handleRunLifecycleRule} className="btn btn-primary btn-sm" style={{ borderRadius: '20px', gap: '0.4rem' }}>
            <Zap size={14} />
            <span>Run S3 Lifecycle Transition Now</span>
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Rule 1: Transition VOD Recordings to S3 Glacier</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.1rem' }}>Move lectures older than 30 days from S3 Standard ($0.023/GB) to S3 Glacier ($0.004/GB)</p>
            </div>
            <input
              type="checkbox"
              checked={s3LifecycleActive}
              onChange={(e) => setS3LifecycleActive(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
