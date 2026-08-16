import { useState } from 'react';
import { Server, Database, Video, Shield, Users, Plus, FileText, Activity, Bell, Cpu } from 'lucide-react';
import CloudWatchMonitor from './CloudWatchMonitor';
import ArchitectureScaler from './ArchitectureScaler';

interface CourseType {
  id: string;
  title: string;
  price: string;
  instructor: string;
}

interface AdminDashboardProps {
  onTriggerCheckout: (course: CourseType) => void;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboard({ setActiveTab }: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'aws' | 'courses' | 'users' | 'ivs' | 'cloudwatch' | 'scaling'>('aws');

  // New Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseTeacher, setNewCourseTeacher] = useState("Sree Ma'am");
  const [newCoursePrice, setNewCoursePrice] = useState('$149');
  const [newCourseDescription, setNewCourseDescription] = useState('');

  // Course List State
  const [coursesList, setCoursesList] = useState([
    { id: 'jp-n5', title: 'Elementary Japanese: JLPT N5 Masterclass', teacher: "Sree Ma'am", price: '$149', ivsChannel: 'ch_us_east_n5', status: 'Active' },
    { id: 'biz-comm', title: 'Professional Business Communication & Keigo Etiquette', teacher: "Bhawna Ma'am", price: '$159', ivsChannel: 'ch_us_east_biz', status: 'Active' },
    { id: 'coding-fs', title: 'Full-Stack Web Development & Coding Boot Camp', teacher: 'Murugun Sir', price: '$249', ivsChannel: 'ch_us_east_code', status: 'Active' }
  ]);

  // User List State
  const [usersList] = useState([
    { id: 'usr-1', name: 'Student Nara', email: 'student.nara@skillnara.edu', role: 'Student', status: 'Active', created: 'Aug 01, 2026' },
    { id: 'usr-2', name: "Sree Ma'am", email: 'sree@skillnara.edu', role: 'Teacher', status: 'Active', created: 'Jul 15, 2026' },
    { id: 'usr-3', name: "Bhawna Ma'am", email: 'bhawna@skillnara.edu', role: 'Teacher', status: 'Active', created: 'Jul 20, 2026' },
    { id: 'usr-4', name: 'Murugun Sir', email: 'murugun@skillnara.edu', role: 'Teacher', status: 'Active', created: 'Jul 22, 2026' },
    { id: 'usr-5', name: 'Admin Control', email: 'admin@skillnara.edu', role: 'Admin', status: 'Active', created: 'Jul 01, 2026' }
  ]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newC = {
      id: `course-${Date.now()}`,
      title: newCourseTitle.trim(),
      teacher: newCourseTeacher,
      price: newCoursePrice,
      ivsChannel: `ch_us_east_${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active'
    };

    setCoursesList([newC, ...coursesList]);
    setNewCourseTitle('');
    setNewCourseDescription('');
    alert(`Course "${newC.title}" created successfully! Amazon IVS channel ${newC.ivsChannel} provisioned.`);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Shield size={24} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AWS EdTech Admin Control Portal</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            System Architecture: ASP.NET Core .NET 8 API • PostgreSQL • Amazon IVS Low-Latency Streaming • Amazon S3 & Lambda VOD
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', fontWeight: 800, padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Activity size={15} /> System Healthy (EC2 Graviton T4g)
          </span>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '5px', borderRadius: '25px', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setAdminTab('aws')}
          className={`btn btn-sm ${adminTab === 'aws' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Server size={15} />
          <span>AWS Infrastructure & Budget Monitor</span>
        </button>

        <button
          onClick={() => setAdminTab('courses')}
          className={`btn btn-sm ${adminTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <FileText size={15} />
          <span>Courses & Lectures Management</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`btn btn-sm ${adminTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Users size={15} />
          <span>User & Teacher Accounts ({usersList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('ivs')}
          className={`btn btn-sm ${adminTab === 'ivs' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Video size={15} />
          <span>Amazon IVS & S3 VOD Pipeline</span>
        </button>

        <button
          onClick={() => setAdminTab('cloudwatch')}
          className={`btn btn-sm ${adminTab === 'cloudwatch' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Bell size={15} />
          <span>CloudWatch & S3 Cost Guard</span>
        </button>

        <button
          onClick={() => setAdminTab('scaling')}
          className={`btn btn-sm ${adminTab === 'scaling' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: '20px', fontSize: '0.82rem', gap: '0.4rem' }}
        >
          <Cpu size={15} />
          <span>Scaling & Security Suite</span>
        </button>
      </div>

      {/* SUB-TAB 1: AWS INFRASTRUCTURE & BUDGET MONITOR */}
      {adminTab === 'aws' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Target Allocation Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="grid-4">
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>EC2 GRAVITON T4G</span>
                <Server size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>$1,450 / mo</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-mint)' }}>1 Small Instance (Docker + .NET 8 API)</span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>AMAZON IVS LIVE</span>
                <Video size={18} style={{ color: 'var(--secondary)' }} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>$1,850 / mo</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>60 Live Hrs • ~1,800 Viewer-Hours</span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>AMAZON S3 STORAGE</span>
                <Database size={18} style={{ color: 'var(--accent-mint)' }} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>$480 / mo</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-mint)' }}>VOD Lecture Recordings & PDFs</span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>CLOUDWATCH & OTHER</span>
                <Activity size={18} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>$320 / mo</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Logs, Route 53, SES Email</span>
            </div>
          </div>

          {/* AWS Service Matrix Table */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AWS Architecture Services & Allocation Matrix</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configured according to AWS EdTech Platform Specification</p>
              </div>
              <span style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.35rem 0.85rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 800 }}>
                Budget Ceiling: $5,000 / mo Target
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>AWS Service</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Purpose</th>
                    <th style={{ padding: '0.75rem 1rem' }}>MVP Approach</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Monthly Est.</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: 'EC2 (Graviton T4g)', purpose: 'API + Web/Server Workloads', approach: '1 small instance (Docker)', cost: '$1,450', status: 'Running' },
                    { service: 'Amazon S3', purpose: 'Videos, PDFs, Images, Recordings', approach: 'Private buckets + Lifecycle rules', cost: '$480', status: 'Active' },
                    { service: 'Amazon IVS', purpose: 'Live Lectures Low-Latency', approach: '1 channel initially; Auto-record', cost: '$1,850', status: 'Active' },
                    { service: 'AWS Lambda', purpose: 'Process recording events / VOD', approach: 'Update lecture status + metadata', cost: '$40', status: 'Active' },
                    { service: 'PostgreSQL', purpose: 'Users, courses, lectures, payments', approach: 'Start small; separate later', cost: 'Included in EC2', status: 'Healthy' },
                    { service: 'CloudWatch', purpose: 'Logs / Alarms / Monitoring', approach: 'Essential metrics only', cost: '$220', status: 'Monitoring' },
                    { service: 'Route 53 & SES', purpose: 'DNS & Transactional Email', approach: 'Hosted zone + transactional mail', cost: '$100', status: 'Active' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{row.service}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{row.purpose}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.approach}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{row.cost}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: COURSES & LECTURES MANAGEMENT */}
      {adminTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }} className="grid-2">
          
          {/* Create Course Form */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Provision New Course & IVS Channel</h3>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Kanji & Vocabulary Drill"
                  className="form-input"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assigned Instructor</label>
                  <select
                    className="form-input"
                    value={newCourseTeacher}
                    onChange={(e) => setNewCourseTeacher(e.target.value)}
                    style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                  >
                    <option value="Sree Ma'am">Sree Ma'am</option>
                    <option value="Bhawna Ma'am">Bhawna Ma'am</option>
                    <option value="Murugun Sir">Murugun Sir</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Enrollment Price</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Course curriculum summary..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  style={{ fontSize: '0.85rem', resize: 'none', marginTop: '0.25rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ borderRadius: '20px', gap: '0.4rem', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Create Course & Assign IVS Channel</span>
              </button>
            </form>
          </div>

          {/* Active Courses List */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Courses Catalog ({coursesList.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {coursesList.map(c => (
                <div key={c.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{c.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Instructor: <strong>{c.teacher}</strong> • Amazon IVS: <code>{c.ivsChannel}</code>
                    </span>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{c.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: USER & TEACHER ACCOUNTS */}
      {adminTab === 'users' && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Platform User Roster ({usersList.length})</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                  <th style={{ padding: '0.75rem 1rem' }}>System Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Joined Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        backgroundColor: u.role === 'Admin' ? 'rgba(244, 63, 94, 0.15)' : u.role === 'Teacher' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 144, 0, 0.15)',
                        color: u.role === 'Admin' ? 'var(--accent-rose)' : u.role === 'Teacher' ? 'var(--secondary)' : 'var(--primary)',
                        padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.created}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-mint)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AMAZON IVS & S3 VOD PIPELINE */}
      {adminTab === 'ivs' && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Amazon IVS Stream & S3 Auto-Record Architecture</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workflow: Teacher OBS Stream → Amazon IVS Low-Latency → S3 Bucket → Lambda Event → VOD Metadata</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div><strong>S3 Target Bucket:</strong> <code>s3://skillnara-ivs-recordings-us-east-1/</code></div>
            <div><strong>Lambda Processor Function:</strong> <code>arn:aws:lambda:us-east-1:1234567890:function:IVSAutoRecordVODProcessor</code></div>
            <div><strong>Playback CDN domain:</strong> <code>https://d123456.cloudfront.net/ivs/</code></div>
          </div>

          <button onClick={() => setActiveTab('live')} className="btn btn-primary" style={{ borderRadius: '25px', alignSelf: 'flex-start' }}>
            Test Amazon IVS Live Stream Player
          </button>
        </div>
      )}

      {/* SUB-TAB 5: CLOUDWATCH ALARMS & S3 COST GUARD */}
      {adminTab === 'cloudwatch' && (
        <CloudWatchMonitor />
      )}

      {/* SUB-TAB 6: SCALING ARCHITECTURE & SECURITY SUITE */}
      {adminTab === 'scaling' && (
        <ArchitectureScaler />
      )}

    </div>
  );
}
