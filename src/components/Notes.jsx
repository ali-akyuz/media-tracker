import React, { useState } from 'react';
import { NotebookText, Plus, Edit2, Trash2 } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const Notes = () => {
  const { notes, setNotes } = React.useContext(DataContext);

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kişisel Notlar</h1>
          <p className="page-subtitle">Filmler, diziler ve kitaplar hakkındaki düşüncelerin</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> Yeni Not
        </button>
      </div>

      <div className="masonry-grid">
        {notes.map(note => (
          <div className={`note-card ${note.type}`} key={note.id}>
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <div className="note-actions">
                <button className="icon-btn" style={{ width: '32px', height: '32px' }}>
                  <Edit2 size={16} />
                </button>
                <button 
                  className="icon-btn" 
                  style={{ width: '32px', height: '32px', backgroundColor: 'rgba(229, 9, 20, 0.2)' }}
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 size={16} color="#e50914" />
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{note.content}</p>
            <div className="note-date">
              {new Date(note.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="empty-state">
          <NotebookText className="empty-icon" />
          <h3>Not bulunamadı</h3>
          <p>Düşüncelerini yazmaya başla!</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
