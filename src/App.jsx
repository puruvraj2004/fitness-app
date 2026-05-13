import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  TrendingUp,
  Dumbbell,
  Calendar,
  Award,
  Target,
  ChevronRight,
  Plus,
  Flame,
  Clock,
  BarChart3,
  X,
  Edit2,
  Trash2,
  Check,
  Save,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import WorkoutList from './components/WorkoutList';
import AddEditExerciseModal from './components/AddEditExerciseModal';
import SettingsModal from './components/SettingsModal';
import StatsGrid from './components/StatsGrid';
import WeeklyProgress from './components/WeeklyProgress';
import BottomNav from './components/BottomNav';
import Progress from './components/Progress';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import ScrollAnimation from './components/ScrollAnimation';
import CalendarView from './components/CalendarView';

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useLocalStorageState('onboardingComplete', false);
  const [userName, setUserName] = useLocalStorageState('userName', '');
  
  const [activeTab, setActiveTab] = useLocalStorageState('activeTab', 'workout');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEditExercise, setShowEditExercise] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingExercise, setEditingExercise] = useLocalStorageState('editingExercise', null);

  const [workouts, setWorkouts] = useLocalStorageState('workouts', []);
  
  const [weeklySchedule, setWeeklySchedule] = useLocalStorageState('weeklySchedule', {
    Monday: { parts: [], note: '', exercises: [] },
    Tuesday: { parts: [], note: '', exercises: [] },
    Wednesday: { parts: [], note: '', exercises: [] },
    Thursday: { parts: [], note: '', exercises: [] },
    Friday: { parts: [], note: '', exercises: [] },
    Saturday: { parts: [], note: '', exercises: [] },
    Sunday: { parts: [], note: '', exercises: [] }
  });
  const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);
  const [selectedPlannerDay, setSelectedPlannerDay] = useState('Sunday');
  const [selectedPlannerBodyPart, setSelectedPlannerBodyPart] = useState('Chest');
  const [tempSchedule, setTempSchedule] = useState(() => JSON.parse(JSON.stringify(weeklySchedule)));
  const [selectedDayDropdown, setSelectedDayDropdown] = useState({});
  const [expandedDayDropdowns, setExpandedDayDropdowns] = useState({});
  const [dayFeatures, setDayFeatures] = useState({
    Monday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Tuesday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Wednesday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Thursday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Friday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Saturday: { trainingType: '', difficulty: '', duration: '', equipment: '' },
    Sunday: { trainingType: '', difficulty: '', duration: '', equipment: '' }
  });

  const handleDayDropdownChange = (day, bodyPart) => {
    if (bodyPart) {
      openWeeklyPlanner(day, bodyPart);
    }
    setSelectedDayDropdown(prev => ({ ...prev, [day]: '' }));
  };

  const handleFeatureChange = (day, feature, value) => {
    setDayFeatures(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [feature]: value
      }
    }));
  };

  const toggleDayDropdown = (day) => {
    setExpandedDayDropdowns(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const bodyPartOptions = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Cardio', 'Full Body'];
  const trainingTypeOptions = ['Strength Training', 'Hypertrophy', 'Endurance', 'Power', 'Cardio', 'HIIT', 'CrossFit', 'Yoga', 'Rest'];
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const durationOptions = ['15 min', '30 min', '45 min', '60 min', '75 min', '90 min', '120 min'];
  const equipmentOptions = ['Bodyweight', 'Dumbbells', 'Barbells', 'Machines', 'Mixed', 'None'];

  const sampleExercises = {
    Chest: [
      { name: 'Bench Press', sets: 4, reps: 10, weight: 80, unit: 'kg' },
      { name: 'Incline Dumbbell Press', sets: 4, reps: 10, weight: 24, unit: 'kg' },
      { name: 'Chest Flyes', sets: 3, reps: 12, weight: 16, unit: 'kg' }
    ],
    Back: [
      { name: 'Pull-ups', sets: 4, reps: 8, weight: 0, unit: 'kg' },
      { name: 'Bent-over Rows', sets: 4, reps: 10, weight: 70, unit: 'kg' },
      { name: 'Lat Pulldowns', sets: 3, reps: 12, weight: 60, unit: 'kg' }
    ],
    Legs: [
      { name: 'Squats', sets: 4, reps: 10, weight: 100, unit: 'kg' },
      { name: 'Deadlifts', sets: 4, reps: 8, weight: 120, unit: 'kg' },
      { name: 'Leg Press', sets: 4, reps: 12, weight: 150, unit: 'kg' }
    ],
    Shoulders: [
      { name: 'Overhead Press', sets: 4, reps: 10, weight: 50, unit: 'kg' },
      { name: 'Lateral Raises', sets: 3, reps: 12, weight: 12, unit: 'kg' },
      { name: 'Front Raises', sets: 3, reps: 12, weight: 10, unit: 'kg' }
    ],
    Biceps: [
      { name: 'Bicep Curls', sets: 4, reps: 12, weight: 22, unit: 'kg' },
      { name: 'Hammer Curls', sets: 4, reps: 12, weight: 18, unit: 'kg' },
      { name: 'Preacher Curls', sets: 3, reps: 10, weight: 24, unit: 'kg' }
    ],
    Triceps: [
      { name: 'Tricep Dips', sets: 4, reps: 12, weight: 0, unit: 'kg' },
      { name: 'Tricep Pushdowns', sets: 4, reps: 12, weight: 32, unit: 'kg' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: 12, weight: 16, unit: 'kg' }
    ],
    Core: [
      { name: 'Planks', sets: 3, reps: 60, weight: 0, unit: 'sec' },
      { name: 'Russian Twists', sets: 3, reps: 20, weight: 10, unit: 'kg' },
      { name: 'Leg Raises', sets: 3, reps: 15, weight: 0, unit: 'kg' }
    ],
    Cardio: [
      { name: 'Running', sets: 1, reps: 1, weight: 0, unit: 'km' },
      { name: 'Cycling', sets: 1, reps: 1, weight: 0, unit: 'km' },
      { name: 'Rowing', sets: 1, reps: 1, weight: 0, unit: 'km' }
    ],
    'Full Body': [
      { name: 'Burpees', sets: 4, reps: 12, weight: 0, unit: 'kg' },
      { name: 'Thrusters', sets: 4, reps: 10, weight: 30, unit: 'kg' },
      { name: 'Kettlebell Swings', sets: 4, reps: 15, weight: 24, unit: 'kg' }
    ]
  };

  const [userSettings, setUserSettings] = useLocalStorageState('userSettings', {
    goal: 'maintain',
    calorieTarget: 2000,
    proteinTarget: 140,
    carbsTarget: 200,
    fatsTarget: 60,
    gender: '',
    height: '',
    weight: '',
    activityLevel: 'lightly',
    experience: 'beginner'
  });

  const [workoutHistory, setWorkoutHistory] = useLocalStorageState('workoutHistory', []);

  const [newExercise, setNewExercise] = React.useState({ exercise: '', sets: 3, reps: 10, weight: 0, unit: 'kg' });

  const addExercise = () => {
    if (!newExercise.exercise.trim()) return;
    const exercise = { ...newExercise, id: Date.now(), completed: false, date: new Date().toISOString() };
    setWorkouts(prev => [...prev, exercise]);
    setNewExercise({ exercise: '', sets: 3, reps: 10, weight: 0, unit: 'kg' });
    setShowAddExercise(false);
  };

  const deleteExercise = (id) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    
    // Check if it's a scheduled exercise
    const isScheduled = weeklySchedule[today]?.exercises.some(ex => ex.id === id);
    
    if (isScheduled) {
      // Remove from scheduled exercises
      setWeeklySchedule(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          exercises: prev[today].exercises.filter(ex => ex.id !== id)
        }
      }));
    } else {
      // Remove from manual workouts
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
  };

  const toggleComplete = (id) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    
    // Check if it's a scheduled exercise
    const isScheduled = weeklySchedule[today]?.exercises.some(ex => ex.id === id);
    
    if (isScheduled) {
      // Handle scheduled exercise completion
      setWeeklySchedule(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          exercises: prev[today].exercises.map(ex => {
            if (ex.id !== id) return ex;
            const updated = { ...ex, completed: !ex.completed };
            if (updated.completed) {
              setWorkoutHistory(history => [...history, { ...updated, completedAt: new Date().toISOString() }]);
            }
            return updated;
          })
        }
      }));
    } else {
      // Handle manual workout completion
      setWorkouts(prev => prev.map(w => {
        if (w.id !== id) return w;
        const updated = { ...w, completed: !w.completed };
        if (updated.completed) {
          setWorkoutHistory(history => [...history, { ...updated, completedAt: new Date().toISOString() }]);
        }
        return updated;
      }));
    }
  };

  const startEditExercise = (workout) => {
    setEditingExercise(workout);
    setShowEditExercise(true);
  };

  const saveEditExercise = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    
    // Check if it's a scheduled exercise
    const isScheduled = weeklySchedule[today]?.exercises.some(ex => ex.id === editingExercise.id);
    
    if (isScheduled) {
      // Update in scheduled exercises
      setWeeklySchedule(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          exercises: prev[today].exercises.map(ex => (ex.id === editingExercise.id ? editingExercise : ex))
        }
      }));
    } else {
      // Update in manual workouts
      setWorkouts(prev => prev.map(w => (w.id === editingExercise.id ? editingExercise : w)));
    }
    
    setEditingExercise(null);
    setShowEditExercise(false);
  };

  const openWeeklyPlanner = (day = 'Sunday', bodyPart = 'Chest') => {
    setTempSchedule(JSON.parse(JSON.stringify(weeklySchedule)));
    setSelectedPlannerDay(day);
    setSelectedPlannerBodyPart(bodyPart);
    setShowWeeklyPlanner(true);
  };

  const togglePlannerPart = (part) => {
    setTempSchedule(prev => {
      const currentParts = prev[selectedPlannerDay].parts;
      const hasPart = currentParts.includes(part);
      return {
        ...prev,
        [selectedPlannerDay]: {
          ...prev[selectedPlannerDay],
          parts: hasPart ? currentParts.filter(item => item !== part) : [...currentParts, part]
        }
      };
    });
  };

  const addPlannerExercise = (exercise) => {
    setTempSchedule(prev => {
      const currentPlan = prev[selectedPlannerDay];
      const nextExercise = {
        ...exercise,
        id: Date.now() + Math.random(),
        bodyPart: selectedPlannerBodyPart
      };
      return {
        ...prev,
        [selectedPlannerDay]: {
          ...currentPlan,
          exercises: [...currentPlan.exercises, nextExercise],
          parts: currentPlan.parts.includes(selectedPlannerBodyPart)
            ? currentPlan.parts
            : [...currentPlan.parts, selectedPlannerBodyPart]
        }
      };
    });
  };

  const removePlannerExercise = (exerciseId) => {
    setTempSchedule(prev => {
      const currentPlan = prev[selectedPlannerDay];
      return {
        ...prev,
        [selectedPlannerDay]: {
          ...currentPlan,
          exercises: currentPlan.exercises.filter(ex => ex.id !== exerciseId)
        }
      };
    });
  };

  const updatePlannerNote = (value) => {
    setTempSchedule(prev => ({
      ...prev,
      [selectedPlannerDay]: {
        ...prev[selectedPlannerDay],
        note: value
      }
    }));
  };

  const saveWeeklyPlanner = () => {
    setWeeklySchedule(tempSchedule);
    setShowWeeklyPlanner(false);
  };

  const updateSettings = (field, value) => {
    setUserSettings(prev => {
      const next = { ...prev, [field]: value };

      if (field === 'goal') {
        if (value === 'bulk') {
          next.calorieTarget = 2800;
          next.proteinTarget = 180;
          next.carbsTarget = 320;
          next.fatsTarget = 80;
        } else if (value === 'cut') {
          next.calorieTarget = 1800;
          next.proteinTarget = 160;
          next.carbsTarget = 140;
          next.fatsTarget = 50;
        } else {
          next.calorieTarget = 2200;
          next.proteinTarget = 150;
          next.carbsTarget = 220;
          next.fatsTarget = 65;
        }
      }
      return next;
    });
  };

  const handleOnboardingComplete = (data) => {
    setUserName(data.name);
    setUserSettings({
      goal: 'maintain',
      calorieTarget: 2000,
      proteinTarget: 140,
      carbsTarget: 200,
      fatsTarget: 60,
      gender: '',
      height: '',
      weight: '',
      activityLevel: 'lightly',
      experience: data.experience
    });
    setOnboardingComplete(true);
    setActiveTab('workout');
  };

  const handleReset = () => {
    setOnboardingComplete(false);
    setUserName('');
    setWorkouts([]);
    setWorkoutHistory([]);
    setShowSettings(false);
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayWorkouts = workoutHistory.filter(w => new Date(w.completedAt).toDateString() === today);
    return { count: todayWorkouts.length, time: todayWorkouts.length * 3, completed: todayWorkouts.length };
  };

  const getWeeklyProgress = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const dateStr = date.toDateString();
      const dayWorkouts = workoutHistory.filter(w => new Date(w.completedAt).toDateString() === dateStr);
      const completion = dayWorkouts.length > 0 ? Math.min((dayWorkouts.length / 4) * 100, 100) : 0;
      return { day: days[date.getDay()], value: Math.round(completion) };
    });
  };

  const todayStats = useMemo(getTodayStats, [workoutHistory]);
  const weeklyProgress = useMemo(getWeeklyProgress, [workoutHistory]);

  const getTodayScheduledExercises = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    return weeklySchedule[today]?.exercises || [];
  };

  const todayScheduledExercises = useMemo(getTodayScheduledExercises, [weeklySchedule]);
  const allTodayExercises = useMemo(() => [...todayScheduledExercises, ...workouts], [todayScheduledExercises, workouts]);

  const renderContent = () => {
    switch (activeTab) {
      case 'workout':
        return (
          <main className="workout-page">
            <ScrollAnimation userName={userName} />

            <section className="hero-section">
              <div className="hero-gradient" />
              <div className="hero-content">
                <div className="hero-top">
                  <div className="user-name-badge">{userName}</div>
                </div>
                <h1>Ready to Push Limits?</h1>
                <p className="hero-subtitle">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} • Training Day</p>
              </div>
            </section>

            <StatsGrid userSettings={userSettings} todayStats={todayStats} />

            <div className="section">
              <div className="section-header">
                <h2>Weekly Split</h2>
                <button className="add-btn" onClick={() => openWeeklyPlanner()}><Plus size={18} /> Customize Weekly Split</button>
              </div>

              <div className="week-plan-grid">
                {Object.entries(weeklySchedule).map(([day, plan]) => (
                  <div key={day} className="day-plan-card">
                    <div className="day-plan-header">
                      <h3>{day}</h3>
                      <button className="edit-day-btn" onClick={() => openWeeklyPlanner(day)}>{plan.exercises.length ? 'Manage' : 'Plan'}</button>
                    </div>
                    <div className="day-dropdown-section">
                      <button 
                        className="day-expand-btn"
                        onClick={() => toggleDayDropdown(day)}
                      >
                        {expandedDayDropdowns[day] ? 'Hide Options' : 'Show Options'} ▼
                      </button>
                      {expandedDayDropdowns[day] && (
                        <div className="feature-dropdowns-expanded">
                          <select
                            value={dayFeatures[day].trainingType}
                            onChange={(e) => handleFeatureChange(day, 'trainingType', e.target.value)}
                            className="day-feature-dropdown"
                          >
                            <option value="">Training Type</option>
                            {trainingTypeOptions.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>

                          <select
                            value={dayFeatures[day].difficulty}
                            onChange={(e) => handleFeatureChange(day, 'difficulty', e.target.value)}
                            className="day-feature-dropdown"
                          >
                            <option value="">Difficulty Level</option>
                            {difficultyOptions.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>

                          <select
                            value={dayFeatures[day].duration}
                            onChange={(e) => handleFeatureChange(day, 'duration', e.target.value)}
                            className="day-feature-dropdown"
                          >
                            <option value="">Duration</option>
                            {durationOptions.map(duration => (
                              <option key={duration} value={duration}>{duration}</option>
                            ))}
                          </select>

                          <select
                            value={dayFeatures[day].equipment}
                            onChange={(e) => handleFeatureChange(day, 'equipment', e.target.value)}
                            className="day-feature-dropdown"
                          >
                            <option value="">Equipment</option>
                            {equipmentOptions.map(equipment => (
                              <option key={equipment} value={equipment}>{equipment}</option>
                            ))}
                          </select>

                          <select
                            value={selectedDayDropdown[day] || ''}
                            onChange={(e) => handleDayDropdownChange(day, e.target.value)}
                            className="day-feature-dropdown body-part-dropdown"
                          >
                            <option value="">Add Body Part</option>
                            {bodyPartOptions.map(part => (
                              <option key={part} value={part}>{part}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {plan.parts.length ? (
                      <div className="day-plan-tags">
                        {plan.parts.map(part => (
                          <button key={part} type="button" className="plan-chip" onClick={() => openWeeklyPlanner(day, part)}>{part}</button>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-note">No focus assigned yet.</p>
                    )}
                    {plan.exercises.length > 0 && (
                      <div className="day-plan-exercises">
                        {plan.exercises.map(ex => (
                          <div key={ex.id} className="plan-exercise-item">{ex.bodyPart}: {ex.name} ({ex.sets}×{ex.reps})</div>
                        ))}
                      </div>
                    )}
                    {plan.note && <p className="day-plan-note">{plan.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <h2>{new Date().toLocaleDateString(undefined, { weekday: 'long' })}'s Training</h2>
                <button className="add-btn" onClick={() => setShowAddExercise(true)}><Plus size={18} /> Add Exercise</button>
              </div>

              <WorkoutList workouts={allTodayExercises} onToggleComplete={toggleComplete} onDelete={deleteExercise} onEdit={startEditExercise} />
            </div>
          </main>
        );
      case 'progress':
        return <Progress workoutHistory={workoutHistory} weeklyProgress={weeklyProgress} userSettings={userSettings} userName={userName} />;
      case 'calendar':
        return <CalendarView workoutHistory={workoutHistory} />;
      case 'profile':
        return <Profile userName={userName} onReset={handleReset} />;
      default:
        return null;
    }
  };

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="app-shell">
      {renderContent()}

      <AddEditExerciseModal
        visible={showAddExercise || showEditExercise}
        onClose={() => { setShowAddExercise(false); setShowEditExercise(false); setEditingExercise(null); }}
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        editingExercise={showEditExercise ? editingExercise : null}
        setEditingExercise={setEditingExercise}
        onSubmit={showEditExercise ? saveEditExercise : addExercise}
      />

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} settings={userSettings} onChange={updateSettings} onReset={handleReset} />

      {showWeeklyPlanner && (
        <div className="modal-overlay">
          <div className="modal-card exercise-modal">
            <h3>Weekly Split Planner</h3>
            <div className="planner-days-row">
              {Object.keys(weeklySchedule).map(day => (
                <button
                  key={day}
                  className={`planner-day-btn ${selectedPlannerDay === day ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPlannerDay(day);
                    setSelectedPlannerBodyPart(tempSchedule[day].parts[0] || 'Chest');
                  }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="planner-section">
              <h4>{selectedPlannerDay}</h4>
              <p className="planner-instruction">Pick a body part first, then add exercises for this day.</p>
              <div className="body-parts-grid planner-grid">
                {bodyPartOptions.map(part => (
                  <button
                    type="button"
                    key={part}
                    className={`body-part-btn ${selectedPlannerBodyPart === part ? 'selected' : ''}`}
                    onClick={() => setSelectedPlannerBodyPart(part)}
                  >
                    {part}
                  </button>
                ))}
              </div>

              <div className="sample-exercise-section">
                <h4>{selectedPlannerBodyPart} Exercises</h4>
                <div className="sample-exercises-grid">
                  {sampleExercises[selectedPlannerBodyPart]?.map((exercise, index) => (
                    <button
                      key={index}
                      type="button"
                      className="sample-exercise-btn"
                      onClick={() => addPlannerExercise(exercise)}
                    >
                      <div className="exercise-name">{exercise.name}</div>
                      <div className="exercise-details">{exercise.sets}×{exercise.reps} {exercise.weight > 0 ? `${exercise.weight}${exercise.unit}` : ''}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="planner-exercise-list">
                <h4>Planned Exercises</h4>
                {tempSchedule[selectedPlannerDay].exercises.length ? (
                  tempSchedule[selectedPlannerDay].exercises.map(ex => (
                    <div key={ex.id} className="planned-exercise-row">
                      <div>{ex.bodyPart}: {ex.name} ({ex.sets}×{ex.reps})</div>
                      <button type="button" className="delete-plan-btn" onClick={() => removePlannerExercise(ex.id)}>Remove</button>
                    </div>
                  ))
                ) : (
                  <p className="empty-note">No exercises added for {selectedPlannerDay} yet.</p>
                )}
              </div>

              <label>Notes (optional)</label>
              <textarea
                value={tempSchedule[selectedPlannerDay].note}
                onChange={e => updatePlannerNote(e.target.value)}
                placeholder="Add details for this day"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowWeeklyPlanner(false)}>Cancel</button>
              <button onClick={saveWeeklyPlanner} className="primary-btn">Save Split</button>
            </div>
          </div>
        </div>
      )}

      {!(showAddExercise || showEditExercise || showSettings || showWeeklyPlanner) && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
