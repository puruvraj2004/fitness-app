import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function WeeklyProgress({ weeklyProgress }) {
  const maxValue = Math.max(...weeklyProgress.map(day => day.value), 1);

  return (
    <div className="section">
      <div className="section-header">
        <h2><TrendingUp size={20} style={{ marginRight: '0.5rem' }} />Weekly Progress</h2>
        <div className="progress-legend">
          <span className="legend-item">
            <Calendar size={14} />
            Last 7 days
          </span>
        </div>
      </div>

      <div className="weekly-progress">
        <div className="progress-chart">
          {weeklyProgress.map((day, index) => (
            <div key={day.day} className="progress-bar-container">
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{
                    height: `${(day.value / maxValue) * 100}%`,
                    background: day.value > 0 ? 'linear-gradient(180deg, #ffd700 0%, #ffb347 100%)' : '#333'
                  }}
                />
              </div>
              <div className="progress-day">{day.day}</div>
              <div className="progress-value">{day.value}%</div>
            </div>
          ))}
        </div>

        <div className="progress-stats">
          <div className="stat-item">
            <div className="stat-label">This Week</div>
            <div className="stat-value">{Math.round(weeklyProgress.reduce((sum, day) => sum + day.value, 0) / 7)}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Best Day</div>
            <div className="stat-value">{Math.max(...weeklyProgress.map(day => day.value))}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Active Days</div>
            <div className="stat-value">{weeklyProgress.filter(day => day.value > 0).length}/7</div>
          </div>
        </div>
      </div>
    </div>
  );
}