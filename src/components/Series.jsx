import React, { useState } from 'react';
import { Tv, Plus, Heart, MoreHorizontal, X, Upload } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import './ModalStyles.css';

const Series = () => {
  const [activeTab, setActiveTab] = useState('watching'); // watching, completed
  const { series, setSeries } = React.useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSeries, setNewSeries] = useState({
    title: '',
    rating: '',
    status: 'watching',
    season: '',
    episode: '',
    notes: '',
  });

  const filteredSeries = series.filter(s => s.status === activeTab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSeries(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSeries = (e) => {
    e.preventDefault();
    if (!newSeries.title) return;

    const seriesToAdd = {
      id: Date.now(),
      title: newSeries.title,
      poster: Math.random() > 0.5 ? "/images/series_poster_1_1773529250205.png" : "/images/series_poster_2_1773529268553.png", 
      rating: parseFloat(newSeries.rating) || 0,
      notes: newSeries.notes,
      season: newSeries.season || 1,
      episode: newSeries.episode || 1,
      status: newSeries.status
    };

    setSeries(prev => [seriesToAdd, ...prev]);
    setIsModalOpen(false);
    setNewSeries({ title: '', rating: '', status: 'watching', season: '', episode: '', notes: '' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Diziler</h1>
          <p className="page-subtitle">Bölümler, sezonlar ve maratonlar</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Dizi Ekle
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'watching' ? 'active' : ''}`}
          onClick={() => setActiveTab('watching')}
        >
          İzlenenler
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Tamamlananlar
        </button>
      </div>

      <div className="media-grid">
        {filteredSeries.map(item => (
          <div className="media-card" key={item.id}>
            <div className="media-poster-container">
              <img src={item.poster} alt={item.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {item.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><Heart size={18} /></button>
                  <button className="icon-btn"><MoreHorizontal size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{item.title}</h3>
              <div className="media-meta">
                <span>S{item.season} B{item.episode}</span>
              </div>
              <p className="media-notes">{item.notes}</p>
            </div>
          </div>
        ))}

        {filteredSeries.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Tv className="empty-icon" />
            <h3>Dizi bulunamadı</h3>
            <p>Bu listeye henüz dizi eklemedin.</p>
          </div>
        )}
      </div>

      {/* Add Series Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Yeni Dizi Ekle</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSeries}>
              <div className="form-group">
                <label className="form-label">Dizi Adı</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-input" 
                  placeholder="Örn: Breaking Bad" 
                  value={newSeries.title}
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
                    value={newSeries.status}
                    onChange={handleInputChange}
                  >
                    <option value="watching">İzleniyor</option>
                    <option value="completed">Tamamlandı</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Puan (0-10)</label>
                  <input 
                    type="number" 
                    name="rating" 
                    className="form-input" 
                    placeholder="Örn: 9.5" 
                    min="0" max="10" step="0.1"
                    value={newSeries.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Sezon</label>
                  <input 
                    type="number" 
                    name="season" 
                    className="form-input" 
                    min="1"
                    value={newSeries.season}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label">Bölüm</label>
                  <input 
                    type="number" 
                    name="episode" 
                    className="form-input" 
                    min="1"
                    value={newSeries.episode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kişisel Notlar</label>
                <textarea 
                  name="notes" 
                  className="form-input" 
                  placeholder="Dizi hakkındaki düşüncelerin..." 
                  rows="3"
                  value={newSeries.notes}
                  onChange={handleInputChange}
                ></textarea>
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

export default Series;
