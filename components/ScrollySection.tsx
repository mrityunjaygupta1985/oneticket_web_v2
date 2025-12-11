
import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScreenMap, ScreenTicket, ScreenBus } from './PhoneScreens';

gsap.registerPlugin(ScrollTrigger);

interface ScrollySectionProps {
  isDarkMode: boolean;
}

const ScrollySection: React.FC<ScrollySectionProps> = ({ isDarkMode }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);

  // Data for the text steps
  const steps = [
    {
      id: 0,
      icon: "fa-map-location-dot",
      color: "blue",
      title: "Live Tracking.",
      desc: "See exactly where the train is. From Rajiv Chowk to Cyber City, track every second.",
      Component: ScreenMap
    },
    {
      id: 1,
      icon: "fa-mobile-screen",
      color: "purple",
      title: "Tap to Ride.",
      desc: "Integrated with NCMC. Just tap your phone at the AFC gate and keep walking.",
      Component: ScreenTicket
    },
    {
      id: 2,
      icon: "fa-bus-simple",
      color: "orange",
      title: "Last Mile.",
      desc: "Seamless connectivity. Hop on a shuttle bus right from the station exit to your final destination.",
      Component: ScreenBus
    }
  ];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    
    // Logic applies ONLY to Desktop (min-width: 768px)
    mm.add("(min-width: 768px)", () => {
      
      // Pin the phone on the right
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        scrub: 0.5, // Smoother scrubbing
      });

      // Trigger screen changes based on step visibility
      const stepElements = document.querySelectorAll('.step-trigger');
      stepElements.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%", 
          end: "bottom 60%",
          onEnter: () => setActiveScreen(index),
          onEnterBack: () => setActiveScreen(index),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full transition-colors duration-500 z-10">
      
      {/* =========================================
          DESKTOP LAYOUT (Vertical Scrollytelling)
          Visible on md+ screens
         ========================================= */}
      <div className="hidden md:flex container mx-auto flex-row relative">
        
        {/* LEFT COLUMN: Text Steps 
            Increased padding to pl-64 (16rem) to move text right, avoiding fixed logo.
        */}
        <div className="w-1/2 flex flex-col pl-8 md:pl-64 relative z-10 pb-[50vh]">
          
          {/* TRANSIT THEME: Vertical Route Line 
              Calculated Position: 
              Padding (16rem) - Dot Offset (4rem) = 12rem (Dot Left Edge).
              Dot Center = 12.5rem.
              Line Center = 12.5rem - 0.125rem (half width) = 12.375rem.
          */}
          <div className={`absolute left-6 md:left-[12.375rem] top-[10vh] bottom-[10vh] w-1 rounded-full opacity-20 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>

          {steps.map((step, i) => (
            <div 
              key={step.id} 
              className={`
                step-trigger 
                flex flex-col 
                justify-center
                group 
                min-h-[80vh]
                relative
              `}
            >
              {/* TRANSIT THEME: Route Dot */}
              <div className={`absolute left-[-1.5rem] md:left-[-4rem] w-4 h-4 rounded-full border-4 z-10 transition-colors duration-500 ${
                  activeScreen === i 
                  ? (isDarkMode ? 'bg-white border-blue-500 scale-125' : 'bg-slate-900 border-blue-500 scale-125')
                  : (isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-slate-200 border-slate-300')
              }`}></div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-all duration-300 shadow-lg ${
                isDarkMode 
                ? `bg-${step.color}-900/30 text-${step.color}-400 shadow-${step.color}-500/10` 
                : `bg-${step.color}-100 text-${step.color}-600`
              }`}>
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              
              <h2 className="text-6xl font-display font-bold mb-6 transition-colors duration-300">
                {step.title.split(' ')[0]} <span className={`text-${step.color}-500`}>{step.title.split(' ')[1]}</span>
              </h2>
              
              {step.desc && (
                <p className="text-2xl leading-relaxed max-w-md transition-colors duration-300 opacity-60 md:group-hover:opacity-100">
                  {step.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Pinned Phone Container */}
        <div 
          ref={pinRef} 
          className="w-1/2 flex items-center justify-center h-screen"
        >
          <div className="relative transition-all duration-500 ease-out transform scale-100 hover:scale-[1.02]">
            {/* Phone Frame */}
            <div className={`
              w-[300px] h-[600px] 
              border-[12px] 
              rounded-[45px] 
              relative 
              shadow-2xl 
              overflow-hidden 
              bg-black
              transition-colors duration-500
              ${isDarkMode ? 'border-slate-800 shadow-slate-900/50' : 'border-slate-800 shadow-xl'}
            `}>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-slate-800 rounded-b-xl z-30"></div>

              {/* Screen Content Wrapper */}
              <div className="w-full h-full relative bg-white overflow-hidden">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeScreen === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <step.Component />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE LAYOUT (Horizontal Slider)
          Visible on < md screens
         ========================================= */}
      <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex scrollbar-hide py-6">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className="w-full flex-shrink-0 snap-center px-4 flex flex-col items-center justify-center min-h-[60vh]"
          >
            {/* Mobile Phone Representation - Reduced Size */}
            <div className={`
              w-[220px] h-[440px] 
              border-[6px] 
              rounded-[30px] 
              relative 
              shadow-2xl 
              overflow-hidden 
              bg-black
              mb-6
              flex-shrink-0
              ${isDarkMode ? 'border-slate-800 shadow-slate-900/50' : 'border-slate-800 shadow-xl'}
            `}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[15px] bg-slate-800 rounded-b-lg z-30"></div>
              <div className="w-full h-full relative bg-white overflow-hidden">
                <step.Component />
              </div>
            </div>

            {/* Mobile Text Content */}
            <div className="text-center max-w-xs px-2">
              <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg shadow-lg ${
                isDarkMode 
                ? `bg-${step.color}-900/30 text-${step.color}-400 shadow-${step.color}-500/10` 
                : `bg-${step.color}-100 text-${step.color}-600`
              }`}>
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {step.title.split(' ')[0]} <span className={`text-${step.color}-500`}>{step.title.split(' ')[1]}</span>
              </h2>
              {step.desc && (
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ScrollySection;
