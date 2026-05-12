import React, { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { api } from '../../services/api';
import SuccessHero from './SuccessHero';
import SuccessPlacementGrid from './SuccessPlacementGrid';
import SuccessReelsSection from './SuccessReelsSection';
import SuccessFeaturedSection from './SuccessFeaturedSection';
import { PLACED_STUDENTS as FALLBACK_STUDENTS } from '../../data/successData';

const SuccessStories = () => {
  const [visibleCount, setVisibleCount] = useState(20);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [reels, setReels] = useState([]);
  const [students, setStudents] = useState([]);

  const phrases = [
    "Hall of Fame Records",
    "Elite Professional Fusions",
    "MNC Placement Success",
    "Student Career Milestones"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    const loadData = async () => {
      try {
        const [reelsData, studentsData] = await Promise.all([
          api.getReels().catch(() => []),
          api.getStudents().catch(() => [])
        ]);

        const sortedReels = Array.isArray(reelsData) 
          ? [...reelsData].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99))
          : [];
        setReels(sortedReels);
        
        const finalStudents = Array.isArray(studentsData) && studentsData.length > 0 
          ? studentsData 
          : FALLBACK_STUDENTS;
        setStudents(finalStudents);
      } catch (error) {
        console.warn('Success stories API unavailable, using fallback:', error.message);
        setStudents(FALLBACK_STUDENTS);
        setReels([]);
      }
    };
    loadData();

    return () => clearInterval(interval);
  }, []);

  const loadMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 20, students.length));
      setIsAnimating(false);
    }, 600);
  };

  const visibleStudents = students.slice(0, visibleCount);
  const hasMore = visibleCount < students.length;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20 transition-colors duration-300 overflow-x-hidden">
      <SuccessHero
        phrases={phrases}
        activePhraseIndex={activePhraseIndex}
        studentCount={students.length}
      />
      <SuccessPlacementGrid
        students={students}
        visibleStudents={visibleStudents}
        hasMore={hasMore}
        loadMore={loadMore}
        isAnimating={isAnimating}
      />
      <SuccessReelsSection reels={reels} />
      <SuccessFeaturedSection />

      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default SuccessStories;