import React from 'react';
import { User, LogOut } from 'lucide-react';

export default function Profile({ userName, onReset }) {

  return (
    <div className="profile-page">
      {/* User Card */}
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={60} />
        </div>
        <div className="profile-info">
          <h1>{userName}</h1>
          <p className="profile-subtitle">Fitness Enthusiast</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="profile-actions">
        <button className="reset-profile-btn" onClick={onReset}>
          <LogOut size={18} /> Exit & Start Over
        </button>
      </div>
    </div>
  );
}
