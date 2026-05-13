import React, { useState, useRef, useEffect } from 'react';
import { Dumbbell, TrendingUp, User, Calendar } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const navRef = useRef(null);

  const tabs = [
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const getNextTab = (direction) => {
    const currentIndex = getCurrentTabIndex();
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1].id;
    }
    if (direction === 'right' && currentIndex > 0) {
      return tabs[currentIndex - 1].id;
    }
    return activeTab;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 50; // Minimum drag distance to trigger tab change
    if (Math.abs(dragOffset) > threshold) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      const nextTab = getNextTab(direction);
      if (nextTab !== activeTab) {
        onTabChange(nextTab);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      const nextTab = getNextTab(direction);
      if (nextTab !== activeTab) {
        onTabChange(nextTab);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, startX]);

  return (
    <nav
      ref={navRef}
      className={`bottom-nav ${isDragging ? 'dragging' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{
        transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'translateX(0)',
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const distance = Math.abs(index - getCurrentTabIndex());
        const opacity = isDragging ? Math.max(0.3, 1 - distance * 0.2) : 1;

        return (
          <button
            key={tab.id}
            className={`nav-tab ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              opacity,
              transform: isDragging ? `scale(${isActive ? 1.1 : 0.9})` : 'scale(1)',
              transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <Icon size={20} />
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}