import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';

export default function SettingsModal({ visible, onClose, settings, onChange, onReset }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dietRef = useRef(null);
  const goalRef = useRef(null);

  const dietOptions = [
    { value: 'non-veg', label: 'Non-veg' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' }
  ];

  const goalOptions = [
    { value: 'maintain', label: 'Maintain' },
    { value: 'bulk', label: 'Bulk' },
    { value: 'cut', label: 'Cut' }
  ];

  const handleSelectChange = (field, value) => {
    onChange(field, value);
    setOpenDropdown(null);
  };

  const getDietLabel = () => dietOptions.find(opt => opt.value === settings.dietType)?.label || 'Select';
  const getGoalLabel = () => goalOptions.find(opt => opt.value === settings.goal)?.label || 'Select';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dietRef.current && !dietRef.current.contains(event.target)) {
        if (goalRef.current && !goalRef.current.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Settings</h3>

        <div className="settings-form">
          <div className="form-group">
            <label>Diet Type</label>
            <div className="custom-select" ref={dietRef}>
              <button
                className={`select-trigger ${openDropdown === 'diet' ? 'open' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'diet' ? null : 'diet')}
              >
                <span>{getDietLabel()}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: openDropdown === 'diet' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </button>
              {openDropdown === 'diet' && (
                <div className="select-options">
                  {dietOptions.map(option => (
                    <button
                      key={option.value}
                      className={`select-option ${settings.dietType === option.value ? 'selected' : ''}`}
                      onClick={() => handleSelectChange('dietType', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Goal</label>
            <div className="custom-select" ref={goalRef}>
              <button
                className={`select-trigger ${openDropdown === 'goal' ? 'open' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'goal' ? null : 'goal')}
              >
                <span>{getGoalLabel()}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: openDropdown === 'goal' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </button>
              {openDropdown === 'goal' && (
                <div className="select-options">
                  {goalOptions.map(option => (
                    <button
                      key={option.value}
                      className={`select-option ${settings.goal === option.value ? 'selected' : ''}`}
                      onClick={() => handleSelectChange('goal', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button className="reset-btn" onClick={onReset}>
            <LogOut size={16} /> Exit & Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
