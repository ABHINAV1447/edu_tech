import { useState } from 'react';
import { Bot, X, Send, Sparkles, ArrowRight } from 'lucide-react';

interface CourseType {
  id: string;
  title: string;
  price: string;
}

interface SkillBotWidgetProps {
  onNavigateTab: (tab: string) => void;
  onTriggerCheckout: (course: CourseType) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  action?: {
    type: 'checkout' | 'navigate';
    target: string;
    label: string;
    courseData?: CourseType;
  };
}

export default function SkillBotWidget({ onNavigateTab, onTriggerCheckout }: SkillBotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Konnichiwa! I am SkillBot 🤖, your AI Admissions & Learning Advisor. How can I help you today?',
      time: 'Just now'
    }
  ]);

  const handleSendMessage = (customText?: string) => {
    const text = customText || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botText = 'I am here to help you choose courses, join live broadcasts, or practice skills!';
      let actionObj: ChatMessage['action'] = undefined;

      const q = text.toLowerCase();

      if (q.includes('course') || q.includes('suggest') || q.includes('recommend') || q.includes('right for me')) {
        botText = `✨ **Recommended Courses for You**:\n\n1. **JLPT N5 Japanese Masterclass** ($149) - Best for complete beginners in Japanese.\n2. **Full-Stack Web Development** ($249) - Learn HTML, React & Node.js.\n3. **Business Japanese Keigo** ($159) - Professional corporate etiquette.`;
        actionObj = {
          type: 'checkout',
          target: 'jp-n5',
          label: 'Enroll in JLPT N5 ($149)',
          courseData: { id: 'jp-n5', title: 'Elementary Japanese: JLPT N5 Masterclass', price: '$149' }
        };
      } else if (q.includes('japanese') || q.includes('jlpt') || q.includes('n5')) {
        botText = `🎌 **JLPT N5 Masterclass**:\n\nIncludes 40+ hours of live video tutoring by Sree Ma'am & Bhawna Ma'am, particle markers (は vs が), hiragana/katakana drills, and 98.7% pass rate!`;
        actionObj = {
          type: 'checkout',
          target: 'jp-n5',
          label: 'Unlock JLPT N5 Masterclass ($149)',
          courseData: { id: 'jp-n5', title: 'Elementary Japanese: JLPT N5 Masterclass', price: '$149' }
        };
      } else if (q.includes('live') || q.includes('broadcast') || q.includes('google meet') || q.includes('class')) {
        botText = `📺 **Live Google Meet Classrooms**:\n\nSkillnara runs real-time live broadcasts featuring real webcam capture, browser screen sharing, closed captions, and collaborative whiteboards!`;
        actionObj = {
          type: 'navigate',
          target: 'live',
          label: 'Go to Live Classroom'
        };
      } else if (q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('discount')) {
        botText = `💰 **Skillnara Course Pricing**:\n\n- JLPT N5 Masterclass: **$149**\n- Business Japanese Keigo: **$159**\n- Full-Stack Web Boot Camp: **$249**\n- Digital Marketing: **$129**\n\nAll courses include lifetime access to live classes & recorded archives!`;
      } else if (q.includes('recorded') || q.includes('archive') || q.includes('replay')) {
        botText = `🎥 **Recorded Archive**:\n\nMissed a live broadcast? All lectures are auto-recorded and published with interactive synchronized transcripts, attachments, and SkillBot AI Q&A!`;
        actionObj = {
          type: 'navigate',
          target: 'recorded',
          label: 'Browse Recorded Archive'
        };
      } else if (q.includes('hello') || q.includes('hi') || q.includes('konnichiwa')) {
        botText = `Konnichiwa! 😊 I can answer questions about course offerings, live class schedules, pricing, and JLPT exams. What would you like to explore?`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: actionObj
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      
      {/* Expanded SkillBot Popup Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '530px',
          backgroundColor: '#18191c',
          border: '1px solid rgba(255, 144, 0, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255, 144, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '1rem',
          color: '#ffffff',
          animation: 'fade-in 0.25s ease'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#202124',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff9000 0%, #3b82f6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
                boxShadow: '0 4px 12px rgba(255, 144, 0, 0.4)'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>SkillBot AI</h4>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#9aa0a6' }}>Skillnara AI Admissions & Support</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#9aa0a6', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Preset Chips Row */}
          <div style={{
            padding: '0.6rem 0.85rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => handleSendMessage('Suggest a course for me')}
              style={{
                background: 'rgba(255, 144, 0, 0.15)', border: '1px solid rgba(255, 144, 0, 0.3)',
                color: '#ff9000', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem',
                fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer'
              }}
            >
              🎓 Suggest Course
            </button>
            <button
              onClick={() => handleSendMessage('Tell me about Japanese JLPT N5')}
              style={{
                background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem',
                fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer'
              }}
            >
              🎌 JLPT N5 Prep
            </button>
            <button
              onClick={() => handleSendMessage('How do live classes work?')}
              style={{
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem',
                fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer'
              }}
            >
              📺 Live Broadcasts
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: msg.sender === 'user' ? 'rgba(255, 144, 0, 0.2)' : '#28292c',
                  border: msg.sender === 'user' ? '1px solid rgba(255, 144, 0, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', gap: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: msg.sender === 'user' ? '#ff9000' : '#8ab4f8' }}>
                    {msg.sender === 'user' ? 'You' : 'SkillBot AI'}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#9aa0a6' }}>{msg.time}</span>
                </div>
                <div style={{ color: '#ffffff', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                  {msg.text}
                </div>

                {/* Optional Action Button */}
                {msg.action && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                    <button
                      onClick={() => {
                        if (msg.action?.type === 'checkout' && msg.action.courseData) {
                          onTriggerCheckout(msg.action.courseData);
                        } else if (msg.action?.type === 'navigate') {
                          onNavigateTab(msg.action.target);
                        }
                      }}
                      style={{
                        backgroundColor: '#ff9000', color: '#000000', border: 'none',
                        borderRadius: '16px', padding: '0.35rem 0.85rem', fontSize: '0.75rem',
                        fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer'
                      }}
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', color: '#9aa0a6', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={13} className="animate-spin" />
                <span>SkillBot is typing...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#202124',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask SkillBot a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px', padding: '0.55rem 1rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#ff9000', color: '#000000', border: 'none',
                borderRadius: '50%', width: '38px', height: '38px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Icon Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #ff9000 0%, #e68200 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          padding: '0.7rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 8px 25px rgba(255, 144, 0, 0.45)',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'transform 0.2s ease'
        }}
      >
        <Bot size={22} />
        <span>Ask SkillBot AI 🤖</span>
      </button>

    </div>
  );
}
