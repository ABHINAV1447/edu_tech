import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LiveClassroom from './components/LiveClassroom';
import RecordedArchive from './components/RecordedArchive';
import Login from './components/Login';
import CheckoutModal from './components/CheckoutModal';
import AboutUs from './components/AboutUs';
import './App.css';

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

const DEFAULT_LESSONS: RecordedLesson[] = [
  {
    id: 'n5-particles',
    title: 'Topic Markers: Master the Difference Between は (wa) and が (ga)',
    course: 'JLPT N5 Masterclass',
    instructor: 'Sree Ma\'am',
    duration: '01:50',
    totalTimeSeconds: 110,
    uploadedDate: 'Aug 5, 2026',
    views: '1,420 views',
    description: 'Understanding topic versus subject markers is the first major hurdle for Japanese learners. In this lecture, Sree Ma\'am uses daily examples to clarify は and が.',
    materials: [
      { name: 'N5_Particles_Lesson_Slides.pdf', size: '2.4 MB' },
      { name: 'Wa_vs_Ga_Practice_Worksheet.pdf', size: '1.1 MB' },
      { name: 'Vocabulary_List_Lesson_5.xlsx', size: '420 KB' }
    ]
  },
  {
    id: 'biz-keigo',
    title: 'Intro to Business Japanese: Honorifics & Sonkeigo Verbs',
    course: 'Business Japanese Etiquette',
    instructor: 'Bhawna Ma\'am',
    duration: '02:30',
    totalTimeSeconds: 150,
    uploadedDate: 'Aug 8, 2026',
    views: '840 views',
    description: 'Learn the fundamentals of professional respect in Japanese business culture. We explore Sonkeigo prefixes and core irregular polite verbs with Bhawna Ma\'am.',
    materials: [
      { name: 'Business_Japanese_Keigo_Introduction.pdf', size: '3.1 MB' },
      { name: 'Irregular_Honorifics_CheatSheet.pdf', size: '850 KB' }
    ]
  },
  {
    id: 'n4-passives',
    title: 'Intermediate Grammar: Direct & Indirect Passives (~reru / ~rareru)',
    course: 'JLPT N4 Accelerator',
    instructor: 'Murugun Sir',
    duration: '01:40',
    totalTimeSeconds: 100,
    uploadedDate: 'Aug 2, 2026',
    views: '980 views',
    description: 'Passives in Japanese carry nuance (like suffering passive). Murugun Sir details how to construct direct and indirect passives properly.',
    materials: [
      { name: 'N4_Passive_Formations_Grid.pdf', size: '1.8 MB' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // User Authentication State
  const [user, setUser] = useState<UserType | null>(() => {
    const savedUser = localStorage.getItem('skillnara_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Recorded Lessons State
  const [recordedLessons, setRecordedLessons] = useState<RecordedLesson[]>(() => {
    const savedLessons = localStorage.getItem('skillnara_lessons');
    return savedLessons ? JSON.parse(savedLessons) : DEFAULT_LESSONS;
  });

  // Course Purchases State (Student Nara starts with N5 Japanese purchased)
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(() => {
    const savedPurchased = localStorage.getItem('skillnara_purchased_courses');
    return savedPurchased ? JSON.parse(savedPurchased) : ['jp-n5'];
  });

  // Checkout Modal State
  const [checkoutCourse, setCheckoutCourse] = useState<CourseType | null>(null);

  // Persist User State
  useEffect(() => {
    if (user) {
      localStorage.setItem('skillnara_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skillnara_user');
    }
  }, [user]);

  // Persist Lessons State
  useEffect(() => {
    localStorage.setItem('skillnara_lessons', JSON.stringify(recordedLessons));
  }, [recordedLessons]);

  // Persist Purchases State
  useEffect(() => {
    localStorage.setItem('skillnara_purchased_courses', JSON.stringify(purchasedCourseIds));
  }, [purchasedCourseIds]);

  const handlePurchaseCourse = (courseId: string) => {
    if (!purchasedCourseIds.includes(courseId)) {
      setPurchasedCourseIds(prev => [...prev, courseId]);
    }
  };

  const handleUploadRecording = (newLesson: RecordedLesson) => {
    setRecordedLessons(prev => [newLesson, ...prev]);
  };

  const handleUpdateRecording = (updatedLesson: RecordedLesson) => {
    setRecordedLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
  };

  const handleDeleteRecording = (id: string) => {
    setRecordedLessons(prev => prev.filter(l => l.id !== id));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  const renderContent = () => {
    // Landing page is public
    if (activeTab === 'landing') {
      return (
        <LandingPage
          setActiveTab={setActiveTab}
          onEnroll={(courseId) => {
            const coursePrices: Record<string, string> = {
              'jp-n5': '$149',
              'coding-fs': '$249',
              'dm-strategy': '$129',
              'biz-comm': '$159',
              'career-cert': '$189'
            };
            const courseNames: Record<string, string> = {
              'jp-n5': 'Elementary Japanese: JLPT N5 Masterclass',
              'coding-fs': 'Full-Stack Web Development & Coding Boot Camp',
              'dm-strategy': 'Digital Marketing & Social Media Strategy',
              'biz-comm': 'Professional Business Communication & Keigo Etiquette',
              'career-cert': 'Career Certifications & Universal Skills Training'
            };
            if (!user) {
              setActiveTab('dashboard'); // Redirect to login
            } else {
              setCheckoutCourse({
                id: courseId,
                title: courseNames[courseId] || 'Skillnara Course',
                price: coursePrices[courseId] || '$150'
              });
            }
          }}
          enrolledCourseIds={purchasedCourseIds}
        />
      );
    }

    // About Us page is public
    if (activeTab === 'about') {
      return <AboutUs setActiveTab={setActiveTab} />;
    }

    // Force login wall for all other tabs if not logged in
    if (!user) {
      return (
        <Login onLogin={(u) => { setUser(u); setActiveTab('dashboard'); }} />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            enrolledCourseIds={purchasedCourseIds}
            user={user}
            recordedLessons={recordedLessons}
            onUploadRecording={handleUploadRecording}
            onUpdateRecording={handleUpdateRecording}
            onDeleteRecording={handleDeleteRecording}
            onTriggerCheckout={(course) => setCheckoutCourse(course)}
          />
        );
      case 'live':
        return (
          <LiveClassroom
            user={user}
            purchasedCourseIds={purchasedCourseIds}
            onTriggerCheckout={(course) => setCheckoutCourse(course)}
          />
        );
      case 'recorded':
        return (
          <RecordedArchive
            recordedLessons={recordedLessons}
            purchasedCourseIds={purchasedCourseIds}
            onTriggerCheckout={(course) => setCheckoutCourse(course)}
          />
        );
      default:
        return (
          <LandingPage
            setActiveTab={setActiveTab}
            onEnroll={handlePurchaseCourse}
            enrolledCourseIds={purchasedCourseIds}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        user={user}
        onLogout={handleLogout}
      />
      
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>

      {/* Secure Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutCourse}
        onClose={() => setCheckoutCourse(null)}
        course={checkoutCourse}
        onSuccess={handlePurchaseCourse}
      />

      {/* Footer */}
      <footer className="glass-card" style={{
        marginTop: 'auto',
        borderRadius: '16px 16px 0 0',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '2.5rem 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
              Skill<span className="gradient-text">nara</span>
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              © 2026 Skillnara Institute. All rights reserved.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>About Us</a>
            <a href="#courses" onClick={(e) => { e.preventDefault(); setActiveTab('landing'); }}>Courses</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact support at help@skillnara.edu"); }}>Support Help</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Privacy Policy and Terms of Use"); }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
