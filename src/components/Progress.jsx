import React from 'react';
import { Trophy, TrendingUp, Award, Target, Flame } from 'lucide-react';

export default function Progress({ workoutHistory, weeklyProgress, userSettings, userName }) {
  const totalWorkouts = workoutHistory.length;
  const currentStreak = 0;
  const personalRecords = 0;

  const achievements = [
    { icon: Flame, title: '7 Day Streak', description: 'Consistent training', unlocked: false },
    { icon: Target, title: 'Goal Crusher', description: 'Hit calorie target 5 days', unlocked: false },
    { icon: Trophy, title: 'Workout Warrior', description: 'Complete 50 workouts', unlocked: false },
    { icon: Award, title: 'Consistency King', description: '30 day streak', unlocked: false }
  ];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Your Progress</h1>
          <div className="user-name-badge">{userName}</div>
        </div>
        <p>Track your fitness journey</p>
      </div>

      <div className="progress-stats">
        <div className="stat-card large">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>

        <div className="stat-card large">
          <div className="stat-icon">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="stat-card large">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{personalRecords}</div>
            <div className="stat-label">Personal Records</div>
          </div>
        </div>
      </div>

      <div className="weekly-overview">
        <h3>This Week's Performance</h3>
        <div className="week-summary">
          <div className="summary-item">
            <span className="label">Average Completion</span>
            <span className="value">{Math.round(weeklyProgress.reduce((sum, day) => sum + day.value, 0) / 7)}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Active Days</span>
            <span className="value">{weeklyProgress.filter(day => day.value > 0).length}/7</span>
          </div>
          <div className="summary-item">
            <span className="label">Best Day</span>
            <span className="value">{Math.max(...weeklyProgress.map(day => day.value))}%</span>
          </div>
        </div>
      </div>

      <div className="achievements">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <Icon size={24} />
                </div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
                {achievement.unlocked && <div className="achievement-badge">✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="motivation">
        <div className="motivation-card">
          <Trophy size={32} />
          <h3>Keep Pushing!</h3>
          <p>You're making great progress. Every workout brings you closer to your goals.</p>
        </div>
      </div>
    </div>
  );
}