import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Volume2, Download, Search, Clock, MessageSquare, List, Lock } from 'lucide-react';

interface RecordedLesson {
  id: string;
  title: string;
  course: string;
  instructor: string;
  duration: string;
  totalTimeSeconds: number;
  uploadedDate: string;
  views: string;
  description: string;
  materials: { name: string; size: string }[];
}

interface TranscriptLine {
  time: number; // in seconds
  speaker: string;
  text: string;
}

interface HistoricalChat {
  time: number; // triggers at this second
  sender: string;
  message: string;
}

interface CourseType {
  id: string;
  title: string;
  price: string;
}

interface RecordedArchiveProps {
  recordedLessons: RecordedLesson[];
  purchasedCourseIds?: string[];
  onTriggerCheckout?: (course: CourseType) => void;
}

export default function RecordedArchive({ recordedLessons, purchasedCourseIds = [], onTriggerCheckout }: RecordedArchiveProps) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonId, setActiveLessonId] = useState<string>(recordedLessons[0]?.id || '');

  const lessons = recordedLessons;
  const activeLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const getCourseId = (title: string) => {
    if (title.includes('Japanese') || title.includes('JLPT') || title.includes('jp-n5')) return 'jp-n5';
    if (title.includes('Business') || title.includes('Keigo') || title.includes('biz-comm')) return 'biz-comm';
    if (title.includes('Digital') || title.includes('Marketing') || title.includes('dm-strategy')) return 'dm-strategy';
    if (title.includes('Coding') || title.includes('Web') || title.includes('coding-fs')) return 'coding-fs';
    return 'career-cert';
  };

  const activeCourseId = activeLesson ? getCourseId(activeLesson.course) : 'jp-n5';
  const isPurchased = activeLesson ? purchasedCourseIds.includes(activeCourseId) : true;

  const coursePrices: Record<string, string> = {
    'jp-n5': '$149',
    'coding-fs': '$249',
    'dm-strategy': '$129',
    'biz-comm': '$159',
    'career-cert': '$189'
  };

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef<any>(null);

  // Transcript and historical chat database
  const transcripts: Record<string, TranscriptLine[]> = {
    'n5-particles': [
      { time: 0, speaker: 'Sree Ma\'am', text: 'Mina-san, konnichiwa! Welcome back to Lesson 5 of JLPT N5 Masterclass.' },
      { time: 15, speaker: 'Sree Ma\'am', text: 'Today, we are tackling one of the most common questions: What is the difference between particles は (wa) and が (ga)?' },
      { time: 35, speaker: 'Sree Ma\'am', text: 'Simply put, は highlights the TOPIC of the sentence, while が highlights the SUBJECT.' },
      { time: 55, speaker: 'Sree Ma\'am', text: 'Let\'s write an example: Watashi wa sushi ga suki desu. (私は寿司が好きです).' },
      { time: 75, speaker: 'Sree Ma\'am', text: 'Here, "Watashi wa" establishes the topic (as for me). "Sushi ga" highlights the subject of my liking.' },
      { time: 95, speaker: 'Sree Ma\'am', text: 'Try replacing sushi with other nouns and write them down in your homework sheets. See you next class!' }
    ],
    'biz-keigo': [
      { time: 0, speaker: 'Bhawna Ma\'am', text: 'Welcome to our introductory module on Keigo and Business Japanese.' },
      { time: 20, speaker: 'Bhawna Ma\'am', text: 'Keigo is polite speech. Today we are looking specifically at Sonkeigo (尊敬語), which is respectful language.' },
      { time: 50, speaker: 'Bhawna Ma\'am', text: 'We use Sonkeigo when we speak about the actions of our superiors, bosses, or customers.' },
      { time: 80, speaker: 'Bhawna Ma\'am', text: 'For example, instead of asking "Nani wo tabemasu ka?", you say "Nani wo召し上がりますか (meshiagarimasu ka)?"' },
      { time: 115, speaker: 'Bhawna Ma\'am', text: 'Notice how the dictionary verb "taberu" transforms completely. We will study the irregular table next.' },
      { time: 140, speaker: 'Bhawna Ma\'am', text: 'Make sure to download the irregular verb cheatsheet attached below.' }
    ],
    'n4-passives': [
      { time: 0, speaker: 'Murugun Sir', text: 'Hello class! Let\'s analyze passive sentences in Japanese today.' },
      { time: 15, speaker: 'Murugun Sir', text: 'We call the passive form 受身 (ukemi). It is created by appending reru or rareru.' },
      { time: 40, speaker: 'Murugun Sir', text: 'A unique feature is the "indirect passive", often called the adversity or suffering passive.' },
      { time: 65, speaker: 'Murugun Sir', text: 'For instance: Ame ni furareta (雨に降られた). Literally: "I was rained on," implying I was inconvenienced.' },
      { time: 90, speaker: 'Murugun Sir', text: 'It conveys emotion and annoyance, which standard passives in English don\'t capture.' }
    ]
  };

  const chats: Record<string, HistoricalChat[]> = {
    'n5-particles': [
      { time: 5, sender: 'Emily Brown', message: 'Hello! Watching from London.' },
      { time: 16, sender: 'John Doe', message: 'Yes! The は/が difference is so hard. Glad we are covering this.' },
      { time: 38, sender: 'Sarah Lee', message: 'So "wa" is like "speaking of..."?' },
      { time: 58, sender: 'Aimi Suzuki', message: '私は寿司が好きです - I like sushi. Easy particle sentence!' },
      { time: 78, sender: 'John Doe', message: 'Ah! Sushi is the object, but it gets particle が. Got it.' },
      { time: 100, sender: 'Emily Brown', message: 'Thanks Sensei! Brilliant explanation.' }
    ],
    'biz-keigo': [
      { time: 5, sender: 'Kenji Suzuki', message: 'Keigo is scary for new hires in Japan.' },
      { time: 25, sender: 'Sarah Lee', message: 'Is Sonkeigo used for coworkers?' },
      { time: 55, sender: 'Bhawna Ma\'am (Sensei)', message: 'No, Sarah. For peers, normal polite forms (Desu/Masu) are fine.' },
      { time: 85, sender: 'Kenji Suzuki', message: 'Meshiagaru sounds very fancy.' },
      { time: 120, sender: 'John Doe', message: 'Downloading the PDF now, thank you.' }
    ],
    'n4-passives': [
      { time: 10, sender: 'Emily Brown', message: 'Passive verbs conjugation is confusing.' },
      { time: 45, sender: 'Kenji Suzuki', message: 'Ame ni furareta sounds poetic.' },
      { time: 70, sender: 'Aimi Suzuki', message: 'Ah, so I express my sadness about the rain with passive!' },
      { time: 95, sender: 'Emily Brown', message: 'Makes perfect sense now.' }
    ]
  };

  const activeTranscript = transcripts[activeLesson.id] || [];
  const activeChats = chats[activeLesson.id] || [];

  // Filter lessons
  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || l.course.includes(selectedCourse);
    return matchesSearch && matchesCourse;
  });

  // Handle video playback tick
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeLesson.totalTimeSeconds) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            return activeLesson.totalTimeSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeLesson, playbackSpeed]);

  const handleLessonClick = (lesson: RecordedLesson) => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveLessonId(lesson.id);
  };

  const handleTranscriptClick = (time: number) => {
    setCurrentTime(time);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Find active transcript index based on currentTime
  const getActiveTranscriptIndex = () => {
    for (let i = activeTranscript.length - 1; i >= 0; i--) {
      if (currentTime >= activeTranscript[i].time) {
        return i;
      }
    }
    return 0;
  };

  const activeTranscriptIndex = getActiveTranscriptIndex();

  // Filter chats that occurred before or at the current time
  const visibleChats = activeChats.filter(c => currentTime >= c.time);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Recorded Classes Archive</h1>
        <p>Catch up on missed classes or review completed lessons with synchronized transcripts and chat playback.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '2rem' }} className="archive-layout">
        
        {/* Left Column: Lesson Browser List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <List size={20} style={{ color: 'var(--primary)' }} />
            <span>Lessons Browser</span>
          </h3>

          {/* Search/Filters */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search archive..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', borderRadius: '20px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {['All', 'JLPT N5', 'N4', 'Business'].map(courseName => (
                <button
                  key={courseName}
                  onClick={() => setSelectedCourse(courseName)}
                  className={`btn btn-sm ${selectedCourse === courseName ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '15px' }}
                >
                  {courseName}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredLessons.map(l => {
              const isActive = l.id === activeLesson.id;
              return (
                <div
                  key={l.id}
                  onClick={() => handleLessonClick(l)}
                  className="glass-card"
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderColor: isActive ? 'var(--primary)' : 'var(--glass-border)',
                    backgroundColor: isActive ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary)' }}>{l.course}</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.1rem', lineHeight: 1.3 }}>{l.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    <span>{l.instructor}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} />
                      {l.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Player and Interactive Transcript/Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Lesson Header */}
          <div>
            <span className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Currently Playing
            </span>
            <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3, marginTop: '0.25rem' }}>{activeLesson.title}</h2>
            <p style={{ fontSize: '0.85rem' }}>{activeLesson.instructor} • {activeLesson.views} • Uploaded {activeLesson.uploadedDate}</p>
          </div>

          {/* Simulated Video Player */}
          <div className="glass-card" style={{
            backgroundColor: '#0c0a0f',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)'
          }}>
            {/* Purchase Validation Lock Overlay */}
            {!isPurchased && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(2, 12, 21, 0.88)',
                backdropFilter: 'blur(12px)',
                zIndex: 50,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', textAlign: 'center', gap: '1.25rem'
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-rose)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Lock size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recording Restricted</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    This lecture recording belongs to: <strong>{activeLesson.course}</strong>
                  </p>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                  Enroll in this course to unlock high-definition playback, sync transcript seek navigation, materials download, and historical chat logs.
                </p>
                <button
                  onClick={() => onTriggerCheckout && onTriggerCheckout({
                    id: activeCourseId,
                    title: activeLesson.course,
                    price: coursePrices[activeCourseId] || '$159'
                  })}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '20px', gap: '0.4rem', padding: '0.5rem 1.5rem' }}
                >
                  <Lock size={12} />
                  <span>Unlock Course ({coursePrices[activeCourseId] || '$159'})</span>
                </button>
              </div>
            )}
            {/* Visual Screen Cover */}
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#ffffff', position: 'relative'
            }}>
              {/* Lecture Slide Simulation */}
              <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '85%' }}>
                <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeLesson.course}
                </h4>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem', color: '#ffffff' }}>
                  {activeLesson.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                  Click Play below to run the timeline simulation.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.9rem', color: '#a5b4fc', fontFamily: 'monospace' }}>
                  <span>Time: {formatTime(currentTime)}</span>
                  <span>Speed: {playbackSpeed}x</span>
                </div>
              </div>

              {/* Big play button on screen when paused */}
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  style={{
                    position: 'absolute', width: '60px', height: '60px', borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.85)', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: 'none', transition: 'transform 0.2s ease',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Play size={24} fill="#ffffff" style={{ marginLeft: '4px' }} />
                </button>
              )}
            </div>

            {/* Video Controls Bar */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: '0.75rem 1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10
            }}>
              {/* Scrub timeline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{formatTime(currentTime)}</span>
                <input
                  type="range" min="0" max={activeLesson.totalTimeSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                  style={{ flex: 1, height: '4px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{formatTime(activeLesson.totalTimeSeconds)}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button onClick={() => setIsPlaying(!isPlaying)} style={{ color: '#ffffff', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" />}
                  </button>
                  <button onClick={() => setCurrentTime(0)} style={{ color: '#ffffff', cursor: 'pointer' }} title="Restart">
                    <RotateCw size={16} />
                  </button>
                  <Volume2 size={16} style={{ color: '#cbd5e1' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Playback speed selector */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none',
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', outline: 'none'
                    }}
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <option key={speed} value={speed} style={{ color: '#000000' }}>{speed}x</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Transcript vs Chat Playback */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="timeline-elements">
            
            {/* Transcript Panel */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '350px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: 'var(--secondary)' }} />
                <span>Interactive Transcript</span>
              </h3>
              
              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeTranscript.map((line, index) => {
                  const isActive = index === activeTranscriptIndex;
                  return (
                    <div
                      key={index}
                      onClick={() => handleTranscriptClick(line.time)}
                      style={{
                        padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 700 }}>{line.speaker}</span>
                        <span style={{ fontFamily: 'monospace' }}>{formatTime(line.time)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {line.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Playback Panel */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '350px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} style={{ color: 'var(--accent-mint)' }} />
                <span>Chat Playback</span>
              </h3>

              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {visibleChats.length > 0 ? (
                  visibleChats.map((chatMsg, idx) => (
                    <div key={idx} className="animate-fade-in" style={{ fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: 'var(--primary)' }}>{chatMsg.sender}</strong>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{formatTime(chatMsg.time)}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{chatMsg.message}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '4rem' }}>
                    Chat messages will appear here as the video timeline plays.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Materials Center */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>Lesson Attachments & Slides</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeLesson.materials.map((mat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)', fontSize: '0.85rem'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{mat.name} ({mat.size})</span>
                  <button
                    onClick={() => alert(`Downloaded file: ${mat.name}`)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '15px', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive stylesheet */}
      <style>{`
        @media (max-width: 900px) {
          .archive-layout {
            grid-template-columns: 1fr !important;
          }
          .timeline-elements {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
