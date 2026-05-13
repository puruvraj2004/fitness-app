import React, { useState } from 'react';
import { ChevronRight, Dumbbell, Target, Flame, Users } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    experience: 'beginner'
  });
  const [errors, setErrors] = useState({});

  const experiences = [
    { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', description: '6+ months training' },
    { id: 'advanced', label: 'Advanced', description: '2+ years training' }
  ];

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (formData.age < 15 || formData.age > 120) newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Dumbbell size={32} />
          </div>
          <h1>FitTrack</h1>
          <p>Your Personal Fitness Companion</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-steps">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="onboarding-step">
            <h2>Let's Get Started! 👋</h2>
            <p className="step-description">Tell us a bit about yourself</p>

            <div className="form-group">
              <label>What's your name?</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>How old are you?</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className={errors.age ? 'input-error' : ''}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Experience Level */}
        {step === 2 && (
          <div className="onboarding-step">
            <h2>Your Experience Level 💪</h2>
            <p className="step-description">This helps us personalize your journey</p>

            <div className="options-grid">
              {experiences.map(exp => (
                <div
                  key={exp.id}
                  className={`option-card ${formData.experience === exp.id ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, experience: exp.id})}
                >
                  <div className="option-title">{exp.label}</div>
                  <div className="option-description">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="onboarding-buttons">
          {step > 1 && (
            <button className="btn-secondary" onClick={handlePrev}>
              Back
            </button>
          )}

          {step < 2 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn-primary btn-complete" onClick={handleComplete}>
              Start Your Journey <Dumbbell size={18} />
            </button>
          )}
        </div>

        {/* Step Counter */}
        <div className="step-counter">Step {step} of 2</div>
      </div>
    </div>
  );
}
