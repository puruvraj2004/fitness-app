import React, { useState } from 'react';
import { Plus, Dumbbell, Target } from 'lucide-react';

export default function AddEditExerciseModal({ visible, onClose, newExercise, setNewExercise, onSubmit, editingExercise, setEditingExercise }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);

  if (!visible) return null;

  const current = editingExercise || newExercise;
  const setValue = (field, value) => {
    if (editingExercise) {
      setEditingExercise(prev => ({ ...prev, [field]: value }));
    } else {
      setNewExercise(prev => ({ ...prev, [field]: value }));
    }
  };

  const sampleExercises = {
    chest: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 80, unit: 'kg' },
      { name: 'Push-ups', sets: 3, reps: 15, weight: 0, unit: 'kg' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 25, unit: 'kg' },
      { name: 'Chest Flyes', sets: 3, reps: 12, weight: 15, unit: 'kg' },
      { name: 'Dips', sets: 3, reps: 10, weight: 0, unit: 'kg' }
    ],
    back: [
      { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, unit: 'kg' },
      { name: 'Bent-over Rows', sets: 3, reps: 10, weight: 70, unit: 'kg' },
      { name: 'Lat Pulldowns', sets: 3, reps: 12, weight: 60, unit: 'kg' },
      { name: 'Seated Cable Rows', sets: 3, reps: 12, weight: 50, unit: 'kg' },
      { name: 'Face Pulls', sets: 3, reps: 15, weight: 20, unit: 'kg' }
    ],
    legs: [
      { name: 'Squats', sets: 3, reps: 10, weight: 100, unit: 'kg' },
      { name: 'Deadlifts', sets: 3, reps: 8, weight: 120, unit: 'kg' },
      { name: 'Lunges', sets: 3, reps: 12, weight: 40, unit: 'kg' },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 150, unit: 'kg' },
      { name: 'Calf Raises', sets: 3, reps: 15, weight: 60, unit: 'kg' }
    ],
    shoulders: [
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 50, unit: 'kg' },
      { name: 'Lateral Raises', sets: 3, reps: 12, weight: 12, unit: 'kg' },
      { name: 'Front Raises', sets: 3, reps: 12, weight: 10, unit: 'kg' },
      { name: 'Rear Delt Flyes', sets: 3, reps: 12, weight: 15, unit: 'kg' },
      { name: 'Shrugs', sets: 3, reps: 15, weight: 80, unit: 'kg' }
    ],
    arms: [
      { name: 'Bicep Curls', sets: 3, reps: 12, weight: 20, unit: 'kg' },
      { name: 'Tricep Dips', sets: 3, reps: 12, weight: 0, unit: 'kg' },
      { name: 'Hammer Curls', sets: 3, reps: 12, weight: 18, unit: 'kg' },
      { name: 'Tricep Pushdowns', sets: 3, reps: 12, weight: 30, unit: 'kg' },
      { name: 'Preacher Curls', sets: 3, reps: 10, weight: 25, unit: 'kg' }
    ],
    core: [
      { name: 'Planks', sets: 3, reps: 30, weight: 0, unit: 'kg' },
      { name: 'Russian Twists', sets: 3, reps: 20, weight: 10, unit: 'kg' },
      { name: 'Crunches', sets: 3, reps: 15, weight: 0, unit: 'kg' },
      { name: 'Leg Raises', sets: 3, reps: 12, weight: 0, unit: 'kg' },
      { name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0, unit: 'kg' }
    ]
  };

  const bodyParts = [
    { key: 'chest', label: 'Chest', icon: '💪' },
    { key: 'back', label: 'Back', icon: '🏋️' },
    { key: 'legs', label: 'Legs', icon: '🦵' },
    { key: 'shoulders', label: 'Shoulders', icon: '🤾' },
    { key: 'arms', label: 'Arms', icon: '💥' },
    { key: 'core', label: 'Core', icon: '🔥' }
  ];

  const handleQuickAdd = (exercise) => {
    const mappedExercise = {
      exercise: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      unit: exercise.unit
    };

    if (editingExercise) {
      setEditingExercise(prev => ({ ...prev, ...mappedExercise }));
    } else {
      setNewExercise(mappedExercise);
    }
    setSelectedBodyPart(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card exercise-modal">
        <h3>{editingExercise ? 'Edit Exercise' : 'Add Exercise'}</h3>

        {!selectedBodyPart ? (
          <>
            <div className="quick-add-section">
              <h4>Quick Add from Templates</h4>
              <p>Choose a body part to see sample exercises</p>

              <div className="body-parts-grid">
                {bodyParts.map(part => (
                  <button
                    key={part.key}
                    className="body-part-btn"
                    onClick={() => setSelectedBodyPart(part.key)}
                  >
                    <span className="body-part-icon">{part.icon}</span>
                    <span className="body-part-label">{part.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="manual-add-section">
              <h4>Manual Entry</h4>
            </div>
          </>
        ) : (
          <div className="sample-exercises-section">
            <div className="section-header">
              <button className="back-btn" onClick={() => setSelectedBodyPart(null)}>← Back</button>
              <h4>{bodyParts.find(p => p.key === selectedBodyPart)?.icon} {bodyParts.find(p => p.key === selectedBodyPart)?.label} Exercises</h4>
            </div>

            <div className="sample-exercises-grid">
              {sampleExercises[selectedBodyPart].map((exercise, index) => (
                <button
                  key={index}
                  className="sample-exercise-btn"
                  onClick={() => handleQuickAdd(exercise)}
                >
                  <div className="exercise-name">{exercise.name}</div>
                  <div className="exercise-details">
                    {exercise.sets}×{exercise.reps} {exercise.weight > 0 ? `• ${exercise.weight}${exercise.unit}` : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="exercise-form">
          <label>Exercise</label>
          <input value={current.exercise} onChange={e => setValue('exercise', e.target.value)} placeholder="Exercise name" />

          <div className="form-row">
            <div className="form-group">
              <label>Sets</label>
              <input type="number" value={current.sets} min={1} onChange={e => setValue('sets', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Reps</label>
              <input type="number" value={current.reps} min={1} onChange={e => setValue('reps', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight</label>
              <input type="number" value={current.weight} min={0} onChange={e => setValue('weight', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select value={current.unit} onChange={e => setValue('unit', e.target.value)}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSubmit} className="primary-btn">{editingExercise ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
