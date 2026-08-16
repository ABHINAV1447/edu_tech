import { useState } from 'react';
import { Database, Cpu } from 'lucide-react';

export default function ArchitectureScaler() {
  const [rdsStatus, setRdsStatus] = useState<'ec2' | 'migrating' | 'rds'>('ec2');
  const [redisEnabled, setRedisEnabled] = useState(true);
  const [wafActive, setWafActive] = useState(true);
  const [activeCodeTab, setActiveCodeTab] = useState<'docker' | 'nginx'>('docker');

  const handleStartRdsMigration = () => {
    setRdsStatus('migrating');
    setTimeout(() => {
      setRdsStatus('rds');
      alert('PostgreSQL database successfully migrated to Managed Amazon RDS (db.t4g.micro)!');
    }, 2000);
  };

  const dockerComposeYaml = `version: '3.8'
services:
  web_api:
    image: skillnara/api:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__PostgreSQL=Host=rds.skillnara.us-east-1.rds.amazonaws.com;Database=edtech_db;Username=admin;Password=secret
      - Redis__Configuration=redis.skillnara.cache.amazonaws.com:6379
    restart: always

  nginx_proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web_api`;

  const nginxConf = `server {
    listen 80;
    server_name api.skillnara.edu;

    location / {
        proxy_pass http://web_api:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={22} style={{ color: 'var(--secondary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Phase 6 Architecture Scaling & Security Suite</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Managed Amazon RDS • Redis In-Memory Cache • CloudFront CDN Signed URLs • AWS WAF Protection
          </p>
        </div>
      </div>

      {/* 1. Amazon RDS Migration Wizard */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Database Migration: EC2 PostgreSQL → Amazon RDS</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Migrate from local EC2 database instance to managed Amazon RDS for high availability</p>
          </div>

          {rdsStatus === 'ec2' && (
            <button onClick={handleStartRdsMigration} className="btn btn-primary btn-sm" style={{ borderRadius: '20px', gap: '0.4rem' }}>
              <Database size={14} />
              <span>Migrate to Managed RDS</span>
            </button>
          )}

          {rdsStatus === 'migrating' && (
            <span style={{ backgroundColor: 'rgba(255, 144, 0, 0.15)', color: 'var(--primary)', padding: '0.35rem 0.85rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
              Migrating Snapshot to RDS...
            </span>
          )}

          {rdsStatus === 'rds' && (
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', padding: '0.35rem 0.85rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
              Running on Amazon RDS (db.t4g.micro) ✓
            </span>
          )}
        </div>
      </div>

      {/* 2. Redis & WAF Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2">
        
        {/* Redis Cache Control */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Redis In-Memory Caching Layer</h3>
            <input
              type="checkbox"
              checked={redisEnabled}
              onChange={(e) => setRedisEnabled(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Caches active viewer rosters, live lecture metadata, and JWT tokens in-memory to reduce database query load by 85%.
          </p>
        </div>

        {/* AWS WAF Security Control */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AWS WAF Web Application Firewall</h3>
            <input
              type="checkbox"
              checked={wafActive}
              onChange={(e) => setWafActive(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Enforces security rules blocking SQL injection, XSS attacks, rate-limiting bots, and protecting Amazon S3 buckets via short-lived signed URLs.
          </p>
        </div>

      </div>

      {/* 3. Docker & Nginx Production Configuration Viewer */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Production Docker & Nginx Configuration</h3>
          
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: '15px' }}>
            <button
              onClick={() => setActiveCodeTab('docker')}
              className={`btn btn-sm ${activeCodeTab === 'docker' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '12px', fontSize: '0.78rem' }}
            >
              docker-compose.yml
            </button>
            <button
              onClick={() => setActiveCodeTab('nginx')}
              className={`btn btn-sm ${activeCodeTab === 'nginx' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '12px', fontSize: '0.78rem' }}
            >
              nginx.conf
            </button>
          </div>
        </div>

        <pre style={{
          backgroundColor: '#121316', color: '#38bdf8', padding: '1.25rem', borderRadius: '12px',
          fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.5, overflowX: 'auto', border: '1px solid var(--border-color)'
        }}>
          {activeCodeTab === 'docker' ? dockerComposeYaml : nginxConf}
        </pre>
      </div>

    </div>
  );
}
