import React from 'react';
import { Activity, Target, Clock } from 'lucide-react';

export default function StatsGrid({ userSettings, todayStats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card primary">
        <div className="stat-icon"><Target size={24} /></div>
        <div className="stat-info">
          <div className="stat-value">{todayStats.count}</div>
          <div className="stat-label">Exercises Today</div>
        </div>
        <div className="stat-progress">
          <div className="progress-bar"><div className="progress-fill" style={{ width: '68%' }} /></div>
          <span className="progress-text">Keep it up!</span>
        </div>
      </div>

      <div className="stat-card secondary">
        <div className="stat-icon"><Activity size={24} /></div>
        <div className="stat-info">
          <div className="stat-value">{todayStats.time} min</div>
          <div className="stat-label">Workout Time</div>
        </div>
        <div className="stat-badge">Today</div>
      </div>

      <div className="stat-card tertiary">
        <div className="stat-icon"><Clock size={24} /></div>
        <div className="stat-info">
          <div className="stat-value">{todayStats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-badge">Exercises</div>
      </div>
    </div>
  );
}
