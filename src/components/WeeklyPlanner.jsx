import React from 'react';
import { Calendar as CalendarIcon, Film, Tv, BookOpen } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const WeeklyPlanner = () => {
  const { planner: plannerData } = React.useContext(DataContext);
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  const getIcon = (type) => {
    switch (type) {
      case 'movie': return <Film size={18} className="task-icon" />;
      case 'series': return <Tv size={18} className="task-icon" />;
      case 'book': return <BookOpen size={18} className="task-icon" />;
      default: return null;
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Haftalık Planlayıcı</h1>
          <p className="page-subtitle">Eğlenceni planla</p>
        </div>
      </div>

      <div className="masonry-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {days.map(day => (
          <div className="day-card" key={day}>
            <h3 className="day-name">{day}</h3>
            
            {plannerData[day] && plannerData[day].length > 0 ? (
              plannerData[day].map(task => (
                <div className={`planner-task ${task.type}`} key={task.id}>
                  {getIcon(task.type)}
                  <span>{task.label}</span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                Plan yok
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
