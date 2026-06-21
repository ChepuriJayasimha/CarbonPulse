import React from 'react';

export default function HabitTracker({ 
  habits, 
  toggleHabit, 
  ecoPoints, 
  level, 
  streak 
}) {
  const nextLevelPoints = level * 100;
  const progressPercent = Math.min(100, Math.round((ecoPoints / nextLevelPoints) * 100));

  // Compute daily footprint offset based on checked habits
  const dailyOffset = habits.reduce((acc, h) => {
    return acc + (h.completed ? h.carbonSavings : 0);
  }, 0);

  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Gamification Stats Card */}
      <div className="card col-12">
        <h3 className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Eco Rank & Gamification Status
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
          {/* Level Badge */}
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--accent-gradient)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 12px',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', color: '#000' }}>
                {level}
              </span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-secondary)' }}>
              Eco-Guardian Level
            </span>
          </div>

          {/* Level Progress */}
          <div style={{ flexGrow: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>Experience Points (XP)</span>
              <span>{ecoPoints} / {nextLevelPoints} XP</span>
            </div>
            <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                background: 'var(--accent-gradient)', 
                borderRadius: '5px',
                transition: 'width 0.5s ease' 
              }}></div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Level up by completing daily green habits! Each habit earns <strong>+15 XP</strong>.
            </p>
          </div>

          {/* Streak details */}
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', minWidth: '150px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-secondary)', lineHeight: '1' }}>
              🔥 {streak} Days
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Green Streak</span>
          </div>
        </div>
      </div>

      {/* Checklist and Daily Savings */}
      <div className="card col-8">
        <h3 className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
          Daily Green Action Habits
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
          Check off the environment-friendly habits you completed today to earn XP and reduce today's carbon footprint.
        </p>

        <div className="habit-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-item">
              <div className="habit-info">
                <div className="habit-icon">
                  <span style={{ fontSize: '18px' }}>{habit.emoji}</span>
                </div>
                <div className="habit-details">
                  <h4>{habit.name}</h4>
                  <p>Save {habit.carbonSavings} kg CO₂e | +15 XP</p>
                </div>
              </div>
              <button 
                className={`habit-action-btn ${habit.completed ? 'completed' : ''}`}
                onClick={() => toggleHabit(habit.id)}
              >
                {habit.completed ? '✓ Done' : 'Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Offset Daily Card */}
      <div className="card col-4">
        <h3 className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Today's Offset
        </h3>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '64px', fontWeight: '800', color: 'var(--accent-secondary)', lineHeight: '1', marginBottom: '8px' }}>
            -{dailyOffset.toFixed(1)}
          </div>
          <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: '#fff' }}>
            kg CO₂e Saved Today
          </span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px' }}>
            By checking off habits, you've prevented carbon emissions from entering the atmosphere. Keep it up!
          </p>
        </div>
      </div>

    </div>
  );
}
