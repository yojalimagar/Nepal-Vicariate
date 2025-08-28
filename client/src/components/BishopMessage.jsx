import { useState, useEffect, useRef } from 'react';

const BishopMessage = () => {
  // Mock data for the bishop's message
  const bishopInfo = {
    name: "Bishop Michael A. Williams",
    title: "Diocesan Bishop",
    photoUrl: "https://www.apostolicnunciatureindia.com/images/PaulSimick.jpg",
    message: [
      "My brothers and sisters in Christ, I greet you with peace and joy. It is with a grateful heart that I reflect on the journey we have shared and the work we continue to do together in service of our Lord.",
      "In a world that often seems divided, the light of faith, hope, and love shines ever brighter through our collective actions. Your dedication, generosity, and unwavering spirit are a testament to the power of our community.",
      "Let us continue to build upon this foundation, nurturing our faith, supporting one another, and reaching out to those in need. May God bless you and your families, and may His grace guide our path forward.",
      "In His service,"
    ]
  };

  // State to control animation visibility
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger animations when section enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // Set true when visible, false when not
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    // Main container with ref for Intersection Observer and scale/fade-in animation
    <div 
      ref={sectionRef} 
      className={`py-16 px-4 sm:px-6 lg:px-8 ${isVisible ? 'animate-scaleFadeIn' : 'opacity-0 scale-95'}`}
    >
      {/* Container for the content, centered and with a max-width */}
      <div className="max-w-7xl mx-auto rounded-xl shadow-2xl bg-blue-900 p-8 md:p-12 lg:p-16">
        
        {/* Section title with fade-in-up animation */}
        <div className={`text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-[50px]'}`}>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-amber-300 mb-2">
            A Message from Our Bishop
          </h2>
          <p className="text-lg text-blue-200">
            Guidance and inspiration from our spiritual leader.
          </p>
        </div>

        {/* Content layout - image on left, text on right for larger screens */}
        <div className="mt-12 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          
          {/* Bishop's photo container with slide-in and hover effect */}
          <div className={`flex-shrink-0 w-full md:w-1/3 lg:w-1/4 ${isVisible ? 'animate-slideInLeft' : 'opacity-0 translate-x-[-50px]'}`}>
            <img 
              className="w-full h-auto rounded-2xl object-cover shadow-xl transition-transform duration-500 hover:scale-110 hover:shadow-2xl" 
              src={bishopInfo.photoUrl} 
              alt={`Photo of ${bishopInfo.name}`} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://placehold.co/400x400/94a3b8/e2e8f0?text=Photo+Unavailable";
              }}
            />
          </div>

          {/* Bishop's message container with fade-in-up animation */}
          <div className={`md:flex-1 ${isVisible ? 'animate-fadeInUp animation-delay-200' : 'opacity-0 translate-y-[50px]'}`}>
            <div className="relative">
              {/* Message paragraphs */}
              <div className="text-blue-100 text-lg space-y-4 leading-relaxed">
                {bishopInfo.message.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {/* Signature section */}
              <div className="mt-8 text-right">
                <p className="text-xl font-semibold text-amber-300">{bishopInfo.name}</p>
                <p className="text-md text-amber-200">{bishopInfo.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scaleFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-scaleFadeIn {
          animation: scaleFadeIn 1.5s ease-in-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 2s ease-in-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 2s ease-in-out;
        }
        .animation-delay-200 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default BishopMessage;