import React, { useContext } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const SearchResultModal = ({ item, onClose }) => {
  const { movies, setMovies, series, setSeries, books, setBooks } = useContext(DataContext);

  if (!item) return null;

  const handleAddToTracker = (status) => {
    const newItem = {
      id: Date.now(),
      title: item.title,
      poster: item.poster,
      rating: 0,
      notes: "Sistemden yeni eklendi, henüz not yok.",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    if (item.type === 'movie') {
      const movieDoc = { 
        ...newItem, 
        status, 
        dateWatched: status === 'watched' ? new Date().toISOString().split('T')[0] : '' 
      };
      setMovies([...movies, movieDoc]);
    } else if (item.type === 'series') {
      const seriesDoc = { 
        ...newItem, 
        status, 
        season: 1, 
        episode: 1 
      };
      setSeries([...series, seriesDoc]);
    } else if (item.type === 'book') {
      const bookDoc = { 
        ...newItem, 
        author: item.author || 'Bilinmeyen Yazar', 
        status, 
        dateFinished: status === 'read' ? new Date().toISOString().split('T')[0] : '' 
      };
      setBooks([...books, bookDoc]);
    }

    onClose();
    alert(`${item.title} listene eklendi!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content fade-in" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          maxWidth: '500px', 
          width: '90%', 
          display: 'flex', 
          gap: '1.5rem', 
          alignItems: 'flex-start' 
        }}
      >
        <img 
          src={item.poster} 
          alt={item.title} 
          style={{ width: '150px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
              {item.title}
            </h2>
            <button className="modal-close" onClick={onClose} style={{ margin: '-0.5rem -0.5rem 0 0' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
              {item.type === 'movie' ? 'Film' : item.type === 'series' ? 'Dizi' : 'Kitap'}
            </span>
            {item.year && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                {item.year}
              </span>
            )}
            {item.author && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                Yazar: {item.author}
              </span>
            )}
          </div>

          {(item.genres && item.genres.length > 0) && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Türler: {item.genres.join(', ')}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Nereye eklemek istersin?</p>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleAddToTracker(item.type === 'movie' ? 'watched' : item.type === 'series' ? 'completed' : 'read')}
                className="btn-primary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <Check size={16} /> 
                {item.type === 'movie' ? 'İzlendi' : item.type === 'series' ? 'Bitti' : 'Okundu'}
              </button>
              
              <button 
                onClick={() => handleAddToTracker(item.type === 'movie' ? 'watchlist' : item.type === 'series' ? 'watching' : 'to_read')}
                className="btn-primary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              >
                <Plus size={16} /> 
                {item.type === 'movie' ? 'İzlenecekler' : item.type === 'series' ? 'İzliyorum' : 'Okunacaklar'}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultModal;
