import { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Mic, MicOff, Video as VideoIcon, Video, VideoOff, Hand, Award, 
  Lock, Monitor, Disc, Info, MessageSquare, PhoneOff, 
  Copy, Pin, Smile, LayoutGrid, X, Check, Search, Tv, Volume2, Presentation, Play
} from 'lucide-react';

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
  role: 'student' | 'teacher' | 'admin';
  instructorId?: string;
}

interface CourseType {
  id: string;
  title: string;
  price: string;
}

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

interface LiveClassroomProps {
  user: UserType | null;
  purchasedCourseIds?: string[];
  onTriggerCheckout?: (course: CourseType) => void;
  onUploadRecording?: (lesson: RecordedLesson) => void;
  setNavigationTab?: (tab: string) => void;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

export default function LiveClassroom({ user, purchasedCourseIds = [], onTriggerCheckout, onUploadRecording, setNavigationTab }: LiveClassroomProps) {
  // Navigation & Side Drawer states
  const [sidePanelTab, setSidePanelTab] = useState<'chat' | 'people' | 'info' | 'activities' | null>('chat');
  const [stageMode, setStageMode] = useState<'presentation' | 'grid' | 'spotlight'>('grid');
  
  // Load stream details set by dashboard
  const liveTitle = localStorage.getItem('skillnara_active_live_title') || 'Business Japanese: Keigo Honorifics';
  const liveCourse = localStorage.getItem('skillnara_active_live_course') || 'Business Japanese Etiquette';
  const meetingCode = 'skn-jp-keigo';
  const meetingUrl = `https://meet.google.com/skn-jp-keigo`;

  // User details
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

  const [isLiveActiveState, setIsLiveActiveState] = useState(() => {
    return localStorage.getItem('skillnara_live_class_active') === 'true';
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsLiveActiveState(localStorage.getItem('skillnara_live_class_active') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Audio/Video & MediaStream states
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [copyToast, setCopyToast] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [pinnedUser, setPinnedUser] = useState<string | null>(null);

  // Real Webcam MediaStream refs
  const [hasWebcamStream, setHasWebcamStream] = useState(false);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);

  // Screen Share & Presentation Slide states
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPresentingSlides, setIsPresentingSlides] = useState(false);
  const isAnyScreenOrSlideShared = isScreenSharing || isPresentingSlides;

  const [hasRealStream, setHasRealStream] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showIvsModal, setShowIvsModal] = useState(false);

  // Form states to publish recording
  const [publishDescription, setPublishDescription] = useState(`Recorded live lecture covering "${liveTitle}". Key discussions included language structures, interactive quizzes, and student whiteboard activities.`);

  // Real Screen Sharing MediaStream refs
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  // Attach webcam MediaStream when element mounts
  useEffect(() => {
    if (!isCamOff && webcamVideoRef.current && webcamStreamRef.current) {
      webcamVideoRef.current.srcObject = webcamStreamRef.current;
    }
  }, [isCamOff, hasWebcamStream, stageMode, isAnyScreenOrSlideShared]);

  // Attach screen share MediaStream when element mounts
  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing, hasRealStream, stageMode, isAnyScreenOrSlideShared]);

  const handleToggleCamera = async () => {
    if (!isCamOff) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }
      setHasWebcamStream(false);
      setIsCamOff(true);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          webcamStreamRef.current = stream;
          setHasWebcamStream(true);
          setIsCamOff(false);
        } else {
          setIsCamOff(false);
        }
      } catch (err) {
        console.warn('Webcam camera access error or permission denied:', err);
        setIsCamOff(false);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setHasRealStream(false);
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
          screenStreamRef.current = stream;
          setHasRealStream(true);
          setIsScreenSharing(true);
          setIsPresentingSlides(false);

          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.onended = () => {
              if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
                screenStreamRef.current = null;
              }
              setHasRealStream(false);
              setIsScreenSharing(false);
            };
          }
        } else {
          setIsScreenSharing(true);
          setIsPresentingSlides(false);
        }
      } catch (err) {
        console.warn('Screen share display media cancelled or unavailable:', err);
        setIsScreenSharing(true);
        setIsPresentingSlides(false);
      }
    }
  };

  // Recording Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Interactive Live Poll states
  const [pollQuestion] = useState('What is the humble (Kenjougo) form of the verb 食べる (to eat)?');
  const [pollOptions] = useState([
    { key: 'A', text: '召し上がる (Respectful)' },
    { key: 'B', text: 'いただく (Humble - Correct)' },
    { key: 'C', text: 'たべます (Polite Standard)' }
  ]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff9000');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
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

  // Chat message state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: defaultInstructorName, avatar: defaultInstructorInitials, message: `Konnichiwa minna-san! Welcome to today's lecture on "${liveTitle}". Today we are practicing core language structures.`, time: '8:01 PM', isInstructor: true },
    { id: '2', sender: 'John Smith', avatar: 'JS', message: 'Good evening! Excited to learn. This topic always confuses me.', time: '8:02 PM' },
    { id: '3', sender: 'Aimi Sato', avatar: 'AS', message: 'Hello! 宜しくお願いします！ (Yoroshiku onegaishimasu)', time: '8:02 PM' },
    { id: '4', sender: 'Kenji Suzuki', avatar: 'KS', message: 'Is it true that Sonkeigo is only for customers/seniors?', time: '8:03 PM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Live Captions Subtitles array simulation
  const captionSubtitles = [
    `${defaultInstructorName}: "Konnichiwa minna-san! Welcome to Business Japanese Keigo masterclass."`,
    `${defaultInstructorName}: "Let's review the humble Kenjougo form of 食べる (itadaku)..."`,
    `${defaultInstructorName}: "Kenjougo is used when speaking humbly about your own actions to express respect to senior clients."`,
    `${defaultInstructorName}: "For example: 本日お電話を差し上げました (I called you today)."`
  ];
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const captionInterval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % captionSubtitles.length);
    }, 6000);
    return () => clearInterval(captionInterval);
  }, [captionSubtitles.length]);

  // Floating Emoji Reaction Trigger
  const triggerEmoji = (emoji: string) => {
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.floor(Math.random() * 50) + 25
    };
    setFloatingReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2200);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user ? user.name : 'Guest Learner',
      avatar: user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'GL',
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: isTeacher
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const handleConfirmPublishRecording = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUploadRecording) {
      onUploadRecording({
        id: `rec-${Date.now()}`,
        title: liveTitle,
        course: liveCourse,
        instructor: defaultInstructorName,
        duration: formatDuration(recordingSeconds),
        totalTimeSeconds: recordingSeconds,
        uploadedDate: 'Just now',
        views: '1',
        description: publishDescription,
        materials: [{ name: 'Lesson_Notes.pdf', size: '2.4 MB' }]
      });
    }
    setShowPublishModal(false);
    setRecordingSeconds(0);
    alert(`Lecture recording "${liveTitle}" published to Recorded Archive!`);
  };

  // Participant list for Google Meet People tab
  const participants = [
    { name: defaultInstructorName, role: 'Instructor (Host)', avatar: defaultInstructorInitials, isHost: true, isMuted: false, hand: false },
    { name: user ? `${user.name} (You)` : 'You', role: isTeacher ? 'Host' : 'Student', avatar: user ? user.name.substring(0, 2).toUpperCase() : 'SN', isHost: isTeacher, isMuted, hand: handRaised },
    { name: 'Aimi Sato', role: 'Student', avatar: 'AS', isHost: false, isMuted: true, hand: true },
    { name: 'John Smith', role: 'Student', avatar: 'JS', isHost: false, isMuted: true, hand: false },
    { name: 'Kenji Suzuki', role: 'Student', avatar: 'KS', isHost: false, isMuted: false, hand: false },
    { name: 'Emily Brown', role: 'Student', avatar: 'EB', isHost: false, isMuted: true, hand: false },
    { name: 'Rohan Sharma', role: 'Student', avatar: 'RS', isHost: false, isMuted: true, hand: false },
    { name: 'Priya Patel', role: 'Student', avatar: 'PP', isHost: false, isMuted: true, hand: false }
  ];

  const filteredParticipants = participants.filter(p => p.name.toLowerCase().includes(peopleSearch.toLowerCase()));

  if (!isLiveActiveState) {
    return (
      <div className="container animate-fade-in" style={{
        padding: '6rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh'
      }}>
        <div className="glass-card" style={{
          maxWidth: '540px', width: '100%', padding: '3.5rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          border: '1px solid var(--border-color)', boxShadow: 'var(--primary-glow) 0 10px 40px'
        }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
          }}>
            <Tv size={36} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isTeacher ? 'Broadcast Concluded' : 'Waiting For Instructor'}
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.5rem' }}>
              No Active Live Classroom
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {isTeacher 
              ? 'The live broadcast has been ended. You can start a new live class anytime from your teacher dashboard.'
              : 'There are currently no active live broadcasts. Instructors will start live classes according to their schedules. Once started, you can join directly from your dashboard or this page.'
            }
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {isTeacher ? (
              <button
                onClick={() => setNavigationTab && setNavigationTab('dashboard')}
                className="btn btn-primary"
                style={{ borderRadius: '25px', padding: '0.65rem 1.8rem', fontSize: '0.85rem' }}
              >
                Go to Teacher Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => setNavigationTab && setNavigationTab('dashboard')}
                  className="btn btn-secondary"
                  style={{ borderRadius: '25px', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                >
                  Check Schedule
                </button>
                <button
                  onClick={() => setNavigationTab && setNavigationTab('recorded')}
                  className="btn btn-primary"
                  style={{ borderRadius: '25px', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                >
                  Browse Recorded Archive
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 70px)',
      backgroundColor: '#18191c',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }} className="google-meet-viewport">
      
      {/* Toast Notification */}
      {copyToast && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#323232', color: '#ffffff', padding: '0.6rem 1.25rem',
          borderRadius: '25px', fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Check size={16} color="#10b981" />
          <span>Meeting link copied to clipboard</span>
        </div>
      )}

      {/* Publish Recording Modal */}
      {showPublishModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#202124', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Publish Recorded Lecture</h3>
            <p style={{ fontSize: '0.85rem', color: '#9aa0a6' }}>
              Recorded session duration: <strong>{formatDuration(recordingSeconds)}</strong>. Save this lecture to the Recorded Archive so students can re-watch it anytime.
            </p>
            <form onSubmit={handleConfirmPublishRecording} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8ab4f8', fontWeight: 600 }}>Lecture Summary</label>
                <textarea
                  rows={3}
                  value={publishDescription}
                  onChange={(e) => setPublishDescription(e.target.value)}
                  style={{
                    width: '100%', marginTop: '0.35rem', backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.65rem',
                    color: '#ffffff', fontSize: '0.85rem', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem'
                  }}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#8ab4f8', color: '#202124', border: 'none',
                    fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.85rem'
                  }}
                >
                  Publish to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Amazon IVS OBS Stream Key Modal */}
      {showIvsModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#18191c', border: '1px solid #ff9000',
            borderRadius: '16px', padding: '2rem', maxWidth: '540px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Video size={22} style={{ color: '#ff9000' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Amazon IVS Stream & OBS Settings</h3>
              </div>
              <button onClick={() => setShowIvsModal(false)} style={{ background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#9aa0a6', margin: 0 }}>
              Use OBS Studio or any RTMP software to broadcast directly to Amazon IVS Low-Latency stream engine.
            </p>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div>
                <label style={{ color: '#ff9000', fontWeight: 700 }}>RTMPS Ingestion Endpoint</label>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontFamily: 'monospace', color: '#ffffff', marginTop: '0.2rem' }}>
                  rtmps://a1b2c3d4e5f6.global-contribute.live-video.net:443/app/
                </div>
              </div>

              <div>
                <label style={{ color: '#ff9000', fontWeight: 700 }}>Stream Key</label>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontFamily: 'monospace', color: '#34d399', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>sk_us-east-1_skillnara_live_key_98412</span>
                  <button onClick={() => alert('Stream key copied to clipboard!')} style={{ background: 'none', border: 'none', color: '#ff9000', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                    Copy Key
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: '#9aa0a6', fontWeight: 700 }}>S3 Auto-Record Destination</label>
                <div style={{ color: '#e8eaed', marginTop: '0.2rem' }}>
                  <code>s3://skillnara-ivs-recordings-us-east-1/</code> (Auto-VOD enabled)
                </div>
              </div>
            </div>

            <button onClick={() => setShowIvsModal(false)} className="btn btn-primary" style={{ borderRadius: '20px', justifyContent: 'center' }}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 1. Google Meet Pixel-Perfect Top Header Bar */}
      <header style={{
        height: '60px',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e1f22',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        zIndex: 50
      }}>
        {/* Left: Meeting Title & Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              backgroundColor: '#ea4335', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800,
              padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              LIVE
            </span>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>{liveTitle}</h1>
          </div>

          <div style={{ height: '18px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

          <button
            onClick={copyMeetingLink}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px', padding: '0.3rem 0.85rem', color: '#e8eaed',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer'
            }}
            title="Click to copy meeting link"
          >
            <span>{meetingCode}</span>
            <Copy size={13} />
          </button>
        </div>

        {/* Right: Presentation / Call Status, Layout & Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Amazon IVS OBS Stream Key Button */}
          {isTeacher && (
            <button
              onClick={() => setShowIvsModal(true)}
              style={{
                backgroundColor: 'rgba(255, 144, 0, 0.15)', border: '1px solid rgba(255, 144, 0, 0.4)',
                color: '#ff9000', borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.78rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
              }}
            >
              <Video size={14} />
              <span>Amazon IVS Stream Key</span>
            </button>
          )}

          {/* Quick Present Action Banner Button */}
          {isTeacher && !isAnyScreenOrSlideShared && (
            <button
              onClick={() => setIsPresentingSlides(true)}
              style={{
                backgroundColor: 'rgba(138, 180, 248, 0.15)', border: '1px solid rgba(138, 180, 248, 0.4)',
                color: '#8ab4f8', borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.78rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
              }}
            >
              <Presentation size={14} />
              <span>Present Lecture Slides</span>
            </button>
          )}

          {isAnyScreenOrSlideShared && (
            <button
              onClick={() => {
                setIsPresentingSlides(false);
                if (isScreenSharing) handleToggleScreenShare();
              }}
              style={{
                backgroundColor: 'rgba(234, 67, 53, 0.2)', border: '1px solid rgba(234, 67, 53, 0.5)',
                color: '#ea4335', borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.78rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
              }}
            >
              <X size={14} />
              <span>Stop Presenting</span>
            </button>
          )}

          {isRecording && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              backgroundColor: 'rgba(234, 67, 53, 0.15)', border: '1px solid rgba(234, 67, 53, 0.4)',
              color: '#ea4335', padding: '0.25rem 0.7rem', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 700
            }}>
              <span style={{ width: '7px', height: '7px', backgroundColor: '#ea4335', borderRadius: '50%', animation: 'pulse-slow 0.8s infinite alternate' }} />
              <span>REC {formatDuration(recordingSeconds)}</span>
            </div>
          )}

          {/* Layout Mode Picker */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '3px' }}>
            <button
              onClick={() => setStageMode('grid')}
              style={{
                background: stageMode === 'grid' ? '#8ab4f8' : 'transparent',
                color: stageMode === 'grid' ? '#202124' : '#e8eaed',
                border: 'none', borderRadius: '16px', padding: '0.3rem 0.8rem',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'
              }}
            >
              <LayoutGrid size={13} />
              Grid
            </button>
            <button
              onClick={() => setStageMode('presentation')}
              style={{
                background: stageMode === 'presentation' ? '#8ab4f8' : 'transparent',
                color: stageMode === 'presentation' ? '#202124' : '#e8eaed',
                border: 'none', borderRadius: '16px', padding: '0.3rem 0.8rem',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Sidebar
            </button>
            <button
              onClick={() => setStageMode('spotlight')}
              style={{
                background: stageMode === 'spotlight' ? '#8ab4f8' : 'transparent',
                color: stageMode === 'spotlight' ? '#202124' : '#e8eaed',
                border: 'none', borderRadius: '16px', padding: '0.3rem 0.8rem',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Spotlight
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#9aa0a6', fontWeight: 500 }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {/* 2. Main Body Stage & Collapsible Google Meet Side Drawer */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* Main Stage View Area */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* Floating Reaction Emojis Container */}
          <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, height: '240px', pointerEvents: 'none', zIndex: 100 }}>
            {floatingReactions.map((reaction) => (
              <div
                key={reaction.id}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: `${reaction.left}%`,
                  fontSize: '2.5rem',
                  animation: 'floatUp 2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
                }}
              >
                {reaction.emoji}
              </div>
            ))}
          </div>

          {/* DYNAMIC CASE A: SCREEN SHARE OR SLIDES PRESENTATION IS ACTIVE */}
          {isAnyScreenOrSlideShared ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', gap: '1.25rem' }}>
              
              {/* Main Center Shared Screen / Presentation Stage */}
              <div style={{
                flex: 1,
                backgroundColor: '#1e1f22',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
              }}>
                {isScreenSharing ? (
                  hasRealStream && screenStreamRef.current ? (
                    <video
                      ref={screenVideoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{
                      padding: '2.5rem', color: '#ffffff', width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      background: 'linear-gradient(135deg, #1e1e1e 0%, #0d0d0d 100%)',
                      fontFamily: 'monospace', fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', color: '#8ab4f8' }}>
                        <span>Screen Share: {defaultInstructorName}'s Workspace</span>
                        <span>VS Code - skillnara_workspace</span>
                      </div>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#f8f8f2', lineHeight: '1.5', margin: 'auto 0', paddingLeft: '1rem' }}>
                        <p style={{ color: '#75715e' }}>// Live Keigo Code Playground</p>
                        <p><span style={{ color: '#f92672' }}>import</span> React, {'{'} useState {'}'} <span style={{ color: '#f92672' }}>from</span> <span style={{ color: '#e6db74' }}>'react'</span>;</p>
                        <p><span style={{ color: '#66d9ef' }}>function</span> <span style={{ color: '#a6e22e' }}>KeigoEtiquette</span>() {'{'}</p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#66d9ef' }}>const</span> [status, setStatus] = <span style={{ color: '#a6e22e' }}>useState</span>(<span style={{ color: '#e6db74' }}>"polite"</span>);</p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#f92672' }}>return</span> (</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: '#f92672' }}>div</span> className=<span style={{ color: '#e6db74' }}>"keigo-container"</span>&gt;</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: '#f92672' }}>h3</span>&gt;Humble Verb: いただく (itadaku) - {'{'}status{'}'}&lt;/<span style={{ color: '#f92672' }}>h3</span>&gt;</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span style={{ color: '#f92672' }}>div</span>&gt;</p>
                        <p>&nbsp;&nbsp;);</p>
                        <p>{'}'}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#75715e', fontSize: '0.75rem' }}>
                        <span>Ln 12, Col 24</span>
                        <span>TypeScript React</span>
                      </div>
                    </div>
                  )
                ) : (
                  // Lecture Slide Presentation View
                  <div style={{
                    padding: '2.5rem', color: '#ffffff', width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#8ab4f8', fontWeight: 600, letterSpacing: '0.05em' }}>SKILLNARA PRESENTATION</span>
                      <span style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>Slide 3 of 10</span>
                    </div>

                    <div style={{ margin: 'auto 0' }}>
                      <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 700 }}>Language Structuring Masterclass</h2>
                      
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: '0.75rem',
                        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.25rem',
                        fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.08)'
                      }}>
                        <div style={{ fontWeight: 700, color: '#8ab4f8' }}>Concept / Verb</div>
                        <div style={{ fontWeight: 700, color: '#f472b6' }}>Structure A (Sonkeigo)</div>
                        <div style={{ fontWeight: 700, color: '#34d399' }}>Structure B (Kenjougo)</div>
                        
                        <div>食べる / 飲む (eat / drink)</div>
                        <div style={{ color: '#f472b6' }}>召し上がる</div>
                        <div style={{ color: '#34d399' }}>いただく (itadaku)</div>
                        
                        <div>行く / 来る (go / come)</div>
                        <div style={{ color: '#f472b6' }}>いらっしゃる</div>
                        <div style={{ color: '#34d399' }}>参る (mairu)</div>

                        <div>言う (say)</div>
                        <div style={{ color: '#f472b6' }}>おっしゃる</div>
                        <div style={{ color: '#34d399' }}>申す (mousu)</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#9aa0a6', display: 'flex', justifyContent: 'space-between' }}>
                      <span>* Live slides cast to all student screens</span>
                      <span>Presenter: {defaultInstructorName}</span>
                    </div>
                  </div>
                )}

                {/* Subtitles / Closed Captions Overlay Banner */}
                {showCaptions && (
                  <div style={{
                    position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    padding: '0.6rem 1.4rem', borderRadius: '8px',
                    color: '#ffffff', fontSize: '0.9rem', maxWidth: '82%', textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 30, border: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    <span>{captionSubtitles[captionIndex]}</span>
                  </div>
                )}
              </div>

              {/* Right Vertical Tile Strip (Google Meet Side Video Cards) */}
              <div style={{
                width: '230px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                overflowY: 'auto'
              }}>
                {/* 1. Instructor Video Tile */}
                <div style={{
                  aspectRatio: '16/9',
                  backgroundColor: '#28292c',
                  borderRadius: '12px',
                  border: pinnedUser === 'instructor' ? '2px solid #8ab4f8' : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  {!isCamOff && isTeacher && hasWebcamStream && webcamStreamRef.current ? (
                    <video ref={webcamVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 700, fontSize: '1rem'
                    }}>
                      {defaultInstructorInitials}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute', bottom: '8px', left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px',
                    fontSize: '0.7rem', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'
                  }}>
                    <span>{defaultInstructorName}</span>
                  </div>

                  <button
                    onClick={() => setPinnedUser(pinnedUser === 'instructor' ? null : 'instructor')}
                    style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                      width: '24px', height: '24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Pin to main screen"
                  >
                    <Pin size={12} />
                  </button>

                  <div style={{
                    position: 'absolute', bottom: '8px', right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Volume2 size={12} color="#34a853" />
                  </div>
                </div>

                {/* 2. Student (You) Video Tile */}
                <div style={{
                  aspectRatio: '16/9',
                  backgroundColor: '#28292c',
                  borderRadius: '12px',
                  border: pinnedUser === 'you' ? '2px solid #8ab4f8' : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  {!isCamOff && !isTeacher && hasWebcamStream && webcamStreamRef.current ? (
                    <video ref={webcamVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 700, fontSize: '0.95rem'
                    }}>
                      SN
                    </div>
                  )}

                  <div style={{
                    position: 'absolute', bottom: '8px', left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px',
                    fontSize: '0.7rem', color: '#ffffff', fontWeight: 600
                  }}>
                    You {isCamOff ? '(Cam Off)' : ''}
                  </div>

                  <div style={{
                    position: 'absolute', bottom: '8px', right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px', borderRadius: '50%'
                  }}>
                    {isMuted ? <MicOff size={12} color="#ea4335" /> : <Mic size={12} color="#34a853" />}
                  </div>
                </div>

                {/* 3. Peer Student Tile: Aimi Sato */}
                <div style={{
                  aspectRatio: '16/9', backgroundColor: '#28292c', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#ec4899', color: '#ffffff', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                  }}>
                    AS
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '8px', left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px',
                    fontSize: '0.7rem', color: '#ffffff'
                  }}>
                    Aimi Sato
                  </div>
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px', borderRadius: '50%' }}>
                    <MicOff size={12} color="#ea4335" />
                  </div>
                </div>

                {/* 4. Peer Student Tile: Kenji Suzuki */}
                <div style={{
                  aspectRatio: '16/9', backgroundColor: '#28292c', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#f59e0b', color: '#ffffff', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                  }}>
                    KS
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '8px', left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px',
                    fontSize: '0.7rem', color: '#ffffff'
                  }}>
                    Kenji Suzuki
                  </div>
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px', borderRadius: '50%' }}>
                    <Mic size={12} color="#34a853" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            
            /* DYNAMIC CASE B: DEFAULT GOOGLE MEET PARTICIPANT CALL GRID VIEW (WHEN NO SCREEN IS SHARED) */
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              
              {/* Meeting Call Header Bar Banner */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.5rem 1rem', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9aa0a6' }}>
                  <Users size={16} color="#8ab4f8" />
                  <span>Call Active • Joined Participants ({participants.length})</span>
                </div>
                {isTeacher && (
                  <button
                    onClick={() => setIsPresentingSlides(true)}
                    style={{
                      backgroundColor: 'rgba(138, 180, 248, 0.15)', border: '1px solid rgba(138, 180, 248, 0.3)',
                      color: '#8ab4f8', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.78rem',
                      fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
                    }}
                  >
                    <Play size={13} />
                    <span>Present Lecture Slides</span>
                  </button>
                )}
              </div>

              {/* Joined Participants Video Grid (Fills Stage cleanly like Google Meet) */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem'
              }}>
                {participants.slice(0, 6).map((p, i) => (
                  <div key={i} style={{
                    backgroundColor: '#28292c', borderRadius: '16px',
                    border: p.isHost ? '2px solid #8ab4f8' : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}>
                    {p.isHost && hasWebcamStream && webcamStreamRef.current ? (
                      <video ref={webcamVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: p.isHost ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ffffff', fontWeight: 700, fontSize: '1.4rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        {p.avatar}
                      </div>
                    )}

                    <div style={{
                      position: 'absolute', bottom: '12px', left: '14px',
                      backgroundColor: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '6px',
                      fontSize: '0.8rem', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}>
                      <span>{p.name}</span>
                      {p.isHost && <span style={{ fontSize: '0.75rem' }}>👑</span>}
                    </div>

                    <div style={{
                      position: 'absolute', top: '12px', right: '14px',
                      backgroundColor: 'rgba(0,0,0,0.65)', padding: '6px', borderRadius: '50%'
                    }}>
                      {p.isMuted ? <MicOff size={15} color="#ea4335" /> : <Mic size={15} color="#34a853" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtitles / Closed Captions Overlay Banner in Call View */}
              {showCaptions && (
                <div style={{
                  position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                  padding: '0.6rem 1.4rem', borderRadius: '8px',
                  color: '#ffffff', fontSize: '0.9rem', maxWidth: '82%', textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 30, border: '1px solid rgba(255,255,255,0.12)'
                }}>
                  <span>{captionSubtitles[captionIndex]}</span>
                </div>
              )}

            </div>
          )}

        </div>

        {/* 3. Google Meet Collapsible Right Side Panel Drawer */}
        {sidePanelTab && (
          <aside style={{
            width: '360px',
            backgroundColor: '#1e1f22',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40
          }}>
            {/* Side Panel Header */}
            <div style={{
              height: '60px', padding: '0 1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: 0, textTransform: 'capitalize' }}>
                {sidePanelTab === 'chat' && 'In-call Messages'}
                {sidePanelTab === 'people' && 'People'}
                {sidePanelTab === 'activities' && 'Activities & Polls'}
                {sidePanelTab === 'info' && 'Meeting Details'}
              </h3>
              <button
                onClick={() => setSidePanelTab(null)}
                style={{ background: 'transparent', border: 'none', color: '#9aa0a6', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Side Panel Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              
              {/* CHAT TAB */}
              {sidePanelTab === 'chat' && (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#9aa0a6', textAlign: 'center' }}>
                      Messages can be seen only by people in the call and are deleted when the call ends.
                    </div>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: msg.isInstructor ? '#8ab4f8' : '#e8eaed' }}>
                            {msg.sender} {msg.isInstructor ? '👑' : ''}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#9aa0a6' }}>{msg.time}</span>
                        </div>
                        <div style={{
                          backgroundColor: msg.isInstructor ? 'rgba(138, 180, 248, 0.1)' : 'rgba(255,255,255,0.06)',
                          padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#ffffff',
                          border: msg.isInstructor ? '1px solid rgba(138, 180, 248, 0.2)' : 'none'
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Send a message to everyone"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      style={{
                        flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '25px', padding: '0.65rem 1rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#8ab4f8', color: '#202124', border: 'none',
                        borderRadius: '50%', width: '38px', height: '38px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* PEOPLE TAB */}
              {sidePanelTab === 'people' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9aa0a6' }} />
                    <input
                      type="text"
                      placeholder="Search for people"
                      value={peopleSearch}
                      onChange={(e) => setPeopleSearch(e.target.value)}
                      style={{
                        width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px', padding: '0.55rem 0.75rem 0.55rem 2.25rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    IN MEETING ({participants.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredParticipants.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: p.isHost ? '#8ab4f8' : 'rgba(255,255,255,0.15)',
                            color: p.isHost ? '#202124' : '#ffffff', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                          }}>
                            {p.avatar}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: p.isHost ? 600 : 400 }}>
                              {p.name} {p.isHost && '👑'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#9aa0a6' }}>{p.role}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {p.hand && <Hand size={14} color="#fbbc04" />}
                          {p.isMuted ? <MicOff size={14} color="#ea4335" /> : <Mic size={14} color="#34a853" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVITIES & WHITEBOARD TAB */}
              {sidePanelTab === 'activities' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Whiteboard Tool */}
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Collaborative Whiteboard</span>
                      <button onClick={clearCanvas} style={{ background: 'transparent', border: 'none', color: '#ea4335', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
                    </div>
                    
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{
                        backgroundColor: '#000000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'crosshair', width: '100%'
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                      {['#ff9000', '#3b82f6', '#10b981', '#ec4899', '#ffffff'].map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          style={{
                            width: '20px', height: '20px', borderRadius: '50%', backgroundColor: c,
                            border: color === c ? '2px solid #ffffff' : 'none', cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Polls Component */}
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>Live Class Poll</div>
                    <p style={{ fontSize: '0.8rem', color: '#e8eaed', marginBottom: '0.75rem' }}>{pollQuestion}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {pollOptions.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setQuizAnswer(opt.key)}
                          style={{
                            textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px',
                            backgroundColor: quizAnswer === opt.key ? 'rgba(138,180,248,0.2)' : 'rgba(255,255,255,0.06)',
                            border: quizAnswer === opt.key ? '1px solid #8ab4f8' : '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff', fontSize: '0.8rem', cursor: 'pointer'
                          }}
                        >
                          {opt.key}. {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* MEETING DETAILS TAB */}
              {sidePanelTab === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9aa0a6', fontWeight: 600 }}>JOINING INFO</span>
                    <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0.25rem 0' }}>{meetingUrl}</p>
                    <button
                      onClick={copyMeetingLink}
                      style={{
                        backgroundColor: 'rgba(138, 180, 248, 0.1)', border: '1px solid rgba(138, 180, 248, 0.3)',
                        borderRadius: '20px', padding: '0.4rem 1rem', color: '#8ab4f8', fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginTop: '0.5rem'
                      }}
                    >
                      <Copy size={14} />
                      <span>Copy joining info</span>
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9aa0a6', fontWeight: 600 }}>COURSE ATTACHMENT</span>
                    <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0.25rem 0' }}>{liveCourse}</p>
                    <span style={{ fontSize: '0.75rem', color: '#34a853' }}>Verified Enrollment Active</span>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* 4. Google Meet Bottom Floating Control Bar */}
      <footer style={{
        height: '76px',
        backgroundColor: '#1e1f22',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Left: Meeting Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
          <span>{meetingCode}</span>
        </div>

        {/* Center: Google Meet Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          
          {/* Microphone */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: isMuted ? '#ea4335' : 'rgba(255,255,255,0.12)',
              border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer'
            }}
            title={isMuted ? 'Turn on microphone' : 'Turn off microphone'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Camera */}
          <button
            onClick={handleToggleCamera}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: isCamOff ? '#ea4335' : 'rgba(255,255,255,0.12)',
              border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer'
            }}
            title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isCamOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
          </button>

          {/* Captions (CC) */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: showCaptions ? '#8ab4f8' : 'rgba(255,255,255,0.12)',
              color: showCaptions ? '#202124' : '#ffffff',
              border: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem'
            }}
            title="Turn on closed captions"
          >
            CC
          </button>

          {/* Emoji Reactions Palette Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: showEmojiPicker ? '#8ab4f8' : 'rgba(255,255,255,0.12)',
                color: showEmojiPicker ? '#202124' : '#ffffff',
                border: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer'
              }}
              title="Send a reaction"
            >
              <Smile size={20} />
            </button>

            {/* Emoji Reactions Popup Bar */}
            {showEmojiPicker && (
              <div style={{
                position: 'absolute', bottom: '55px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#303134', padding: '0.5rem 0.75rem', borderRadius: '30px',
                display: 'flex', gap: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                {['💖', '👏', '👍', '🎉', '😂', '🔥'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      triggerEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    style={{
                      background: 'transparent', border: 'none', fontSize: '1.35rem',
                      cursor: 'pointer', padding: '4px', transition: 'transform 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Present Screen / Stop Presenting Toggle */}
          {isTeacher && (
            <button
              onClick={handleToggleScreenShare}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: isScreenSharing ? '#8ab4f8' : 'rgba(255,255,255,0.12)',
                color: isScreenSharing ? '#202124' : '#ffffff',
                border: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer'
              }}
              title={isScreenSharing ? 'Stop presenting screen' : 'Present screen now'}
            >
              <Monitor size={20} />
            </button>
          )}

          {/* Record Lecture (Instructor Only) */}
          {isTeacher && (
            <button
              onClick={() => {
                if (isRecording) {
                  setIsRecording(false);
                  setShowPublishModal(true);
                } else {
                  setRecordingSeconds(0);
                  setIsRecording(true);
                }
              }}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: isRecording ? '#ea4335' : 'rgba(255,255,255,0.12)',
                color: isRecording ? '#ffffff' : 'inherit',
                border: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer'
              }}
              title={isRecording ? 'Stop recording lecture' : 'Record lecture'}
            >
              <Disc size={20} />
            </button>
          )}

          {/* Raise Hand */}
          <button
            onClick={() => setHandRaised(!handRaised)}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: handRaised ? '#fbbc04' : 'rgba(255,255,255,0.12)',
              color: handRaised ? '#202124' : '#ffffff',
              border: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer'
            }}
            title={handRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand size={20} />
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              if (confirm('Leave this live classroom session?')) {
                localStorage.setItem('skillnara_live_class_active', 'false');
                setIsLiveActiveState(false);
              }
            }}
            style={{
              width: '56px', height: '44px', borderRadius: '25px',
              backgroundColor: '#ea4335', border: 'none', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', marginLeft: '0.5rem'
            }}
            title="Leave call"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        {/* Right: Side Panel Drawer Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setSidePanelTab(sidePanelTab === 'info' ? null : 'info')}
            style={{
              background: sidePanelTab === 'info' ? 'rgba(138,180,248,0.2)' : 'transparent',
              color: sidePanelTab === 'info' ? '#8ab4f8' : '#9aa0a6',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Meeting details"
          >
            <Info size={20} />
          </button>

          <button
            onClick={() => setSidePanelTab(sidePanelTab === 'people' ? null : 'people')}
            style={{
              background: sidePanelTab === 'people' ? 'rgba(138,180,248,0.2)' : 'transparent',
              color: sidePanelTab === 'people' ? '#8ab4f8' : '#9aa0a6',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              position: 'relative'
            }}
            title="Show everyone"
          >
            <Users size={20} />
            <span style={{
              position: 'absolute', top: '4px', right: '4px', backgroundColor: '#8ab4f8',
              color: '#202124', fontSize: '0.6rem', fontWeight: 800, padding: '1px 4px', borderRadius: '8px'
            }}>
              8
            </span>
          </button>

          <button
            onClick={() => setSidePanelTab(sidePanelTab === 'chat' ? null : 'chat')}
            style={{
              background: sidePanelTab === 'chat' ? 'rgba(138,180,248,0.2)' : 'transparent',
              color: sidePanelTab === 'chat' ? '#8ab4f8' : '#9aa0a6',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Chat with everyone"
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={() => setSidePanelTab(sidePanelTab === 'activities' ? null : 'activities')}
            style={{
              background: sidePanelTab === 'activities' ? 'rgba(138,180,248,0.2)' : 'transparent',
              color: sidePanelTab === 'activities' ? '#8ab4f8' : '#9aa0a6',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Activities"
          >
            <Award size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
