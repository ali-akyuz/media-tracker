import React, { useState } from 'react';
import { Film, Tv, BookOpen, Activity, Calendar, X } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const Dashboard = ({ userName }) => {
  const { movies: moviesData, series: seriesData, books: booksData } = React.useContext(DataContext);
  const [previewItem, setPreviewItem] = useState(null);

  const moviesWatched = moviesData.filter(m => m.status === 'watched').length;
  const seriesWatched = seriesData.filter(s => s.status === 'completed').length;
  const booksRead = booksData.filter(b => b.status === 'read').length;

  const handlePreview = (item, type) => {
    setPreviewItem({ ...item, mediaType: type });
  };

  const formatName = (name) => {
    if (!name) return 'Aleyna';
    // Sadece adı al
    const first = name.split(' ')[0];
    if (!first) return 'Aleyna';
    // Sadece ilk harfi büyük harfe, diğerlerini küçük harfe çevir
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  };

  const displayName = formatName(userName);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tekrar hoş geldin, {displayName}!</h1>
          <p className="page-subtitle">İşte medya takip özetin.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Film size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{moviesWatched}</span>
            <span className="stat-label">İzlenen Filmler</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Tv size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{seriesWatched}</span>
            <span className="stat-label">Biten Diziler</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <BookOpen size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{booksRead}</span>
            <span className="stat-label">Okunan Kitaplar</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#e50914' }}>
            <Activity size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">5</span>
            <span className="stat-label">Bu haftaki içerikler</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Son Etkinlikler</h2>
      <div className="media-grid">
        {moviesData.slice(0, 1).map(movie => (
          <div className="media-card" key={`movie-${movie.id}`} onClick={() => handlePreview(movie, 'movie')}>
            <div className="media-poster-container">
              <img src={movie.poster} alt={movie.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {movie.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><Film size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{movie.title}</h3>
              <div className="media-meta">
                <span>Film</span>
                <span>{movie.dateWatched}</span>
              </div>
              <p className="media-notes">{movie.notes}</p>
            </div>
          </div>
        ))}

        {seriesData.slice(0, 1).map(series => (
          <div className="media-card" key={`series-${series.id}`} onClick={() => handlePreview(series, 'series')}>
            <div className="media-poster-container">
              <img src={series.poster} alt={series.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {series.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><Tv size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{series.title}</h3>
              <div className="media-meta">
                <span>Dizi</span>
                <span>S{series.season} B{series.episode}</span>
              </div>
              <p className="media-notes">{series.notes}</p>
            </div>
          </div>
        ))}
        
        {booksData.slice(0, 1).map(book => (
          <div className="media-card" key={`book-${book.id}`} onClick={() => handlePreview(book, 'book')}>
            <div className="media-poster-container">
              <img src={book.poster} alt={book.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {book.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><BookOpen size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{book.title}</h3>
              <div className="media-meta">
                <span>{book.author}</span>
                <span>{book.dateFinished}</span>
              </div>
              <p className="media-notes">{book.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-secondary)', maxWidth: '600px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <img 
              src={previewItem.poster} 
              alt={previewItem.title} 
              style={{ width: '200px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
            />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{previewItem.title}</h2>
                <button className="modal-close" onClick={() => setPreviewItem(null)} style={{ margin: '-0.5rem -0.5rem 0 0' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="media-rating" style={{ position: 'static', backgroundColor: 'var(--bg-tertiary)' }}>
                  ★ {previewItem.rating}
                </span>
                
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {previewItem.mediaType === 'movie' && (previewItem.dateWatched ? `İzlendi: ${previewItem.dateWatched}` : 'İzlenmedi')}
                  {previewItem.mediaType === 'series' && `S${previewItem.season} B${previewItem.episode}`}
                  {previewItem.mediaType === 'book' && (previewItem.dateFinished ? `Okundu: ${previewItem.dateFinished}` : 'Okunmadı')}
                </span>
              </div>

              {previewItem.author && (
                <p style={{ color: 'var(--accent)', fontWeight: 500, margin: '0 0 1rem 0' }}>Yazar: {previewItem.author}</p>
              )}

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Kişisel Notlar</h4>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{previewItem.notes || 'Not eklenmemiş.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
