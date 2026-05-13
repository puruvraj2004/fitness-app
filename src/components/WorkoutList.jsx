import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';

export default function WorkoutList({ workouts, onToggleComplete, onDelete, onEdit }) {
  return (
    <div className="workout-list">
      {workouts.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏋️</div>
          <p>No exercises yet. Add your first workout!</p>
        </div>
      ) : (
        workouts.map((workout) => {
          // Handle both manual exercises (use 'exercise') and scheduled exercises (use 'name')
          const exerciseName = workout.exercise || workout.name;
          const bodyPart = workout.bodyPart ? `${workout.bodyPart} • ` : '';
          
          return (
            <div key={workout.id} className={`workout-item ${workout.completed ? 'completed' : ''}`}>
              <button className="workout-checkbox" onClick={() => onToggleComplete(workout.id)}>
                {workout.completed ? <Check size={16} /> : <span />}
              </button>
              <div className="workout-details">
                <div className="workout-name">{exerciseName}</div>
                <div className="workout-meta">{bodyPart}{workout.sets} sets × {workout.reps} reps • {workout.weight}{workout.unit}</div>
              </div>
              <div className="workout-actions">
                <button className="action-btn" onClick={() => onEdit(workout)}><Edit2 size={16} /></button>
                <button className="action-btn delete" onClick={() => onDelete(workout.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
