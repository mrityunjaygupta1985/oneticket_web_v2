
import React, { useState, useRef, useEffect } from 'react';
import { CityMap, Station } from '../types';

interface MetroMapViewerProps {
  cityMap: CityMap;
  onClose: () => void;
  isDarkMode: boolean;
}

const MetroMapViewer: React.FC<MetroMapViewerProps> = ({ cityMap, onClose, isDarkMode }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom Handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAdjustment = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.5, scale + scaleAdjustment), 4);
    setScale(newScale);
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [cityMap]);

  // Use schematic beige or dark slate background
  const mapBackgroundColor = isDarkMode ? '#1e293b' : '#FDFBF7';

  // Helper function to get label styles based on position
  const getLabelStyle = (pos: Station['labelPosition']) => {
    const baseStyle = "absolute text-[11px] font-bold whitespace-nowrap px-2 py-0.5 rounded-md shadow-sm transition-opacity duration-300 z-50 pointer-events-none";
    
    switch (pos) {
      case 'top':
        return `${baseStyle} bottom-full mb-2 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseStyle} top-full mt-2 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseStyle} right-full mr-3 top-1/2 -translate-y-1/2`;
      case 'top-left':
        return `${baseStyle} bottom-full right-full mb-1 mr-1`;
      case 'top-right':
        return `${baseStyle} bottom-full left-full mb-1 ml-1`;
      case 'bottom-left':
        return `${baseStyle} top-full right-full mt-1 mr-1`;
      case 'bottom-right':
        return `${baseStyle} top-full left-full mt-1 ml-1`;
      case 'right':
      default:
        return `${baseStyle} left-full ml-3 top-1/2 -translate-y-1/2`;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in-up overflow-hidden">
      
      {/* Top Control Bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none`}>
        <div className={`pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border ${isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-slate-900'}`}>
            <h2 className="text-3xl font-display font-bold mb-1">{cityMap.name} Metro</h2>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider opacity-70">
                <span className="flex items-center gap-1"><i className="fa-solid fa-circle-nodes"></i> Network Map</span>
                <span className="w-1 h-1 rounded-full bg-current"></span>
                <span>Interactive</span>
            </div>
        </div>

        <button 
          onClick={onClose}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-xl hover:scale-110 transition-transform text-red-500"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Map Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: mapBackgroundColor }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Movable Container */}
        <div 
          className="absolute origin-center transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
            <div className="relative w-[1000px] h-[1000px] select-none">
                
                {/* 0. BACKGROUND IMAGE LAYER (Context) */}
                {cityMap.imageUrl && (
                    <img 
                        src={cityMap.imageUrl} 
                        alt="Background Map" 
                        // Increased opacity from 10 to 30 as requested
                        className={`absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 grayscale mix-blend-multiply dark:mix-blend-overlay`}
                        draggable={false}
                    />
                )}

                {/* 1. SCHEMATIC SVG LAYER */}
                {cityMap.svgLayout && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                        {cityMap.svgLayout}
                    </div>
                )}

                {/* 2. STATIONS LAYER */}
                {cityMap.stations.map((station) => {
                    const isInterchange = station.isInterchange || station.lines.length > 1;
                    const primaryColor = station.lines[0] || '#64748b';
                    const zIndex = hoveredStation?.id === station.id ? 100 : (isInterchange ? 20 : 10);
                    
                    // Force label visibility for ALL stations
                    const showLabel = true; 
                    const labelClass = getLabelStyle(station.labelPosition || 'right');

                    return (
                        <div
                            key={station.id}
                            className="absolute group"
                            style={{
                                left: `${station.x}%`,
                                top: `${station.y}%`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: zIndex
                            }}
                            onMouseEnter={() => setHoveredStation(station)}
                            onMouseLeave={() => setHoveredStation(null)}
                        >
                            {/* Marker */}
                            <div className="relative flex items-center justify-center cursor-pointer">
                                {isInterchange && (
                                    <div className="absolute w-6 h-6 rounded-full bg-current opacity-30 animate-ping" style={{color: primaryColor}}></div>
                                )}
                                <div 
                                    className={`
                                        rounded-full shadow-lg border-2 border-white transition-all duration-300
                                        ${isInterchange ? 'w-5 h-5 ring-2 ring-offset-1 ring-slate-900/10' : 'w-2.5 h-2.5 hover:scale-150'}
                                    `}
                                    style={{ 
                                        backgroundColor: isInterchange ? 'white' : primaryColor,
                                        borderColor: isInterchange ? primaryColor : 'white'
                                    }}
                                >
                                    {isInterchange && (
                                        <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                                            {station.lines.map((color, i) => (
                                                <div key={i} style={{ backgroundColor: color }} className="flex-1 h-full"></div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Label */}
                                {showLabel && (
                                    <div className={`
                                        ${labelClass}
                                        ${isDarkMode ? 'bg-slate-800 text-white ring-1 ring-black' : 'bg-white/90 text-slate-900 ring-1 ring-slate-200'}
                                    `}>
                                        {station.name}
                                    </div>
                                )}
                            </div>
                            
                            {/* HOVER TOOLTIP */}
                            {hoveredStation?.id === station.id && (
                                <div className={`
                                    absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 p-0 rounded-xl shadow-2xl z-[200] overflow-hidden animate-fade-in-up origin-bottom
                                    ${isDarkMode ? 'bg-slate-800 text-white ring-1 ring-slate-600' : 'bg-white text-slate-900 ring-1 ring-slate-200'}
                                `}>
                                    <div className="h-1.5 w-full flex">
                                        {station.lines.map((l, i) => <div key={i} style={{background: l}} className="flex-1"></div>)}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg leading-tight">{station.name}</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {isInterchange && (
                                                <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                    Interchange
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {station.lines.map((color, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs font-medium">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{background: color}}></div>
                                                    <span>
                                                       {color === '#0072CE' ? 'Line 1' : 
                                                        color === '#FFC20E' ? 'Line 2A' :
                                                        color === '#33A3C9' ? 'Line 3' :
                                                        color === '#FF0000' ? 'Line 7' : 'Metro Line'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Station Guide & Tip */}
                                        {station.guide && (
                                            <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                                <p className="text-[10px] leading-relaxed opacity-90">
                                                    {station.guide}
                                                </p>
                                                {station.tip && (
                                                    <div className={`mt-2 text-[9px] font-bold p-2 rounded-lg flex items-start gap-1.5 ${
                                                        isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        <i className="fa-solid fa-lightbulb mt-0.5"></i>
                                                        <span>{station.tip}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Legend */}
        <div className={`absolute bottom-8 left-8 p-4 rounded-2xl backdrop-blur-md border shadow-lg ${isDarkMode ? 'bg-slate-900/80 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
            <h4 className="text-xs font-bold uppercase mb-3 opacity-70">Legend</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#0072CE]"></div> Line 1 (Blue)</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#FFC20E]"></div> Line 2A (Yellow)</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#33A3C9]"></div> Line 3 (Aqua)</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#FF0000]"></div> Line 7 (Red)</div>
            </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3 pointer-events-auto">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <button onClick={() => setScale(s => Math.min(s + 0.5, 4))} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-lg"><i className="fa-solid fa-plus"></i></button>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-700 w-full"></div>
                <button onClick={() => setScale(s => Math.max(s - 0.5, 0.5))} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-lg"><i className="fa-solid fa-minus"></i></button>
            </div>
            <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-xl flex items-center justify-center hover:scale-105 transition-transform"><i className="fa-solid fa-crosshairs"></i></button>
        </div>
      </div>
    </div>
  );
};

export default MetroMapViewer;
