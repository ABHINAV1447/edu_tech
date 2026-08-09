import { useState, useEffect, useRef } from 'react';
import { Send, Users, Mic, MicOff, Video as VideoIcon, VideoOff, Hand, Award, Edit3, FileText, CheckCircle2, Plus, Lock } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isInstructor?: boolean;
}

interface UserType {
  name: string;
  role: 'student' | 'teacher';
  instructorId?: string;
}

interface CourseType {
  id: string;
  title: string;
  price: string;
}

interface LiveClassroomProps {
  user: UserType | null;
  purchasedCourseIds?: string[];
  onTriggerCheckout?: (course: CourseType) => void;
}

export default function LiveClassroom({ user, purchasedCourseIds = [], onTriggerCheckout }: LiveClassroomProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'whiteboard'>('chat');
  
  // Load stream details set by dashboard
  const liveTitle = localStorage.getItem('skillnara_active_live_title') || 'Business Japanese: Keigo Honorifics';
  const liveCourse = localStorage.getItem('skillnara_active_live_course') || 'Business Japanese Etiquette';

  // Chat message state
  const isTeacher = user?.role === 'teacher';
  const defaultInstructorName = isTeacher ? user.name : 'Bhawna Ma\'am (Sensei)';
  const defaultInstructorInitials = isTeacher ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'BM';

  const coursePrices: Record<string, string> = {
    'jp-n5': '$149',
    'coding-fs': '$249',
    'dm-strategy': '$129',
    'biz-comm': '$159',
    'career-cert': '$189'
  };

  const courseTitles: Record<string, string> = {
    'jp-n5': 'Elementary Japanese: JLPT N5 Masterclass',
    'coding-fs': 'Full-Stack Web Development & Coding Boot Camp',
    'dm-strategy': 'Digital Marketing & Social Media Strategy',
    'biz-comm': 'Professional Business Communication & Keigo Etiquette',
    'career-cert': 'Career Certifications & Universal Skills Training'
  };

  const getCourseId = (title: string) => {
    if (title.includes('Japanese') || title.includes('JLPT') || title.includes('jp-n5')) return 'jp-n5';
    if (title.includes('Business') || title.includes('Keigo') || title.includes('biz-comm')) return 'biz-comm';
    if (title.includes('Digital') || title.includes('Marketing') || title.includes('dm-strategy')) return 'dm-strategy';
    if (title.includes('Coding') || title.includes('Web') || title.includes('coding-fs')) return 'coding-fs';
    return 'career-cert';
  };

  const activeCourseId = getCourseId(liveCourse);
  const isPurchased = purchasedCourseIds.includes(activeCourseId);

  if (!isTeacher && !isPurchased) {
    return (
      <div className="container animate-fade-in" style={{
        padding: '6rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh'
      }}>
        <div className="glass-card" style={{
          maxWidth: '520px', width: '100%', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          border: '1px solid var(--border-color)', boxShadow: 'var(--primary-glow) 0 10px 40px'
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
          }}>
            <Lock size={32} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Stream Restricted
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>
              {liveTitle}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Course: {liveCourse}
            </p>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Only students who have purchased this course can join the live classroom, interact in real-time chat, practice on the shared whiteboard, and answer quiz polls.
          </p>
          <button
            onClick={() => onTriggerCheckout && onTriggerCheckout({
              id: activeCourseId,
              title: courseTitles[activeCourseId] || liveCourse,
              price: coursePrices[activeCourseId] || '$150'
            })}
            className="btn btn-primary"
            style={{ borderRadius: '25px', gap: '0.5rem', alignSelf: 'center', padding: '0.6rem 2rem' }}
          >
            <Lock size={16} />
            <span>Unlock Course ({coursePrices[activeCourseId] || '$150'})</span>
          </button>
        </div>
      </div>
    );
  }

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: defaultInstructorName, avatar: defaultInstructorInitials, message: `Konnichiwa minna-san! Welcome to today's lecture on "${liveTitle}". Today we are practicing core language structures.`, time: '8:01 PM', isInstructor: true },
    { id: '2', sender: 'John Smith', avatar: 'JS', message: 'Good evening! Excited to learn. This topic always confuses me.', time: '8:02 PM' },
    { id: '3', sender: 'Aimi Sato', avatar: 'AS', message: 'Hello! 宜しくお願いします！ (Yoroshiku onegaishimasu)', time: '8:02 PM' },
    { id: '4', sender: 'Kenji Suzuki', avatar: 'KS', message: 'Is it true that Sonkeigo is only for customers/seniors?', time: '8:03 PM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Audio/Video simulation states
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [teacherView, setTeacherView] = useState<'slides' | 'face'>('slides');

  // Interactive Live Poll states
  const [pollQuestion, setPollQuestion] = useState('What is the humble (Kenjougo) form of the verb 食べる (to eat)?');
  const [pollOptions, setPollOptions] = useState([
    { key: 'A', text: '召し上がる (Respectful)' },
    { key: 'B', text: 'いただく (Humble - Correct)' },
    { key: 'C', text: 'たべます (Polite Standard)' }
  ]);
  const [pollCorrectKey, setPollCorrectKey] = useState('B');
  const [pollPushed, setPollPushed] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [voteCounts, setVoteCounts] = useState([15, 81, 4]); // Percentage results

  // Custom Poll Creator Form (Teacher only)
  const [customQuestion, setCustomQuestion] = useState('');
  const [customOptA, setCustomOptA] = useState('');
  const [customOptB, setCustomOptB] = useState('');
  const [customOptC, setCustomOptC] = useState('');
  const [customCorrect, setCustomCorrect] = useState('A');

  // Notes state
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('skillnara_live_notes') || 'Jot down your class notes here...\n\n- Keigo represents polite speech.\n- Sonkeigo (Respectful): Used for actions of others.\n- Kenjougo (Humble): Used for my actions.';
  });

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff9000');
  const [brushSize, setBrushSize] = useState(5);

  // Auto-save notes
  useEffect(() => {
    localStorage.setItem('skillnara_live_notes', notes);
  }, [notes]);

  // Whiteboard drawing functions
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Simulated live comments feed
  useEffect(() => {
    const simulatedComments = [
      { sender: 'John Smith', message: 'Ah, I see! So いただく is for my own actions, like eating or receiving.' },
      { sender: 'Aimi Sato', message: 'What is the Sonkeigo for "to say" (iu)?' },
      { sender: defaultInstructorName, message: 'The Sonkeigo for iu (言う) is おっしゃる (ossharu). For example: 先生がおっしゃいました (The teacher said).', isInstructor: true },
      { sender: 'Emily Brown', message: 'Osharu! Yes, I heard it in anime before.' },
      { sender: 'Kenji Suzuki', message: 'Oh, this slide is super helpful. I am saving this in my notes.' }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < simulatedComments.length) {
        const comment = simulatedComments[index];
        // Skip teacher comment if user is teacher (to avoid duplication)
        if (comment.isInstructor && isTeacher) {
          index++;
          return;
        }

        const newMsg: ChatMessage = {
          id: Date.now().toString() + index,
          sender: comment.isInstructor ? defaultInstructorName : comment.sender,
          avatar: comment.isInstructor ? defaultInstructorInitials : comment.sender.substring(0, 2),
          message: comment.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInstructor: comment.isInstructor
        };
        setMessages(prev => [...prev, newMsg]);
        index++;
      }
    }, 15000); // add a new chat comment every 15s

    return () => clearInterval(interval);
  }, [isTeacher, defaultInstructorName, defaultInstructorInitials]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user ? `${user.name} (${isTeacher ? 'Instructor' : 'You'})` : 'Guest',
      avatar: user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'GS',
      message: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: isTeacher
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputMessage;
    setInputMessage('');

    // Teacher responds to Student query after 1.8s (Only if user is a student)
    if (!isTeacher) {
      setTimeout(() => {
        let teacherReply = 'Thank you for contributing! Keep up the good work.';
        if (userQuery.toLowerCase().includes('?') || userQuery.toLowerCase().includes('how') || userQuery.toLowerCase().includes('what')) {
          teacherReply = 'Excellent question! We separate respect into Sonkeigo (elevating the listener) and Kenjougo (lowering ourselves). We will cover this in detail in the next slide.';
        } else if (userQuery.toLowerCase().includes('difficult') || userQuery.toLowerCase().includes('hard')) {
          teacherReply = 'Keigo can be challenging, but practicing these everyday dialogues makes it natural. Let\'s practice together!';
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: defaultInstructorName,
          avatar: defaultInstructorInitials,
          message: teacherReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInstructor: true
        }]);
      }, 1800);
    }
  };

  // Push new poll (Teacher only)
  const handlePushPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !customOptA.trim() || !customOptB.trim()) {
      alert('Please fill out the question and at least two options.');
      return;
    }

    setPollQuestion(customQuestion);
    setPollOptions([
      { key: 'A', text: customOptA },
      { key: 'B', text: customOptB },
      { key: 'C', text: customOptC || 'None of the above' }
    ]);
    setPollCorrectKey(customCorrect);
    setPollPushed(true);
    setQuizSubmitted(false);
    setQuizAnswer(null);

    // Simulate real-time student voting
    setVoteCounts([0, 0, 0]);
    let counts = [0, 0, 0];
    let totalVotes = 0;
    
    const interval = setInterval(() => {
      if (totalVotes < 120) {
        // Distribute votes: correct answer gets highest weight
        const rand = Math.random();
        if (rand < 0.6) {
          const index = customCorrect === 'A' ? 0 : customCorrect === 'B' ? 1 : 2;
          counts[index]++;
        } else {
          const index = Math.random() < 0.5 ? 0 : 2;
          counts[index]++;
        }
        totalVotes++;
        
        // Calculate percentages
        const sum = counts[0] + counts[1] + counts[2];
        setVoteCounts([
          Math.round((counts[0] / sum) * 100),
          Math.round((counts[1] / sum) * 100),
          Math.round((counts[2] / sum) * 100)
        ]);
      } else {
        clearInterval(interval);
      }
    }, 40);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              backgroundColor: 'var(--accent-rose)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800,
              padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              Live Broadcast
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={14} />
              243 students attending
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{liveTitle}</h2>
          <p style={{ fontSize: '0.9rem' }}>{liveCourse} • Hosted by {defaultInstructorName}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTeacherView(teacherView === 'slides' ? 'face' : 'slides')}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '20px' }}
          >
            Switch View ({teacherView === 'slides' ? 'Instructor Face' : 'Lecture Slides'})
          </button>
        </div>
      </div>

      {/* 2. Main Live Classroom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.5rem' }} className="classroom-grid">
        
        {/* Left Column: Video & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Simulated Video Player Box */}
          <div className="glass-card" style={{
            position: 'relative',
            aspectRatio: '16/9',
            backgroundColor: '#0c0a0f',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--border-color)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            
            {/* If Teacher is sharing SLIDES */}
            {teacherView === 'slides' ? (
              <div style={{
                padding: '2.5rem', color: '#ffffff', width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #07253b 0%, #02121d 100%)',
                fontFamily: 'var(--font-sans)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>SKILLNARA LIVE CLASSROOM</span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Slide 3/10</span>
                </div>

                <div style={{ margin: 'auto 0' }}>
                  <h3 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '1rem' }}>Language Structuring Slide</h3>
                  
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: '0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem',
                    fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {/* Header */}
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Concept/Word</div>
                    <div style={{ fontWeight: 700, color: '#f472b6' }}>Structure A</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-mint)' }}>Structure B</div>
                    
                    {/* Row 1 */}
                    <div>食べる / 飲む (eat / drink)</div>
                    <div style={{ color: '#f472b6' }}>召し上がる (Sonkeigo)</div>
                    <div style={{ color: '#34d399' }}>いただく (Kenjougo)</div>
                    
                    {/* Row 2 */}
                    <div>行く / 来る (go / come)</div>
                    <div style={{ color: '#f472b6' }}>いらっしゃる</div>
                    <div style={{ color: '#34d399' }}>参る (mairu)</div>

                    {/* Row 3 */}
                    <div>言う (say)</div>
                    <div style={{ color: '#f472b6' }}>おっしゃる</div>
                    <div style={{ color: '#34d399' }}>申す (mousu)</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>* Whiteboard slides are cast to all student screens in real-time.</span>
                  <span>* Active Instructor: {defaultInstructorName}</span>
                </div>
              </div>
            ) : (
              // Teacher face video stream simulation
              <div style={{
                position: 'relative', width: '100%', height: '100%',
                background: 'radial-gradient(circle, #0a2538 0%, #020c15 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {/* Simulated webcam visual */}
                <div style={{
                  width: '160px', height: '160px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontSize: '2.5rem', fontWeight: 800,
                  boxShadow: 'var(--primary-glow) 0 10px 40px'
                }}>
                  {defaultInstructorInitials}
                </div>
                <div style={{
                  position: 'absolute', bottom: '1rem', left: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.75rem', borderRadius: '4px',
                  fontSize: '0.8rem', color: '#ffffff', fontWeight: 600
                }}>
                  {defaultInstructorName} (Webcam stream)
                </div>
              </div>
            )}

            {/* Small student webcam overlay in corner (only if student) */}
            {!isTeacher && !isCamOff && (
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: '100px', height: '70px', borderRadius: '8px',
                backgroundColor: 'rgba(26,26,26,0.85)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', zIndex: 10
              }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: '#ffffff'
                }}>
                  SN
                </div>
                <div style={{
                  position: 'absolute', bottom: '2px', left: '4px',
                  fontSize: '0.55rem', color: '#ffffff'
                }}>
                  You (Student)
                </div>
              </div>
            )}

            {/* Simulated Live indicator */}
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              backgroundColor: 'rgba(239, 68, 68, 0.9)', padding: '0.25rem 0.6rem',
              borderRadius: '4px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 5
            }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'inline-block', animation: 'pulse-slow 1s infinite alternate' }}></span>
              Live Broadcast
            </div>
          </div>

          {/* Action Bar / Controls */}
          <div className="glass-card" style={{
            padding: '0.75rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`btn btn-sm ${isMuted ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  borderRadius: '50%', width: '40px', height: '40px', padding: 0,
                  border: isMuted ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
                  color: isMuted ? 'var(--accent-rose)' : 'inherit'
                }}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              
              <button
                onClick={() => setIsCamOff(!isCamOff)}
                className={`btn btn-sm ${isCamOff ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  borderRadius: '50%', width: '40px', height: '40px', padding: 0,
                  border: isCamOff ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
                  color: isCamOff ? 'var(--accent-rose)' : 'inherit'
                }}
                title={isCamOff ? 'Turn webcam on' : 'Turn webcam off'}
              >
                {isCamOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
              </button>
            </div>

            {isTeacher ? (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to end this live broadcast? All students will be disconnected.')) {
                    alert('Broadcast terminated.');
                    window.location.reload();
                  }
                }}
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: '20px',
                  backgroundColor: 'var(--accent-rose)'
                }}
              >
                <span>End Broadcast</span>
              </button>
            ) : (
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`btn btn-sm ${handRaised ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: '20px',
                  borderColor: handRaised ? 'transparent' : 'var(--border-color)',
                  backgroundColor: handRaised ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                  color: handRaised ? '#000000' : 'var(--text-primary)'
                }}
              >
                <Hand size={16} />
                <span>{handRaised ? 'Hand Raised!' : 'Raise Hand'}</span>
              </button>
            )}

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isTeacher ? 'Recording: ACTIVE (Cloud Sync)' : 'Latency: 12ms • Status: Excellent'}
            </span>
          </div>

          {/* Quick interactive Live Poll widget */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Award size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Active Classroom Poll</span>
            </div>
            
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Question: {pollQuestion}
            </h4>

            {/* If Teacher, they always see the results breakdown */}
            {isTeacher ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  backgroundColor: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid var(--accent-mint)',
                  fontSize: '0.85rem'
                }}>
                  <span>Correct Key Answer: Option <strong>{pollCorrectKey}</strong></span>
                </div>
                
                {/* Simulated Poll Results */}
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Real-Time Student Votes:</span>
                  {pollOptions.map((bar, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ width: '180px', flexShrink: 0 }}>{bar.key}) {bar.text}</span>
                      <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${voteCounts[i]}%`, height: '100%', backgroundColor: bar.key === pollCorrectKey ? 'var(--accent-mint)' : 'var(--text-muted)' }}></div>
                      </div>
                      <span style={{ width: '30px', textAlign: 'right', fontWeight: 600 }}>{voteCounts[i]}%</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setPollPushed(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ alignSelf: 'flex-start', borderRadius: '20px', marginTop: '0.5rem' }}
                >
                  Create Another Poll
                </button>
              </div>
            ) : (
              // Student View
              !quizSubmitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pollOptions.map((opt) => (
                    <label
                      key={opt.key}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1rem', border: '1px solid var(--border-color)',
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease',
                        backgroundColor: quizAnswer === opt.key ? 'var(--primary-glow)' : 'transparent',
                        borderColor: quizAnswer === opt.key ? 'var(--primary)' : 'var(--border-color)'
                      }}
                    >
                      <input
                        type="radio"
                        name="live-poll"
                        value={opt.key}
                        checked={quizAnswer === opt.key}
                        onChange={() => setQuizAnswer(opt.key)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{opt.key}) {opt.text}</span>
                    </label>
                  ))}
                  
                  <button
                    disabled={!quizAnswer}
                    onClick={() => setQuizSubmitted(true)}
                    className="btn btn-primary btn-sm"
                    style={{ alignSelf: 'flex-end', borderRadius: '20px', marginTop: '0.5rem' }}
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '8px',
                    backgroundColor: quizAnswer === pollCorrectKey ? 'rgba(52, 211, 153, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                    border: quizAnswer === pollCorrectKey ? '1px solid var(--accent-mint)' : '1px solid var(--accent-rose)',
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    <CheckCircle2 size={16} style={{ color: quizAnswer === pollCorrectKey ? 'var(--accent-mint)' : 'var(--accent-rose)' }} />
                    <span>
                      {quizAnswer === pollCorrectKey ? 'Correct answer!' : `Oops! Option ${pollCorrectKey} is the correct answer.`}
                    </span>
                  </div>

                  {/* Simulated Poll Results */}
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Class Poll Breakdown:</span>
                    {pollOptions.map((bar, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ width: '180px', flexShrink: 0 }}>{bar.key}) {bar.text}</span>
                        <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${voteCounts[i]}%`, height: '100%', backgroundColor: bar.key === pollCorrectKey ? 'var(--accent-mint)' : 'var(--text-muted)' }}></div>
                        </div>
                        <span style={{ width: '30px', textAlign: 'right', fontWeight: 600 }}>{voteCounts[i]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Chat/Notes/Whiteboard */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
          {/* Tab Selector */}
          <div className="glass-card" style={{
            padding: '0.25rem',
            display: 'flex',
            gap: '0.25rem',
            borderRadius: '12px 12px 0 0',
            borderBottom: 'none'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, borderRadius: '8px', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Users size={14} />
              <span>Live Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, borderRadius: '8px', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <FileText size={14} />
              <span>{isTeacher ? 'Lesson Plan' : 'My Notes'}</span>
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`btn btn-sm ${activeTab === 'whiteboard' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, borderRadius: '8px', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Edit3 size={14} />
              <span>Whiteboard</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="glass-card" style={{
            flex: 1,
            borderRadius: '0 0 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-secondary)',
            height: '100%'
          }}>
            
            {/* T1: Live Chat */}
            {activeTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 }}>
                {/* Message Scroll Panel */}
                <div style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  overflowY: 'auto',
                  flex: 1,
                  maxHeight: '400px'
                }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: msg.isInstructor ? 'linear-gradient(135deg, var(--secondary) 0%, #f43f5e 100%)' : 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: msg.isInstructor ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 600, fontSize: '0.75rem', flexShrink: 0
                      }}>
                        {msg.avatar}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: msg.isInstructor ? 'var(--secondary)' : 'var(--text-primary)' }}>
                            {msg.sender}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                        </div>
                        <p style={{
                          fontSize: '0.85rem', color: 'var(--text-secondary)',
                          backgroundColor: msg.isInstructor ? 'rgba(236,72,153,0.06)' : 'transparent',
                          padding: msg.isInstructor ? '0.25rem 0.5rem' : 0,
                          borderRadius: '4px'
                        }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Text Form */}
                <form onSubmit={handleSendMessage} style={{
                  padding: '1rem', borderTop: '1px solid var(--border-color)',
                  display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)'
                }}>
                  <input
                    type="text"
                    placeholder={isTeacher ? "Message the classroom..." : "Ask Sensei a question..."}
                    className="form-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    style={{ borderRadius: '20px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{
                    width: '38px', height: '38px', borderRadius: '50%', padding: 0, flexShrink: 0
                  }}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* T2: Study Notes */}
            {activeTab === 'notes' && (
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {isTeacher ? 'Write details of class schedule / objectives.' : 'Auto-saved notes. Syncs with your dashboard!'}
                </span>
                <textarea
                  className="form-input"
                  style={{
                    flex: 1, resize: 'none', fontFamily: 'monospace',
                    fontSize: '0.85rem', padding: '1rem', borderRadius: '8px',
                    height: '350px'
                  }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            )}

            {/* T3: Interactive Whiteboard */}
            {activeTab === 'whiteboard' && (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isTeacher ? 'Draw below to broadcast slides drawings to students live!' : 'Use this scratchpad to practice drawing Kanji stroke order!'}
                </span>
                
                {/* Drawing Tools */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  {['#ff9000', '#3b82f6', '#34d399', '#facc15', '#f8fafc'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%', backgroundColor: c,
                        border: color === c ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Size:</span>
                  <input
                    type="range" min="1" max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    style={{ width: '80px', accentColor: 'var(--primary)' }}
                  />
                  <button onClick={clearCanvas} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>
                    Clear
                  </button>
                </div>

                {/* Drawing Canvas */}
                <canvas
                  ref={canvasRef}
                  width="350"
                  height="280"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    backgroundColor: '#020c15',
                    borderRadius: '8px',
                    cursor: 'crosshair',
                    width: '100%',
                    height: '280px',
                    border: '1px solid var(--border-color)'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Left Column: Teacher Poll Creator panel (pushed to bottom under video when teacher is logged in and poll is not pushed) */}
        {isTeacher && !pollPushed && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
              <Plus size={16} />
              <span>Create & Push a New Quiz Poll to Students</span>
            </h3>

            <form onSubmit={handlePushPoll} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Question Text</label>
                <input
                  type="text"
                  placeholder="e.g. Which particle marks direct objects?"
                  className="form-input"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="grid-responsive">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Option A</label>
                  <input
                    type="text"
                    placeholder="e.g. は (wa)"
                    className="form-input"
                    value={customOptA}
                    onChange={(e) => setCustomOptA(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Option B</label>
                  <input
                    type="text"
                    placeholder="e.g. を (wo)"
                    className="form-input"
                    value={customOptB}
                    onChange={(e) => setCustomOptB(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Option C</label>
                  <input
                    type="text"
                    placeholder="e.g. に (ni)"
                    className="form-input"
                    value={customOptC}
                    onChange={(e) => setCustomOptC(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Correct Option:</label>
                  <select
                    className="form-input"
                    value={customCorrect}
                    onChange={(e) => setCustomCorrect(e.target.value)}
                    style={{ fontSize: '0.85rem', width: '80px', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
                  <span>Push Poll Live</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* CSS queries */}
      <style>{`
        @media (max-width: 900px) {
          .classroom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
