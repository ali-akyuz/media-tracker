import React, { useState } from 'react';
import { Film, Plus, Heart, MoreHorizontal, X, Upload } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import './ModalStyles.css';

const Movies = () => {
  const [activeTab, setActiveTab] = useState('watched'); // watched, watchlist
  const { movies, setMovies } = React.useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New movie state
  const [newMovie, setNewMovie] = useState({
    title: '',
    rating: '',
    status: 'watched',
    dateWatched: '',
    notes: '',
  });

  const filteredMovies = movies.filter(m => m.status === activeTab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!newMovie.title) return;

    const movieToAdd = {
      id: Date.now(),
      title: newMovie.title,
      // For demo purposes, assign a random poster if not uploaded
      poster: Math.random() > 0.5 ? "/images/movie_poster_1_1773529217886.png" : "/images/movie_poster_2_1773529231659.png", 
      rating: parseFloat(newMovie.rating) || 0,
      notes: newMovie.notes,
      dateWatched: newMovie.dateWatched,
      status: newMovie.status
    };

    setMovies(prev => [movieToAdd, ...prev]);
    setIsModalOpen(false);
    setNewMovie({ title: '', rating: '', status: 'watched', dateWatched: '', notes: '' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Filmler</h1>
          <p className="page-subtitle">Sinema yolculuğunu takip et</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Film Ekle
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          İzlenenler
        </button>
        <button 
          className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          İzlenecekler
        </button>
      </div>

      <div className="media-grid">
        {filteredMovies.map(movie => (
          <div className="media-card" key={movie.id}>
            <div className="media-poster-container">
              <img src={movie.poster} alt={movie.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {movie.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><Heart size={18} /></button>
                  <button className="icon-btn"><MoreHorizontal size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{movie.title}</h3>
              <div className="media-meta">
                <span>{movie.dateWatched ? movie.dateWatched : 'İzlenmedi'}</span>
              </div>
              <p className="media-notes">{movie.notes}</p>
            </div>
          </div>
        ))}

        {filteredMovies.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Film className="empty-icon" />
            <h3>Film bulunamadı</h3>
            <p>Bu listeye henüz film eklemedin.</p>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Yeni Film Ekle</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddMovie}>
              <div className="form-group">
                <label className="form-label">Film Adı</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-input" 
                  placeholder="Örn: Matrix" 
                  value={newMovie.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Durum</label>
                  <select 
                    name="status" 
                    className="form-select"
                    value={newMovie.status}
                    onChange={handleInputChange}
                  >
                    <option value="watched">İzlendi</option>
                    <option value="watchlist">İzlenecek</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Puan (0-10)</label>
                  <input 
                    type="number" 
                    name="rating" 
                    className="form-input" 
                    placeholder="Örn: 8.5" 
                    min="0" max="10" step="0.1"
                    value={newMovie.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {newMovie.status === 'watched' && (
                <div className="form-group">
                  <label className="form-label">İzlenme Tarihi</label>
                  <input 
                    type="date" 
                    name="dateWatched" 
                    className="form-input" 
                    value={newMovie.dateWatched}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Kişisel Notlar</label>
                <textarea 
                  name="notes" 
                  className="form-input" 
                  placeholder="Film hakkındaki düşüncelerin..." 
                  rows="3"
                  value={newMovie.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Afiş Yükle</label>
                <div style={{ 
                  border: '2px dashed var(--card-border)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '2rem', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}>
                  <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Bilgisayarından bir görsel seç (Demo)</p>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
