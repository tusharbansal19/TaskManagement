// CosmicLoader.jsx
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * A responsive, full-page loader component with a cosmic black and blue theme,
 * enhanced animations, and a transparent blurred background.
 *
 * This component requires Tailwind CSS with the 'tailwindcss-animate' plugin
 * and custom color/animation configurations in your tailwind.config.js.
 *
 * @param {boolean} isLoading - Controls the visibility of the loader.
 * @param {string} loadingMessage - The main message displayed in the loader.
 * @param {string[]} dynamicMessages - An array of messages to cycle through.
 */
const CosmicLoader = ({ 
  isLoading, 
  loadingMessage = 'Initiating Warp Drive...', 
  dynamicMessages = ['Loading resources...', 'Calibrating systems...', 'Almost there...'] 
}) => {
  const [currentDynamicMessage, setCurrentDynamicMessage] = useState(dynamicMessages[0]);
  const [revolutionPosition, setRevolutionPosition] = useState(0);
  const loaderRef = useRef(null);
  
  useEffect(() => {
    let intervalId;
    if (isLoading) {
      // Start cycling through dynamic messages if the loader is visible
      intervalId = setInterval(() => {
        setCurrentDynamicMessage(prevMessage => {
          const currentIndex = dynamicMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % dynamicMessages.length;
          return dynamicMessages[nextIndex];
        });
      }, 2000); // Change message every 2 seconds
    }

    // Cleanup interval on unmount or when loading stops
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading, dynamicMessages]);

  // Revolution effect animation
  useEffect(() => {
    if (!isLoading) return;

    let animationId;
    let startTime = Date.now();

    const animateRevolution = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % 3000) / 3000; // 3 second cycle
      setRevolutionPosition(progress * 360); // 360 degrees
      animationId = requestAnimationFrame(animateRevolution);
    };

    animationId = requestAnimationFrame(animateRevolution);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoading]);

  // If not loading, return null to unmount the component
  if (!isLoading) {
    return null;
  }

  return (
    // Main loader container: fixed, full screen, centered content.
    // 'animate-in fade-in' from tailwindcss-animate for smooth appearance.
    // Added a 'star-field' class for the subtle background animation.
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                    bg-black/70 backdrop-blur-sm transition-opacity duration-500 ease-out 
                    animate-in fade-in star-field">
      
      {/* Subtle background gradient for depth, overlaid on the blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-transparent to-black/90 opacity-80"></div>

      {/* Content wrapper to ensure z-index for loader elements */}
      <div className="relative z-10 flex flex-col items-center justify-center">

        {/* Enhanced Cosmic Arc Animation with Revolution Effect */}
        <div className="relative h-40 w-40" ref={loaderRef}>
          {/* Revolution Ring - Blue sliding highlight effect */}
          <div 
            className="absolute h-full w-full rounded-full border-[8px] border-transparent"
            style={{
              background: `conic-gradient(from ${revolutionPosition}deg, 
                rgba(59, 130, 246, 0.8) 0deg, 
                rgba(59, 130, 246, 0.4) 60deg, 
                rgba(59, 130, 246, 0.1) 120deg, 
                transparent 180deg, 
                transparent 360deg)`,
              transform: `rotate(${revolutionPosition}deg)`,
              transition: 'transform 0.1s linear'
            }}
          ></div>

          {/* Arc 1: Main blue, fastest spin, subtle 3D tilt */}
          <div className="absolute h-full w-full rounded-full border-[6px] border-transparent 
                          border-t-cosmic-blue animate-spin-fast drop-shadow-lg 
                          transform rotate-x-45"></div>
          {/* Arc 2: Slightly lighter blue, slower spin, opposite 3D tilt */}
          <div className="absolute h-full w-full rounded-full border-[6px] border-transparent 
                          border-b-cosmic-blue/70 animate-spin-slow drop-shadow-md 
                          transform rotate-y-45"></div>
          {/* Arc 3: Even lighter blue, slowest spin, reversed direction, no tilt */}
          <div className="absolute h-full w-full rounded-full border-[6px] border-transparent 
                          border-r-cosmic-blue/40 animate-spin-slower drop-shadow-sm"></div>
          {/* New Arc 4: Very subtle, different color, fastest spin, different direction */}
          <div className="absolute h-full w-full rounded-full border-[6px] border-transparent 
                          border-l-cosmic-blue/20 animate-spin-fast-reverse drop-shadow-xs"></div>

          {/* Central Revolution Orb */}
          <div 
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 
                       rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2
                       animate-pulse-slow"
            style={{
              transform: `translate(-50%, -50%) rotate(${revolutionPosition * 2}deg)`,
              boxShadow: `0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)`
            }}
          ></div>

          {/* Orbital Revolution Elements */}
          <div 
            className="absolute top-0 left-1/2 w-3 h-3 bg-blue-300 rounded-full 
                       transform -translate-x-1/2 shadow-lg"
            style={{
              transform: `translate(-50%, 0) rotate(${revolutionPosition}deg) translateY(-20px)`,
              boxShadow: `0 0 15px rgba(59, 130, 246, 0.5)`
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-300 rounded-full 
                       transform -translate-x-1/2 shadow-lg"
            style={{
              transform: `translate(-50%, 0) rotate(${-revolutionPosition}deg) translateY(20px)`,
              boxShadow: `0 0 10px rgba(147, 51, 234, 0.5)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 right-0 w-2.5 h-2.5 bg-cyan-300 rounded-full 
                       transform -translate-y-1/2 shadow-lg"
            style={{
              transform: `translate(0, -50%) rotate(${revolutionPosition * 1.5}deg) translateX(20px)`,
              boxShadow: `0 0 12px rgba(34, 211, 238, 0.5)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-0 w-2.5 h-2.5 bg-indigo-300 rounded-full 
                       transform -translate-y-1/2 shadow-lg"
            style={{
              transform: `translate(0, -50%) rotate(${-revolutionPosition * 1.5}deg) translateX(-20px)`,
              boxShadow: `0 0 12px rgba(99, 102, 241, 0.5)`
            }}
          ></div>
        </div>
        
        {/* Loader Content: Title & Dynamic Message */}
        <div className="mt-8 text-center text-white font-sans">
          {/* Main loading message with a zoom-in fade-in effect */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-white 
                         animate-in zoom-in-75 fade-in-0 duration-700">
            {loadingMessage}
          </h1>
          {/* Dynamic message with a fixed height to prevent layout shifts,
              and a fade-in animation triggered by key change */}
          <p 
            id="dynamic-text" 
            className="mt-4 text-lg sm:text-xl font-light text-gray-300 h-6 overflow-hidden" 
            key={currentDynamicMessage} // Key to trigger re-animation on message change
          >
            <span className="animate-in fade-in duration-1000 ease-in-out">
              {currentDynamicMessage}
            </span>
          </p>
        </div>

        {/* Revolution Progress Indicator */}
        <div className="mt-6 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{
              width: `${(revolutionPosition / 360) * 100}%`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}
          ></div>
        </div>

      </div>

      {/* Enhanced Progress Bar at the bottom with revolution effect */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 
                      animate-pulse-slow origin-left scale-x-0 
                      animate-in slide-in-from-left duration-2000"
           style={{
             background: `linear-gradient(90deg, 
               rgba(59, 130, 246, 0.8) 0%, 
               rgba(147, 51, 234, 0.8) 50%, 
               rgba(59, 130, 246, 0.8) 100%)`,
             backgroundSize: '200% 100%',
             animation: 'pulse-slow 2s ease-in-out infinite, slide-in-from-left 2s ease-out'
           }}>
      </div>

    </div>
  );
};

CosmicLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string,
  dynamicMessages: PropTypes.arrayOf(PropTypes.string),
};

export default CosmicLoader;