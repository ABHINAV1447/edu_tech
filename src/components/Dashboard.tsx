import { useState } from 'react';
import { Calendar, Clock, BookOpen, Tv, CheckCircle, Plus, AlertCircle, PlayCircle, Award, Video, Lock } from 'lucide-react';
import TeacherDashboard from './TeacherDashboard';

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastLesson: string;
  color: string;
}

interface CourseType {
  id: string;
  title: string;
  price: string;
}

interface User {
  name: string;
  role: 'student' | 'teacher';
  instructorId?: string;
}

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  enrolledCourseIds: string[];
  user: User;
  recordedLessons: any[];
  onUploadRecording: (lesson: any) => void;
  onUpdateRecording: (lesson: any) => void;
  onDeleteRecording: (id: string) => void;
  onTriggerCheckout: (course: CourseType) => void;
}

export default function Dashboard({
  setActiveTab,
  enrolledCourseIds,
  user,
  recordedLessons,
  onUploadRecording,
  onUpdateRecording,
  onDeleteRecording,
  onTriggerCheckout
}: DashboardProps) {
  if (user.role === 'teacher') {
    return (
      <TeacherDashboard
        instructorName={user.name}
        recordedLessons={recordedLessons}
        onUploadRecording={onUploadRecording}
        onUpdateRecording={onUpdateRecording}
        onDeleteRecording={onDeleteRecording}
        setActiveTab={setActiveTab}
      />
    );
  }
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [studyHours, setStudyHours] = useState(4.5);
  const [newLogHours, setNewLogHours] = useState('');
  
  // Enrolled courses details
  const allCoursesData: Record<string, EnrolledCourse> = {
    'jp-n5': {
      id: 'jp-n5',
      title: 'Elementary Japanese: JLPT N5 Masterclass',
      instructor: 'Sree Ma\'am',
      progress: 45,
      completedLessons: 16,
      totalLessons: 36,
      lastLesson: 'Lesson 17: Expressing Desires with ~tai',
      color: 'var(--secondary)'
    },
    'coding-fs': {
      id: 'coding-fs',
      title: 'Full-Stack Web Development & Coding Boot Camp',
      instructor: 'Murugun Sir',
      progress: 10,
      completedLessons: 4,
      totalLessons: 40,
      lastLesson: 'Lesson 5: Flexbox & Responsive Layouts',
      color: 'var(--primary)'
    },
    'dm-strategy': {
      id: 'dm-strategy',
      title: 'Digital Marketing & Social Media Strategy',
      instructor: 'Simran Ma\'am',
      progress: 85,
      completedLessons: 12,
      totalLessons: 15,
      lastLesson: 'Lesson 13: Google Analytics Setup',
      color: 'var(--accent-mint)'
    },
    'biz-comm': {
      id: 'biz-comm',
      title: 'Professional Business Communication & Keigo Etiquette',
      instructor: 'Bhawna Ma\'am',
      progress: 25,
      completedLessons: 7,
      totalLessons: 28,
      lastLesson: 'Lesson 8: Professional Emails & Keigo',
      color: 'var(--accent-gold)'
    },
    'career-cert': {
      id: 'career-cert',
      title: 'Career Certifications & Universal Skills Training',
      instructor: 'Manish Sir',
      progress: 5,
      completedLessons: 2,
      totalLessons: 48,
      lastLesson: 'Lesson 3: High-Impact Resume reviews',
      color: '#a855f7'
    }
  };

  const coursePrices: Record<string, string> = {
    'jp-n5': '$149',
    'coding-fs': '$249',
    'dm-strategy': '$129',
    'biz-comm': '$159',
    'career-cert': '$189'
  };

  const enrolledCourses = enrolledCourseIds.map(id => allCoursesData[id]).filter(Boolean);
  const availableCourses = Object.keys(allCoursesData)
    .filter(id => !enrolledCourseIds.includes(id))
    .map(id => allCoursesData[id]);

  const getCourseId = (courseTitle: string) => {
    if (courseTitle.includes('Japanese') || courseTitle.includes('JLPT')) return 'jp-n5';
    if (courseTitle.includes('Business') || courseTitle.includes('Keigo')) return 'biz-comm';
    if (courseTitle.includes('Digital') || courseTitle.includes('Marketing')) return 'dm-strategy';
    if (courseTitle.includes('Coding') || courseTitle.includes('Web')) return 'coding-fs';
    return 'career-cert';
  };

  const isLiveActive = localStorage.getItem('skillnara_live_class_active') === 'true';
  const activeTitle = localStorage.getItem('skillnara_active_live_title') || 'Business Communication & Resume Building Practice';
  const activeCourse = localStorage.getItem('skillnara_active_live_course') || 'Business Communication & Keigo';

  const getInstructorForCourse = (courseName: string) => {
    if (courseName.includes('Japanese') || courseName.includes('JLPT') || courseName.includes('jp-n5')) return 'Sree Ma\'am';
    if (courseName.includes('Coding') || courseName.includes('Web') || courseName.includes('coding-fs')) return 'Murugun Sir';
    if (courseName.includes('Marketing') || courseName.includes('Digital') || courseName.includes('dm-strategy')) return 'Simran Ma\'am';
    if (courseName.includes('Business') || courseName.includes('Keigo') || courseName.includes('biz-comm')) return 'Bhawna Ma\'am';
    return 'Manish Sir';
  };

  const upcomingClasses = [];
  
  if (isLiveActive) {
    upcomingClasses.push({
      id: 'active-live-session',
      title: activeTitle,
      course: activeCourse,
      time: 'Live Now!',
      instructor: getInstructorForCourse(activeCourse),
      active: true
    });
  }

  upcomingClasses.push(
    {
      id: 'live-class-1',
      title: 'Business Communication & Resume Building Practice',
      course: 'Business Communication & Keigo',
      time: 'Today, 8:00 PM',
      instructor: 'Bhawna Ma\'am',
      active: false
    },
    {
      id: 'live-class-2',
      title: 'JLPT N5 Vocabulary drill & Particles Review',
      course: 'Elementary Japanese: JLPT N5',
      time: 'Tomorrow, 3:00 PM',
      instructor: 'Sree Ma\'am',
      active: false
    },
    {
      id: 'live-class-3',
      title: 'Google Ads Search Campaign Setup',
      course: 'Digital Marketing & Strategy',
      time: 'Aug 12, 10:00 AM',
      instructor: 'Simran Ma\'am',
      active: false
    }
  );

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(newLogHours);
    if (!isNaN(hours) && hours > 0) {
      setStudyHours(prev => Math.min(prev + hours, 50));
      setNewLogHours('');
    }
  };

  const progressPercentage = Math.min(Math.round((studyHours / weeklyGoal) * 100), 100);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Welcome Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Okaeri, Student Nara! 👋</h1>
          <p>Ready to level up your Japanese today? Here is your study status dashboard.</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          borderRadius: '50px',
          backgroundColor: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          color: 'var(--accent-mint)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle size={16} />
          <span>Continuous Streak: 12 Days!</span>
        </div>
      </div>

      {/* Progress & Goals Overview Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="grid-responsive">
        
        {/* Weekly Goal Progress */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} style={{ color: 'var(--primary)' }} />
              <span>Weekly Study Target</span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Goal: {weeklyGoal} hours</span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="goal-status-container">
            {/* Visual Progress ring simulation */}
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="var(--border-color)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="var(--primary)" strokeWidth="8" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                fontSize: '1.15rem', fontWeight: 800, textAlign: 'center'
              }}>
                {progressPercentage}%
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {studyHours.toFixed(1)} / {weeklyGoal} Hours Logged
              </h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                You're just {(weeklyGoal - studyHours) > 0 ? (weeklyGoal - studyHours).toFixed(1) : 0} hours away from hitting your weekly language goal! Keep it up!
              </p>
            </div>
          </div>

          {/* Goal adjustment & Logging form */}
          <form onSubmit={handleLogHours} style={{
            display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <input
                type="number"
                step="0.5"
                placeholder="Log Study Hours (e.g. 1.5)"
                className="form-input"
                value={newLogHours}
                onChange={(e) => setNewLogHours(e.target.value)}
                style={{ borderRadius: '25px', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '25px' }}>
              <Plus size={16} />
              <span>Log Session</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={() => setWeeklyGoal(prev => Math.max(prev - 2, 2))}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              >
                - Target
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(prev => Math.min(prev + 2, 40))}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              >
                + Target
              </button>
            </div>
          </form>
        </div>

        {/* Level & Badge */}
        <div className="glass-card gradient-bg" style={{
          padding: '2rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background shapes */}
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%'
          }}></div>
          
          <div style={{ zIndex: 1 }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '50px'
            }}>
              Level Milestone
            </span>
            <h3 style={{ fontSize: '1.75rem', color: '#ffffff', marginTop: '0.75rem', fontWeight: 800 }}>Rising Samurai</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Next level: **Shogun Scholar** after completing 10 more lessons.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1, marginTop: '2rem' }}>
            <Award size={36} style={{ color: 'var(--accent-gold)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Achievements</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Hiragana Master, Streak King</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses & Live Schedule Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }} className="grid-responsive">
        
        {/* Enrolled Courses list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} style={{ color: 'var(--secondary)' }} />
            <span>My Active Courses</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div key={course.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{course.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor}</span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{course.progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: course.color, borderRadius: '10px' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>Recent:</strong> {course.lastLesson}
                    </span>
                    <button
                      onClick={() => setActiveTab('recorded')}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.25rem 0.5rem', color: 'var(--primary)', fontWeight: 600 }}
                    >
                      Resume
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <AlertCircle size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                <h4>No courses enrolled yet</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Visit the Home page to browse our catalog and enroll in a class.
                </p>
                <button onClick={() => setActiveTab('landing')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem', borderRadius: '20px' }}>
                  Browse Course Catalog
                </button>
              </div>
            )}
          </div>

          {/* Unlock New Certificates section */}
          {availableCourses.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={20} style={{ color: 'var(--primary)' }} />
                <span>Explore Other Skillnara Courses</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {availableCourses.map((course) => (
                  <div key={course.id} className="glass-card" style={{
                    padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderLeft: '4px solid var(--border-color)', opacity: 0.85, flexWrap: 'wrap', gap: '1rem'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{course.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor}</span>
                    </div>
                    <button
                      onClick={() => onTriggerCheckout({ id: course.id, title: course.title, price: coursePrices[course.id] })}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '20px', gap: '0.4rem', flexShrink: 0 }}
                    >
                      <Lock size={12} style={{ color: 'var(--primary)' }} />
                      <span>Unlock ({coursePrices[course.id]})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Classes Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={22} style={{ color: 'var(--accent-mint)' }} />
            <span>Upcoming Classes</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingClasses.map((session) => {
              const sessionCourseId = getCourseId(session.course);
              const isPurchased = enrolledCourseIds.includes(sessionCourseId);
              
              return (
                <div key={session.id} className="glass-card" style={{
                  padding: '1.25rem',
                  borderLeft: session.active ? '4px solid var(--accent-rose)' : '1px solid var(--border-color)',
                  backgroundColor: session.active ? 'var(--bg-secondary)' : 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{session.title}</h4>
                        {session.active && (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 800, color: '#ffffff',
                            backgroundColor: 'var(--accent-rose)', padding: '0.1rem 0.4rem', borderRadius: '4px',
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                          }}>
                            Live Now
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session.course} • {session.instructor}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} />
                      {session.time}
                    </span>
                    
                    {session.active ? (
                      isPurchased ? (
                        <button
                          onClick={() => setActiveTab('live')}
                          className="btn btn-primary btn-sm gradient-glow"
                          style={{
                            padding: '0.4rem 1rem',
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--accent-rose)',
                            borderRadius: '20px'
                          }}
                        >
                          <Tv size={14} />
                          <span>Enter Class</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const cData = allCoursesData[sessionCourseId];
                            if (cData) {
                              onTriggerCheckout({
                                id: sessionCourseId,
                                title: cData.title,
                                price: coursePrices[sessionCourseId]
                              });
                            }
                          }}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '0.4rem 1rem',
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--accent-rose)',
                            color: 'var(--accent-rose)',
                            borderRadius: '20px',
                            gap: '0.3rem'
                          }}
                        >
                          <Lock size={12} />
                          <span>Unlock Course to Join</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => alert(`Added to Calendar: ${session.title}`)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '20px' }}
                      >
                        Set Alert
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Recording highlight */}
      <div className="glass-card grid-responsive" style={{
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Picked for You: N5 Particle Particle particles (~wa, ~ga, ~wo)</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Struggling with subject and topic markers? Sensei Aiko breaks down the confusing difference between は (wa) and が (ga) using diagrams and real dialogues.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={() => setActiveTab('recorded')} className="btn btn-secondary btn-sm" style={{ borderRadius: '25px', gap: '0.5rem' }}>
              <PlayCircle size={16} />
              <span>Watch Recording</span>
            </button>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.85rem' }}>Download Lesson Slides</button>
          </div>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '12px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
            zIndex: 1
          }}></div>
          <Video size={48} style={{ color: 'var(--primary)', zIndex: 2 }} />
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @media (max-width: 900px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .goal-status-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
