import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TIMELINE_STEPS = [
  { day: 0, label: 'Day 0', sub: 'Now' },
  { day: 3, label: 'Day +3', sub: 'Early Impact' },
  { day: 7, label: 'Day +7', sub: 'Cascade Effect' },
  { day: 14, label: 'Day +14', sub: 'Regional Crisis' },
];

export default function TimelineSimulator() {
  const { timelineDay, handleSelectTimelineDay } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        const nextIndex = (TIMELINE_STEPS.findIndex(s => s.day === timelineDay) + 1) % TIMELINE_STEPS.length;
        handleSelectTimelineDay(TIMELINE_STEPS[nextIndex].day);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timelineDay, handleSelectTimelineDay]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="med-card" style={{
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      justifyContent: 'space-between'
    }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '190px' }}>
        <Clock size={16} color="#2563eb" />
        <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
          Timeline – Future Simulator
        </span>
      </div>

      {/* Interactive Timeline Track */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        {/* Connecting Line */}
        <div style={{
          position: 'absolute',
          left: '20px',
          right: '20px',
          height: '4px',
          backgroundColor: '#e2e8f0',
          borderRadius: '2px',
          zIndex: 1
        }} />

        {/* Highlighted Progress line */}
        <div style={{
          position: 'absolute',
          left: '20px',
          width: `${(TIMELINE_STEPS.findIndex(s => s.day === timelineDay) / (TIMELINE_STEPS.length - 1)) * 100}%`,
          height: '4px',
          backgroundColor: timelineDay >= 7 ? '#ef4444' : '#2563eb',
          borderRadius: '2px',
          zIndex: 2,
          transition: 'width 0.4s ease, background-color 0.3s ease'
        }} />

        {/* Milestone Steps */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 3
        }}>
          {TIMELINE_STEPS.map((step) => {
            const isActive = timelineDay === step.day;
            const isPassed = timelineDay >= step.day;

            return (
              <div
                key={step.day}
                onClick={() => handleSelectTimelineDay(step.day)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {/* Milestone Node */}
                <div style={{
                  width: isActive ? '18px' : '12px',
                  height: isActive ? '18px' : '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#ffffff' : isPassed ? '#2563eb' : '#cbd5e1',
                  border: isActive ? `4px solid ${step.day >= 7 ? '#ef4444' : '#2563eb'}` : 'none',
                  boxShadow: isActive ? '0 0 10px rgba(37, 99, 235, 0.4)' : 'none',
                  transition: 'all 0.25s ease'
                }} />

                {/* Milestone Labels */}
                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: isActive ? '800' : '600',
                    color: isActive ? '#0f172a' : '#64748b'
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: step.day === 14 ? '#dc2626' : '#94a3b8'
                  }}>
                    {step.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause Simulation' : 'Play Timeline Progression'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          transition: 'all 0.15s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        {isPlaying ? <Pause size={15} fill="#ffffff" /> : <Play size={15} fill="#ffffff" style={{ marginLeft: '2px' }} />}
      </button>
    </div>
  );
}
