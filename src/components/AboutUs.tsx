import { Users, Award, BookOpen, Heart, TrendingUp, Clock, ArrowRight, Shield } from 'lucide-react';

interface AboutUsProps {
  setActiveTab: (tab: string) => void;
}

export default function AboutUs({ setActiveTab }: AboutUsProps) {
  const stats = [
    { value: '5,000+', label: 'Students Enrolled', icon: Users, color: 'var(--primary)' },
    { value: '98%', label: 'Placement Rate', icon: TrendingUp, color: 'var(--accent-mint)' },
    { value: '24/7', label: 'Support & Help', icon: Clock, color: 'var(--accent-gold)' },
    { value: '15+', label: 'Corporate Partners', icon: Award, color: 'var(--secondary)' }
  ];

  const values = [
    {
      title: 'Interactive Live Classrooms',
      desc: 'Our classes aren\'t passive videos. Participate in active whiteboard drawing exercises, real-time feedback, and live classroom polls.',
      icon: BookOpen
    },
    {
      title: 'Vetted Corporate Mentors',
      desc: 'Learn directly from certified professionals and experienced educators with proven tracks in global corporate industries.',
      icon: Shield
    },
    {
      title: 'End-to-End Placement Care',
      desc: 'From resume reviews to direct internships, interview coaching, and corporate matches, we support you until you get hired.',
      icon: Heart
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Foundational Scaffolding',
      desc: 'Skillnara was founded with the mission to deliver high-quality language coaching (Japanese/Keigo) and specialized tech certifications to bridging standard classroom gaps.'
    },
    {
      year: '2025',
      title: 'Interactive Live Stream Rooms',
      desc: 'Introduced state-of-the-art virtual classroom spaces featuring canvas sketchpads, live quizzes, and speed-controlled recording archives.'
    },
    {
      year: '2026',
      title: 'Global Partnerships & Placement',
      desc: 'Signed recruitment and internship agreements with leading tech and corporate recruiters in India and abroad, establishing Skillnara as a premiere Skillup Centre.'
    }
  ];

  const instructors = [
    { name: 'Sree Ma\'am', role: 'Chief Japanese Language Instructor', bio: 'Expert in JLPT N5-N1 coaching. Helps students clear language exams and land jobs in Tokyo.' },
    { name: 'Bhawna Ma\'am', role: 'Business Communication Mentor', bio: 'Teaches professional business English, Keigo etiquette, and corporate email writing.' },
    { name: 'Murugun Sir', role: 'Full-Stack Technical Lead', bio: 'Silicon Valley veteran. Teaches responsive web design, React, Node.js, and data structures.' },
    { name: 'Simran Ma\'am', role: 'Digital Marketing strategist', bio: 'Former marketing director. Instructs SEM, SEO campaigns, and Google Analytics.' },
    { name: 'Manish Sir', role: 'Placement Director & Advisor', bio: 'Corporate counselor. Conducts resume diagnostics, mock interview prep, and hiring alignments.' }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 0', display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      
      {/* 1. Hero / Slogan Section */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <span style={{
          backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800,
          padding: '0.3rem 0.9rem', borderRadius: '50px', border: '1px solid var(--border-glow)', textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          India\'s First Skillup Centre
        </span>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 850, lineHeight: 1.15, marginTop: '0.5rem' }}>
          Connecting Learners to <span className="gradient-text">Their Future</span>
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          From school coaching to career certifications, internships to job placement assistance — Skillnara bridges the gap between educational theory and real-world corporate readiness for students in India and abroad.
        </p>
      </div>

      {/* 2. Interactive Stats Grid */}
      <div className="grid-4" style={{ gap: '1.5rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card stat-hover-card" style={{
              padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
              }}>
                <Icon size={24} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 850, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 3. Core Values / Pillars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>The Pillars of Skillnara</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Why thousands of global students select our platform.</p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ color: 'var(--primary)', width: 'fit-content' }}>
                  <Icon size={28} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 750, color: 'var(--text-primary)' }}>{v.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Vertical Milestones Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Our Journey & Milestones</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>A visual chronicle of our commitment to student success.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Vertical central bar */}
          <div style={{
            position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px',
            background: 'linear-gradient(to bottom, var(--primary) 0%, var(--secondary) 100%)'
          }}></div>

          {milestones.map((m, i) => (
            <div key={i} className="animate-fade-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Timeline circle node */}
              <div style={{
                position: 'absolute', left: '-27px', top: '4px', width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)', border: '3px solid var(--primary)',
                boxShadow: 'var(--primary-glow) 0 0 10px'
              }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--primary)' }}>{m.year}</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--text-primary)' }}>{m.title}</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginLeft: '0.1rem' }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Vetted Instructor Bios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Meet the Geniuses Behind Skillnara</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our elite creators, researchers, and professional trainers.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {instructors.map((ins, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontWeight: 700, fontSize: '1.1rem'
                }}>
                  {ins.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 750, color: 'var(--text-primary)' }}>{ins.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{ins.role}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CTA Banner */}
      <div className="glass-card gradient-bg" style={{
        padding: '3rem 2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: '1.5rem', color: '#ffffff', marginTop: '1.5rem'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>Start Your Learning Odyssey Today!</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', fontSize: '1rem', lineHeight: 1.5 }}>
          Join thousands of learners from around the world. Unlock certified expert coaching, interactive whiteboard streams, and placement mentorship today.
        </p>
        <button
          onClick={() => setActiveTab('landing')}
          className="btn btn-primary"
          style={{
            backgroundColor: '#ffffff', color: 'var(--navy-bg, #020c15)', borderRadius: '30px',
            padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 700, gap: '0.5rem'
          }}
        >
          <span>Explore Course Catalog</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Embedded styles for animations */}
      <style>{`
        .stat-hover-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--primary-glow) 0 10px 30px;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
