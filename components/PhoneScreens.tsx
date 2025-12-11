
import React from 'react';

// --- Screen 1: Map Tracking ---
export const ScreenMap: React.FC = () => (
  <div className="w-full h-full relative bg-slate-50 overflow-hidden">
    {/* Map Grid Background */}
    <div className="absolute inset-0 bg-slate-100">
      <div 
        className="w-full h-full opacity-30" 
        style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>
    </div>

    {/* Route Line Container - Vertically Centered */}
    <div className="absolute top-0 bottom-0 left-8 w-2 bg-slate-200">
        {/* Progress Line */}
        <div className="w-full bg-blue-500 absolute top-0" style={{ height: '40%', animation: 'growLine 4s infinite linear' }}></div>
    </div>
    
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes moveTrain {
        0% { top: 10%; }
        100% { top: 70%; }
      }
      @keyframes growLine {
        0% { height: 10%; }
        100% { height: 70%; }
      }
    `}} />

    {/* Stations */}
    <div className="absolute top-[10%] left-6 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full border-4 border-blue-500 bg-white z-10"></div>
        <div className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm text-slate-800">
            Rajiv Chowk
        </div>
    </div>

    <div className="absolute top-[40%] left-6 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full border-4 border-slate-300 bg-white z-10"></div>
        <div className="bg-white/50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400">
            Hauz Khas
        </div>
    </div>
    
    <div className="absolute top-[70%] left-6 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full border-4 border-slate-300 bg-white z-10"></div>
        <div className="bg-white/50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400">
            Cyber City
        </div>
    </div>

    {/* Moving Train Icon */}
    <div 
        className="absolute left-[31px] -translate-x-1/2 z-20 text-blue-600 bg-white rounded-full p-1 shadow-md border border-blue-100"
        style={{ top: '10%', animation: 'moveTrain 4s infinite linear' }}
    >
      <i className="fa-solid fa-train-subway text-lg block"></i>
    </div>

    {/* Bottom Status Card */}
    <div className="absolute bottom-6 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold text-slate-800 text-lg">Yellow Line</div>
        <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">On Time</div>
      </div>
      <div className="text-slate-500 text-sm">Arriving in <span className="text-slate-900 font-bold">2 min</span></div>
    </div>
  </div>
);

// --- Screen 2: NCMC Ticket ---
export const ScreenTicket: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6 relative bg-black">
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-black"></div>
    
    {/* The Card */}
    <div className="z-10 w-full aspect-[2/3] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden ring-1 ring-white/20">
      {/* Gloss Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      
      <div className="flex justify-between items-start">
        <i className="fa-solid fa-train-subway text-3xl opacity-90"></i>
        <span className="font-mono opacity-70 text-xs border border-white/30 px-2 py-0.5 rounded">NCMC</span>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-display font-bold mb-1 tracking-tight">METRO</div>
        <div className="text-[10px] tracking-[0.3em] uppercase opacity-80">Monthly Pass</div>
      </div>
      
      <div className="flex justify-between items-end border-t border-white/20 pt-4">
        <div className="text-xs">
          <div className="opacity-70 text-[10px] uppercase">Balance</div>
          <div className="font-bold text-xl">₹840.50</div>
        </div>
        <i className="fa-solid fa-wifi rotate-90 text-2xl opacity-90"></i>
      </div>
    </div>

    {/* Validation Animation */}
    <div className="mt-8 text-center z-10">
      <p className="text-slate-400 text-xs mb-4 uppercase tracking-wider font-medium">Hold near gate reader</p>
      <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 animate-pulse mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)]">
        <i className="fa-solid fa-check text-xl"></i>
      </div>
    </div>
  </div>
);

// --- Screen 3: Last Mile (Bus Service) ---
export const ScreenBus: React.FC = () => (
  <div className="w-full h-full relative bg-slate-50 overflow-hidden flex flex-col">
    {/* Map Background */}
    <div className="absolute inset-0">
       <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
       {/* Roads Background Blocks */}
       <div className="absolute top-[25%] left-0 w-full h-[6%] bg-slate-200 border-y border-slate-300"></div>
       <div className="absolute top-0 left-[25%] h-full w-[12%] bg-slate-200 border-x border-slate-300"></div>
    </div>

    {/* Connector Path (SVG for responsiveness) 
        Using viewBox 0 0 100 100 and preserveAspectRatio="none" ensures
        the path scales exactly with the container.
    */}
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Path moves from 25,25 down to 25,55 then right to 80,55 */}
      <path 
        d="M 25 25 L 25 55 L 80 55" 
        fill="none" 
        stroke="#f97316" 
        strokeWidth="1" 
        strokeDasharray="2 2"
        className="opacity-60"
        vectorEffect="non-scaling-stroke" 
      />
    </svg>

    {/* Metro Station Point (Center at 25%, 25%) */}
    <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
       <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white z-20">
         <i className="fa-solid fa-train-subway text-sm"></i>
       </div>
       <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 shadow-md whitespace-nowrap">Station</span>
    </div>

    {/* Destination Point (Center at 80%, 55%) */}
    <div className="absolute top-[55%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
       <div className="w-8 h-8 bg-orange-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white z-20">
         <i className="fa-solid fa-building text-xs"></i>
       </div>
       <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 shadow-md whitespace-nowrap">Office</span>
    </div>

    {/* Moving Bus 
        Includes -translate-x-1/2 -translate-y-1/2 in animation to keep center aligned to path
    */}
    <div className="absolute w-8 h-8 bg-white border-2 border-orange-500 rounded-lg shadow-lg flex items-center justify-center text-orange-600 z-30"
         style={{
           animation: 'moveBus 4s infinite ease-in-out',
           top: '25%', // Initial position for fallback
           left: '25%' 
         }}>
      <i className="fa-solid fa-bus-simple text-xs"></i>
    </div>
    
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes moveBus {
        0% { top: 25%; left: 25%; opacity: 0; transform: translate(-50%, -50%); }
        10% { opacity: 1; transform: translate(-50%, -50%); }
        35% { top: 55%; left: 25%; transform: translate(-50%, -50%); }
        45% { top: 55%; left: 25%; transform: translate(-50%, -50%); } 
        90% { top: 55%; left: 80%; opacity: 1; transform: translate(-50%, -50%); }
        100% { top: 55%; left: 80%; opacity: 0; transform: translate(-50%, -50%); }
      }
    `}} />

    {/* Floating Ticket Info */}
    <div className="absolute top-6 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-100 max-w-[120px]">
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Feeder Bus</div>
        <div className="text-sm font-bold text-slate-800 leading-tight">Route 214</div>
    </div>

    {/* Bottom Card */}
    <div className="absolute bottom-6 left-4 right-4 bg-orange-500 text-white p-4 rounded-2xl shadow-xl shadow-orange-500/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-bus"></i>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm truncate">Shuttle Arriving</div>
          <div className="text-orange-100 text-xs truncate">Pickup at Gate 2</div>
        </div>
        <div className="ml-auto font-mono text-xl font-bold flex-shrink-0">2m</div>
      </div>
    </div>
  </div>
);
