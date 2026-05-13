import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export default function ScrollAnimation({ userName }) {
  const [scrollY, setScrollY] = useState(0);
  const requestRef = useRef();

  const motivationalQuotes = [
    "Your body can stand almost anything. It's your mind that you have to convince!",
    "The only bad workout is the one that didn't happen.",
    "Success isn't always about greatness. It's about consistency.",
    "Don't stop when you're tired. Stop when you're done!",
    "You don't have to be great to start, but you have to start to be great.",
    "Push harder than yesterday if you want a different tomorrow.",
    "Your limitation—it's only your imagination.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Dream it. Believe it. Build it.",
    "Progress, not perfection."
  ];

  // Get random quote that changes on each app load
  const randomQuote = useRef(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]).current;

  useEffect(() => {
    const handleScroll = () => {
      requestRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const containerOpacity = Math.max(0, 1 - scrollY / 400);
  const containerTransform = scrollY * 0.5;

  return (
    <div className="scroll-animation-hero">
      {/* Floating Elements */}
      <div className="floating-elements">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="float-dot"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`,
              opacity: Math.max(0, 1 - scrollY / 700)
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="scroll-hero-content">
        <div 
          className="scroll-greeting-container"
          style={{
            transform: `translateY(${containerTransform}px)`,
            opacity: containerOpacity
          }}
        >
          <div className="scroll-greeting-icon">
            <Sparkles size={48} />
          </div>
          
          <h1 className="scroll-greeting-name">
            Welcome, {userName}! 💪
          </h1>
          
          <p className="scroll-motivational-quote">
            "{randomQuote}"
          </p>
        </div>
      </div>
    </div>
  );
}
