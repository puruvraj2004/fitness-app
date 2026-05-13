import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ workoutHistory }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Get workouts by date
  const getWorkoutsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workoutHistory.filter(w => {
      const workoutDate = new Date(w.completedAt).toISOString().split('T')[0];
      return workoutDate === dateStr;
    });
  };

  // Get all unique dates with workouts
  const getWorkoutDates = () => {
    const dates = new Set();
    workoutHistory.forEach(w => {
      const date = new Date(w.completedAt).toISOString().split('T')[0];
      dates.add(date);
    });
    return dates;
  };

  const workoutDates = getWorkoutDates();

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const generateCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const selectedDate = selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null;
  const selectedWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : [];

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        <div className="calendar-header">
          <h1>Workout Calendar</h1>
          <p>Track your workout history</p>
        </div>

        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button className="calendar-nav-btn" onClick={goToNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateStr = date.toISOString().split('T')[0];
            const hasWorkout = workoutDates.has(dateStr);
            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                className={`calendar-day ${hasWorkout ? 'has-workout' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{day}</span>
                {hasWorkout && <div className="workout-indicator"></div>}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="selected-day-details">
            <h3 className="selected-date">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>

            {selectedWorkouts.length === 0 ? (
              <div className="no-workouts">
                <p>No workouts on this day</p>
              </div>
            ) : (
              <div className="workout-list-details">
                {selectedWorkouts.map((workout) => (
                  <div key={workout.id} className="workout-detail-item">
                    <div className="workout-detail-name">{workout.exercise}</div>
                    <div className="workout-detail-stats">
                      {workout.sets} sets × {workout.reps} reps • {workout.weight}{workout.unit}
                    </div>
                  </div>
                ))}
                <div className="total-workouts">Total: {selectedWorkouts.length} exercise(s)</div>
              </div>
            )}
          </div>
        )}

        <div className="calendar-stats">
          <div className="stat-box">
            <div className="stat-number">{workoutHistory.length}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{workoutDates.size}</div>
            <div className="stat-label">Active Days</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">
              {workoutHistory.length > 0 
                ? (workoutHistory.reduce((sum, w) => sum + (w.sets || 0), 0)) 
                : 0}
            </div>
            <div className="stat-label">Total Sets</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calendar-view {
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .calendar-container {
          flex: 1;
          padding: 20px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          min-height: 100vh;
        }

        .calendar-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .calendar-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
        }

        .calendar-header p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-size: 14px;
        }

        .calendar-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .calendar-nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .calendar-nav-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .calendar-month-year {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .weekday-header {
          text-align: center;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          padding: 8px 0;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .calendar-day {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .calendar-day:not(.empty):hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .calendar-day.empty {
          background: transparent;
          border: none;
          cursor: default;
        }

        .calendar-day.today {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgb(59, 130, 246);
          color: white;
          font-weight: 600;
        }

        .calendar-day.today.selected {
          background: rgba(59, 130, 246, 0.5);
          border-color: rgb(59, 130, 246);
          color: white;
          font-weight: 600;
        }

        .calendar-day.has-workout {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgb(34, 197, 94);
          color: rgb(134, 239, 172);
        }

        .calendar-day.has-workout.today {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgb(34, 197, 94);
          color: rgb(134, 239, 172);
          font-weight: 600;
        }

        .calendar-day.has-workout.selected {
          background: rgba(34, 197, 94, 0.5);
          border-color: rgb(34, 197, 94);
          color: white;
          font-weight: 600;
        }

        .calendar-day.has-workout.today.selected {
          background: rgba(34, 197, 94, 0.6);
          border-color: rgb(34, 197, 94);
          color: white;
          font-weight: 600;
        }

        .calendar-day.selected {
          background: rgba(59, 130, 246, 0.4);
          border-color: rgb(59, 130, 246);
          color: white;
        }

        .day-number {
          font-size: 14px;
        }

        .workout-indicator {
          width: 4px;
          height: 4px;
          background: rgb(34, 197, 94);
          border-radius: 50%;
          margin-top: 2px;
        }

        .selected-day-details {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .selected-date {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0 0 16px 0;
        }

        .no-workouts {
          text-align: center;
          padding: 20px;
          color: rgba(255, 255, 255, 0.5);
        }

        .workout-list-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .workout-detail-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .workout-detail-name {
          font-weight: 600;
          color: white;
          margin-bottom: 6px;
        }

        .workout-detail-stats {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .total-workouts {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .calendar-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.08);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
