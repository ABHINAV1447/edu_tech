import { useState } from 'react';
import { Video, Award, Star, Search, ChevronRight, CheckCircle2, User, Globe, ArrowRight, Play, Monitor } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  level: string;
  rating: number;
  duration: string;
  lessonsCount: number;
  description: string;
  price: string;
  imageColor: string;
}

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onEnroll: (courseId: string) => void;
  enrolledCourseIds: string[];
}

export default function LandingPage({ setActiveTab, onEnroll, enrolledCourseIds }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Language Mini-Game State
  const [gameStep, setGameStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const courses: Course[] = [
    {
      id: 'jp-n5',
      title: 'Elementary Japanese: JLPT N5 Masterclass',
      category: 'Japanese',
      instructor: 'Sree Ma\'am',
      level: 'Beginner (N5)',
      rating: 4.9,
      duration: '45 hours',
      lessonsCount: 36,
      description: 'Master Hiragana, Katakana, basic vocabulary, and standard grammar patterns to ace the JLPT N5 with Sree Ma\'am.',
      price: '$149',
      imageColor: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)' // pink
    },
    {
      id: 'coding-fs',
      title: 'Full-Stack Web Development & Coding Boot Camp',
      category: 'Coding',
      instructor: 'Murugun Sir',
      level: 'All Levels',
      rating: 4.8,
      duration: '70 hours',
      lessonsCount: 55,
      description: 'Learn HTML, CSS, JavaScript, React, Node.js, and databases. Build real-world projects and get job assistance.',
      price: '$249',
      imageColor: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)' // indigo
    },
    {
      id: 'dm-strategy',
      title: 'Digital Marketing & Social Media Strategy',
      category: 'Marketing',
      instructor: 'Simran Ma\'am',
      level: 'Intermediate',
      rating: 4.9,
      duration: '30 hours',
      lessonsCount: 24,
      description: 'Master SEO, SEM, content marketing, and brand building to skyrocket campaigns with Simran Ma\'am.',
      price: '$129',
      imageColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // emerald
    },
    {
      id: 'biz-comm',
      title: 'Professional Business Communication & Keigo Etiquette',
      category: 'Business',
      instructor: 'Bhawna Ma\'am',
      level: 'Advanced',
      rating: 4.7,
      duration: '25 hours',
      lessonsCount: 20,
      description: 'Learn business Keigo, corporate communication styles, resume building, and professional email etiquette.',
      price: '$159',
      imageColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' // amber
    },
    {
      id: 'career-cert',
      title: 'Career Certifications & Universal Skills Training',
      category: 'Certifications',
      instructor: 'Manish Sir',
      level: 'Intermediate',
      rating: 4.9,
      duration: '40 hours',
      lessonsCount: 30,
      description: 'Accelerate your career with universal skill certifications, internships preparation, and high-impact resume reviews.',
      price: '$189',
      imageColor: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' // purple
    }
  ];

  const categories = ['All', 'Japanese', 'Coding', 'Marketing', 'Business', 'Certifications'];

  const gameQuestions = [
    {
      question: 'Which character represents the Hiragana vowel "A"?',
      options: ['あ', 'い', 'う', 'え'],
      correctIndex: 0,
      explanation: 'あ is "A", い is "I", う is "U", and え is "E".'
    },
    {
      question: 'What is the polite/formal form of the verb "taberu" (to eat)?',
      options: ['たべります (taberimasu)', 'たべます (tabemasu)', 'たべるます (taberumasu)', 'たべた (tabeta)'],
      correctIndex: 1,
      explanation: 'たべる is a Ru-verb (Group 2), so we drop "ru" and add "masu" to form たべます.'
    },
    {
      question: 'What does the phrase "Yoroshiku onegaishimasu" roughly mean in a business introduction?',
      options: ['Goodbye forever', 'Thank you for the delicious meal', 'I look forward to working with you / Please treat me well', 'Congratulations on your success'],
      correctIndex: 2,
      explanation: '"Yoroshiku onegaishimasu" is a core Japanese expression used to express good intentions in relationships and business collaborations.'
    }
  ];

  const handleAnswerSubmit = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === gameQuestions[gameStep].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextGameStep = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setGameStep(gameStep + 1);
  };

  const resetGame = () => {
    setGameStep(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        padding: '5rem 0 3rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects in Background */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          zIndex: -2,
          animation: 'pulse-slow 8s infinite alternate'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)',
          zIndex: -2,
          animation: 'pulse-slow 6s infinite alternate-reverse'
        }}></div>

        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '2rem'
          }}>
            <Globe size={14} style={{ color: 'var(--primary)' }} />
            <span>India's First Skillup Centre</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.75rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Connect Your Future with <span className="gradient-text">Skillnara</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.5,
            maxWidth: '750px',
            marginInline: 'auto'
          }}>
            From school coaching to career certifications, internships to job assistance — Skillnara connects learners from India & abroad to their future through interactive live classes and archived recordings.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('dashboard')} className="btn btn-primary btn-lg">
              <span>Go to Student Dashboard</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => setActiveTab('live')} className="btn btn-secondary btn-lg" style={{ gap: '0.6rem' }}>
              <Play size={16} fill="currentColor" />
              <span>Simulate Live Class</span>
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid-3" style={{ marginTop: '5rem', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>98.7%</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>JLPT Pass Rate</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>For students using our live prep.</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>5,000+</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Active Learners</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Globally connected in study groups.</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>1-on-1</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Native Tutoring</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Feedback from professional instructors.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE COURSES */}
      <section className="container" style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Explore Our Structured Courses</h2>
          <p style={{ maxWidth: '600px' }}>
            Choose from comprehensive courses designed to take you from absolute beginner to conversationally and professionally fluent.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card" style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {/* Categories Tab */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: '20px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', minWidth: '280px', maxWidth: '100%' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search courses, instructors..."
              className="form-input"
              style={{ paddingLeft: '2.5rem', borderRadius: '50px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid-3">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <div key={course.id} className="glass-card" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  {/* Card Banner */}
                  <div style={{
                    background: course.imageColor,
                    height: '140px',
                    padding: '1.5rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}>
                    <span style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '50px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {course.level}
                    </span>
                    <h4 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {course.title}
                    </h4>
                  </div>

                  {/* Card Info */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <User size={14} />
                      <span style={{ fontWeight: 600 }}>{course.instructor}</span>
                    </div>

                    <p style={{ fontSize: '0.9rem', flex: 1 }}>{course.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                        <Star size={14} fill="currentColor" />
                        {course.rating}
                      </span>
                      <span>{course.lessonsCount} lessons</span>
                      <span style={{ color: 'var(--text-muted)' }}>{course.duration}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{course.price}</span>
                      <button
                        onClick={() => {
                          if (!isEnrolled) {
                            onEnroll(course.id);
                          }
                          setActiveTab('dashboard');
                        }}
                        className={`btn btn-sm ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ borderRadius: '20px' }}
                      >
                        {isEnrolled ? 'Go to Dashboard' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3>No courses found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try adjusting your search filters or typing another keyword.</p>
          </div>
        )}
      </section>

      {/* 3. PLATFORM CORE FEATURES */}
      <section style={{ backgroundColor: 'var(--bg-tertiary)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Engineered for Dynamic Learning</h2>
            <p style={{ maxWidth: '600px' }}>
              Unlike basic video tutorials, Skillnara offers immersive features that recreate the offline classroom environment.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'
              }}>
                <Monitor size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem' }}>Live Class Simulation</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Join live video chats, view slides drawn on the fly, participate in real-time interactive quizzes, and exchange comments with classmates.
              </p>
              <button onClick={() => setActiveTab('live')} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, justifyContent: 'flex-start', color: 'var(--primary)', fontWeight: 600 }}>
                <span>Try Simulator</span> <ChevronRight size={16} />
              </button>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--secondary) 0%, #fb7185 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'
              }}>
                <Video size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem' }}>Recorded Archive & Sync</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Missed a live lecture? Access the complete library anytime. Click on live interactive transcripts to skip straight to the topic, complete with historical chat playback.
              </p>
              <button onClick={() => setActiveTab('recorded')} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, justifyContent: 'flex-start', color: 'var(--secondary)', fontWeight: 600 }}>
                <span>Browse Archive</span> <ChevronRight size={16} />
              </button>
            </div>

            <div className="glass-card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem' }}>Personalized Dashboard</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Track your Japanese vocabulary acquisition, monitor test performance scores, schedule mock lessons, and get direct constructive feedback from teachers.
              </p>
              <button onClick={() => setActiveTab('dashboard')} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, justifyContent: 'flex-start', color: '#10b981', fontWeight: 600 }}>
                <span>Open Dashboard</span> <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE GAME / MINI-GAME */}
      <section className="container">
        <div className="glass-card" style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          overflow: 'hidden',
          borderRadius: '24px'
        }}>
          {/* Game Description */}
          <div style={{
            padding: '3.5rem',
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem',
            borderRight: '1px solid var(--border-color)'
          }}>
            <span style={{ color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
              Interact to Learn
            </span>
            <h2 style={{ fontSize: '2.25rem', lineHeight: 1.2 }}>Test Your Language Skills Right Now!</h2>
            <p>
              See our interactive platform in action. Take this quick 3-question Japanese vocabulary and grammar quiz to unlock a platform discount!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-mint)' }} />
                <span>Immediate answer explanations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-mint)' }} />
                <span>Simulated live classroom grading</span>
              </div>
            </div>
          </div>

          {/* Game Card Interface */}
          <div style={{
            padding: '3.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            {gameStep < gameQuestions.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Question Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Question {gameStep + 1} of {gameQuestions.length}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Score: {score}</span>
                </div>
                
                {/* Question title */}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {gameQuestions[gameStep].question}
                </h3>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {gameQuestions[gameStep].options.map((opt, index) => {
                    let btnColor = 'var(--bg-tertiary)';
                    let btnBorder = '1px solid var(--border-color)';
                    
                    if (isAnswered) {
                      if (index === gameQuestions[gameStep].correctIndex) {
                        btnColor = 'rgba(52, 211, 153, 0.15)'; // soft mint
                        btnBorder = '1px solid var(--accent-mint)';
                      } else if (selectedAnswer === index) {
                        btnColor = 'rgba(251, 113, 133, 0.15)'; // soft rose
                        btnBorder = '1px solid var(--accent-rose)';
                      }
                    } else if (selectedAnswer === index) {
                      btnColor = 'var(--primary-glow)';
                      btnBorder = '1px solid var(--primary)';
                    }

                    return (
                      <button
                        key={index}
                        disabled={isAnswered}
                        onClick={() => handleAnswerSubmit(index)}
                        className="form-input"
                        style={{
                          textAlign: 'left',
                          backgroundColor: btnColor,
                          border: btnBorder,
                          borderRadius: '12px',
                          cursor: isAnswered ? 'default' : 'pointer',
                          fontWeight: 500,
                          transition: 'transform 0.1s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{opt}</span>
                        {isAnswered && index === gameQuestions[gameStep].correctIndex && (
                          <span style={{ color: 'var(--accent-mint)', fontSize: '0.8rem', fontWeight: 600 }}>Correct</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation / Footer */}
                {isAnswered && (
                  <div className="animate-fade-in" style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary)',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Sensei Explains:</strong>
                    <p style={{ fontSize: '0.85rem' }}>{gameQuestions[gameStep].explanation}</p>
                  </div>
                )}

                {/* Submit/Next button */}
                {isAnswered && (
                  <button
                    onClick={handleNextGameStep}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-end', borderRadius: '20px' }}
                  >
                    <span>{gameStep === gameQuestions.length - 1 ? 'See Results' : 'Next Question'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-mint)'
                }}>
                  <Award size={36} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem' }}>Quiz Completed!</h3>
                  <p style={{ marginTop: '0.25rem' }}>You scored {score} out of {gameQuestions.length}!</p>
                </div>
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  width: '100%'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coupon Code unlocked</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                    SKILLNARA10
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Enter this code at checkout to get 10% off any course.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={resetGame} className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>
                    Retry Quiz
                  </button>
                  <button onClick={() => setActiveTab('dashboard')} className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
                    Go study on Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4.5 MEET THE GENIUSES BEHIND SKILLNARA */}
      <section className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Meet the Geniuses Behind Skillnara</h2>
          <p style={{ maxWidth: '500px' }}>
            Learn from industry veterans and certified educators dedicated to your upskilling success.
          </p>
        </div>

        <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
          {[
            { name: "Sree Ma'am", spec: "Japanese & Languages", initials: "SM", color: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)' },
            { name: "Murugun Sir", spec: "Coding & Full-Stack", initials: "MS", color: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)' },
            { name: "Simran Ma'am", spec: "Digital Marketing", initials: "SM", color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
            { name: "Manish Sir", spec: "Career Certifications", initials: "MS", color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
            { name: "Bhawna Ma'am", spec: "Business English & Keigo", initials: "BM", color: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }
          ].map((instructor, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: instructor.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', fontWeight: 800, fontSize: '1.5rem',
                boxShadow: 'var(--card-shadow)'
              }}>
                {instructor.initials}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{instructor.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{instructor.spec}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 1024px) {
            .grid-5 {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .grid-5 {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .grid-5 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>What Our Students Say</h2>
          <p style={{ maxWidth: '500px' }}>
            Thousands of students have successfully achieved native conversation speed and passed official certification tests.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.1rem', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "The live classroom simulation is so realistic! I can chat with other learners, and the whiteboard allows me to see Kanji stroke orders clearly. The synchronized recordings helped me review N3 lessons before my JLPT exam."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                JD
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Jonathan Doe</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passed JLPT N3</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.1rem', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "Being able to double-click on a sentence in the recorded video transcript and immediately jump to that timestamp saved me so much time. I don't have to scroll through two hours of lectures just to review polite business vocabulary."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                SL
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Sarah Lee</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Japanese Student</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.1rem', color: 'var(--accent-gold)' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "I love the interactive quizzes. The explanation given by Tanaka Sensei right inside the quiz is gold. It feels like she's sitting right next to you, giving feedback. The dashboard layout is incredibly clean and runs super fast."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                KT
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Kenji Takahashi</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Introductory Student</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dynamic style for grid layout inside landing page */}
      <style>{`
        @media (max-width: 900px) {
          .glass-card {
            grid-template-columns: 1fr !important;
          }
          .glass-card div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--border-color) !important;
          }
        }
      `}</style>
    </div>
  );
}
