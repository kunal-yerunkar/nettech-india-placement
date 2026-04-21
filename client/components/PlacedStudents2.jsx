import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play, Pause } from 'lucide-react';

const PLACEMENT_CREATIVES = [
  { imageUrl: "/images/Placed Students/Placed students .-07.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students .-08.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 123-01.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 123-02.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 123-03.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 123-04.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 2025-06.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students 2025-07.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students-01.jpg", studentName: "" },
  { imageUrl: "/images/Placed Students/Placed students-04.jpg", studentName: "" },
];

const PlacedStudents2 = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play state

  // --- Navigation Logic ---
  const showNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === PLACEMENT_CREATIVES.length - 1 ? 0 : prev + 1;
    });
  }, []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? PLACEMENT_CREATIVES.length - 1 : prev - 1;
    });
  }, []);

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsPlaying(true); // Reset to auto-play for next time
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  // --- Auto-Play Effect ---
  useEffect(() => {
    let interval;
    if (selectedIndex !== null && isPlaying) {
      interval = setInterval(() => {
        showNext();
      }, 3000); // 3 seconds per slide
    }
    return () => clearInterval(interval);
  }, [selectedIndex, isPlaying, showNext]);

  // --- Keyboard Support ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') {
        setIsPlaying(false); // Stop auto-play on manual interaction
        showNext();
      }
      if (e.key === 'ArrowLeft') {
        setIsPlaying(false); // Stop auto-play on manual interaction
        showPrev();
      }
      if (e.key === ' ') { // Spacebar to toggle play/pause
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  return (
    <section className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating our students' achievements through our latest placement updates.
          </p>
        </div>

        {/* Creatives Masonry Grid */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-6 space-y-6">
          {PLACEMENT_CREATIVES.map((item, idx) => (
            <div 
              key={idx} 
              className="break-inside-avoid group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
              onClick={() => setSelectedIndex(idx)}
            >
              {/* Image Container */}
              <div className="w-full relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.studentName || `Placement Success ${idx + 1}`} 
                  className="w-full h-auto block"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual logic
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
                    if (fallback) {
                        fallback.classList.remove('hidden');
                    }
                  }}
                />
                
                {/* Fallback Text */}
                <div className="fallback-text hidden w-full h-48 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                    <span className="text-gray-400 text-sm mb-2">Image unavailable</span>
                    <span className="text-gray-800 font-bold text-sm break-all">{item.imageUrl.split('/').pop()}</span>
                </div>

                {/* Overlay with Zoom Icon */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 p-3 rounded-full text-gray-900 shadow-lg">
                        <ZoomIn className="w-6 h-6" />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Help Text */}
        {PLACEMENT_CREATIVES.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500 text-lg">
                    No creatives added yet.<br/>
                    Open <code>components/PlacedStudents2.tsx</code> and add items to the <code>PLACEMENT_CREATIVES</code> array.
                </p>
            </div>
        )}

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            
            {/* Top Bar Controls */}
            <div className="absolute top-4 right-4 flex items-center space-x-4 z-50">
               {/* Play/Pause Button */}
               <button 
                  onClick={togglePlay}
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all flex items-center justify-center group"
                  title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
               >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
               </button>

               {/* Close Button */}
               <button 
                  onClick={closeLightbox}
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                  title="Close"
               >
                  <X className="w-8 h-8" />
               </button>
            </div>

            {/* Previous Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); showPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all z-50 focus:outline-none"
                title="Previous (Left Arrow)"
            >
                <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Next Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); showNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all z-50 focus:outline-none"
                title="Next (Right Arrow)"
            >
                <ChevronRight className="w-10 h-10" />
            </button>

            {/* Main Image */}
            <div 
                className="relative w-full h-full p-4 md:p-10 flex items-center justify-center"
                onClick={closeLightbox} // Click outside image to close
            >
                <img 
                    src={PLACEMENT_CREATIVES[selectedIndex].imageUrl} 
                    alt="Full View" 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                    onClick={(e) => e.stopPropagation()} // Click on image shouldn't close
                />
            </div>

            {/* Bottom Bar info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
                {/* Progress Indicators */}
                {isPlaying && (
                   <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 animate-progress origin-left" style={{ animationDuration: '3s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}></div>
                   </div>
                )}
                
                {/* Counter */}
                <div className="text-white/80 font-medium bg-black/50 px-4 py-1 rounded-full text-sm">
                    {selectedIndex + 1} / {PLACEMENT_CREATIVES.length}
                </div>
            </div>

            {/* CSS for progress animation */}
            <style>{`
              @keyframes progress {
                from { width: 0%; }
                to { width: 100%; }
              }
              .animate-progress {
                animation-name: progress;
              }
            `}</style>
        </div>
      )}

    </section>
  );
};

export default PlacedStudents2;