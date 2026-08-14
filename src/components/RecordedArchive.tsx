import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Volume2, Download, Search, Clock, MessageSquare, List, Lock, Bot, Send, Sparkles } from 'lucide-react';

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

interface AiChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function RecordedArchive({ recordedLessons, purchasedCourseIds = [], onTriggerCheckout }: RecordedArchiveProps) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonId, setActiveLessonId] = useState<string>(recordedLessons[0]?.id || '');
  const [bottomTab, setBottomTab] = useState<'transcript' | 'chat' | 'bot'>('bot');

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

  // SkillBot AI Tutor States
  const [aiChatMessages, setAiChatMessages] = useState<AiChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I'm SkillBot 🤖, your AI tutor for "${activeLesson?.title || 'this lesson'}". Ask me anything about grammar rules, code snippets, or lesson summaries!`,
      time: 'Just now'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Reset AI conversation when switching lessons
  useEffect(() => {
    setAiChatMessages([
      {
        id: '1',
        sender: 'bot',
        text: `Hello! I'm SkillBot 🤖, your AI tutor for "${activeLesson?.title}". Feel free to ask me to explain concepts, generate quick practice questions, or clarify lesson notes!`,
        time: 'Just now'
      }
    ]);
  }, [activeLessonId]);

  const handleSendAiQuestion = (questionText?: string) => {
    const textToSend = questionText || aiInput;
    if (!textToSend.trim()) return;

    const userMsg: AiChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    if (!questionText) setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let botAnswer = `Great question! In "${activeLesson.title}", the instructor highlights how to apply these rules in practical scenarios.`;

      const q = textToSend.toLowerCase();
      if (q.includes('difference') || q.includes('sonkeigo') || q.includes('kenjougo') || q.includes('keigo')) {
        botAnswer = `💡 **Keigo Breakdown**:\n\n1. **Sonkeigo (尊敬語 - Respectful)**: Used when speaking about the actions of clients, seniors, or superiors (e.g. 召し上がる - meshiagarimasu).\n2. **Kenjougo (謙譲語 - Humble)**: Used when speaking humbly about your own actions to show respect to senior clients (e.g. いただく - itadaku).`;
      } else if (q.includes('summary') || q.includes('key takeaways')) {
        botAnswer = `📌 **Key Takeaways for ${activeLesson.title}**:\n\n- Mastered essential terminology and practical application.\n- Reviewed common student mistakes and core structures.\n- Download the attached PDF slides below to practice the homework exercise.`;
      } else if (q.includes('practice') || q.includes('quiz') || q.includes('question')) {
        botAnswer = `❓ **Quick Practice Question**:\nWhat is the humble (Kenjougo) verb form of "to eat / drink"?\n\nA) 召し上がる\nB) いただく (Correct)\nC) たべます`;
      } else if (q.includes('particle') || q.includes('wa') || q.includes('ga')) {
        botAnswer = `✨ **Particle Wa vs Ga**:\n\n- **は (Wa)**: Marks the overarching TOPIC of the sentence ("As for X...").\n- **が (Ga)**: Highlights the specific SUBJECT or focus of the predicate.`;
      }

      const botMsg: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAiChatMessages(prev => [...prev, botMsg]);
      setIsAiThinking(false);
    }, 900);
  };

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

  const historicalChats: Record<string, HistoricalChat[]> = {
    'n5-particles': [
      { time: 5, sender: 'Aimi S.', message: 'Konbanwa teacher! 🎉' },
      { time: 18, sender: 'John D.', message: 'Ah, I always mix up wa and ga!' },
      { time: 40, sender: 'Kenji M.', message: 'So wa is for background topic?' },
      { time: 60, sender: 'Aimi S.', message: 'Watashi wa ramen ga suki desu! 🍜' },
      { time: 80, sender: 'Priya K.', message: 'Makes total sense now, thank you!' }
    ],
    'biz-keigo': [
      { time: 10, sender: 'Rohan P.', message: 'Keigo is essential for Japanese corporate interviews.' },
      { time: 30, sender: 'Sarah M.', message: 'Is Sonkeigo used when addressing clients?' },
      { time: 55, sender: 'Rohan P.', message: 'Yes! Always show respect to clients.' },
      { time: 85, sender: 'Aimi S.', message: 'Meshiagaru is a classic example.' }
    ]
  };

  const activeTranscript = transcripts[activeLesson.id] || [
    { time: 0, speaker: activeLesson.instructor, text: `Welcome to ${activeLesson.title}.` },
    { time: 15, speaker: activeLesson.instructor, text: `In this recorded session, we cover core principles of ${activeLesson.course}.` },
    { time: 45, speaker: activeLesson.instructor, text: `Review the attached notes below to complete your practice assignment.` }
  ];

  const activeHistoricalChats = historicalChats[activeLesson.id] || [
    { time: 5, sender: 'Student Learner', message: 'Hello teacher! Great class.' },
    { time: 20, sender: 'Tech Enthusiast', message: 'Clear explanation.' }
  ];

  // Playback timer effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= activeLesson.totalTimeSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeLesson.totalTimeSeconds, playbackSpeed]);

  const handlePlayPause = () => {
    if (!isPurchased) {
      onTriggerCheckout && onTriggerCheckout({
        id: activeCourseId,
        title: activeLesson.course,
        price: coursePrices[activeCourseId] || '$159'
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const handleLessonClick = (lesson: RecordedLesson) => {
    setActiveLessonId(lesson.id);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleTranscriptClick = (seconds: number) => {
    if (!isPurchased) return;
    setCurrentTime(seconds);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTranscriptIndex = activeTranscript.reduce((acc, line, idx) => {
    if (currentTime >= line.time) return idx;
    return acc;
  }, 0);

  const visibleChats = activeHistoricalChats.filter(c => currentTime >= c.time);

  const filteredLessons = lessons.filter(l => {
    const matchesCourse = selectedCourse === 'All' || l.course.includes(selectedCourse);
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        <span className="gradient-text" style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          On-Demand Learning Library
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
          Recorded Live Archives & AI Assistant
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
          Replay previous live classes, navigate synced interactive transcripts, download lesson resources, and chat with SkillBot AI.
        </p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
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

        {/* Right Column: Player and Interactive Tabs */}
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
                  Enroll in this course to unlock high-definition playback, sync transcript seek navigation, materials download, and SkillBot AI tutor support.
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
                  <span>/</span>
                  <span>{formatTime(activeLesson.totalTimeSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Video Player Controls Bar */}
            <div style={{
              padding: '0.75rem 1.25rem', backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex', flexDirection: 'column', gap: '0.5rem'
            }}>
              {/* Seek Slider Bar */}
              <input
                type="range"
                min={0}
                max={activeLesson.totalTimeSeconds}
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={handlePlayPause}
                    style={{
                      background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={() => setCurrentTime(0)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    title="Restart"
                  >
                    <RotateCw size={16} />
                  </button>
                  <Volume2 size={16} style={{ color: '#cbd5e1' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

          {/* Interactive Navigation Tabs: Transcript | Chat | SkillBot AI */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => setBottomTab('bot')}
              className={`btn btn-sm ${bottomTab === 'bot' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '20px', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Bot size={15} />
              <span>SkillBot AI Tutor</span>
            </button>
            <button
              onClick={() => setBottomTab('transcript')}
              className={`btn btn-sm ${bottomTab === 'transcript' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '20px', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Clock size={15} />
              <span>Interactive Transcript</span>
            </button>
            <button
              onClick={() => setBottomTab('chat')}
              className={`btn btn-sm ${bottomTab === 'chat' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '20px', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <MessageSquare size={15} />
              <span>Chat Replay</span>
            </button>
          </div>

          {/* TAB CONTENT PANEL */}
          {bottomTab === 'bot' && (
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '360px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>SkillBot AI Tutor</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ask questions about "{activeLesson.title}"</span>
                  </div>
                </div>

                {/* AI Preset Chips */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleSendAiQuestion('Explain Sonkeigo vs Kenjougo rules')}
                    style={{ background: 'var(--primary-glow)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Grammar Rules
                  </button>
                  <button
                    onClick={() => handleSendAiQuestion('Give key takeaways')}
                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--border-color)', color: 'var(--accent-mint)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Key Points
                  </button>
                  <button
                    onClick={() => handleSendAiQuestion('Give 1 practice question')}
                    style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--border-color)', color: 'var(--accent-gold)', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Practice Quiz
                  </button>
                </div>
              </div>

              {/* Chat Log Body */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                {aiChatMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      backgroundColor: msg.sender === 'user' ? 'var(--primary-glow)' : 'var(--bg-tertiary)',
                      border: msg.sender === 'user' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: msg.sender === 'user' ? 'var(--primary)' : 'var(--secondary)' }}>
                        {msg.sender === 'user' ? 'You' : 'SkillBot AI'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} className="animate-spin" />
                    <span>SkillBot is analyzing lesson content...</span>
                  </div>
                )}
              </div>

              {/* AI Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiQuestion();
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  placeholder="Ask SkillBot a question about this lesson..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, borderRadius: '20px', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {bottomTab === 'transcript' && (
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '360px' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          )}

          {bottomTab === 'chat' && (
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '360px' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} style={{ color: 'var(--accent-mint)' }} />
                <span>Historical Chat Replay</span>
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
          )}

          {/* Lesson Materials Center */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        }
      `}</style>
    </div>
  );
}
