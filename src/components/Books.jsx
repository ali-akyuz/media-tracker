import React, { useState } from 'react';
import { BookOpen, Plus, Heart, MoreHorizontal, X, Upload } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import './ModalStyles.css';

const Books = () => {
  const [activeTab, setActiveTab] = useState('read'); // read, to_read
  const { books, setBooks } = React.useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    rating: '',
    status: 'read',
    dateFinished: '',
    notes: '',
  });

  const filteredBooks = books.filter(b => b.status === activeTab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title) return;

    const bookToAdd = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      poster: Math.random() > 0.5 ? "/images/book_cover_1_1773529286324.png" : "/images/book_cover_2_1773529300755.png", 
      rating: parseFloat(newBook.rating) || 0,
      notes: newBook.notes,
      dateFinished: newBook.dateFinished,
      status: newBook.status
    };

    setBooks(prev => [bookToAdd, ...prev]);
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', rating: '', status: 'read', dateFinished: '', notes: '' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kitaplar</h1>
          <p className="page-subtitle">Kişisel kütüphanen</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Kitap Ekle
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          Okundu
        </button>
        <button 
          className={`tab ${activeTab === 'to_read' ? 'active' : ''}`}
          onClick={() => setActiveTab('to_read')}
        >
          Okunacaklar
        </button>
      </div>

      <div className="media-grid">
        {filteredBooks.map(book => (
          <div className="media-card" key={book.id}>
            <div className="media-poster-container">
              <img src={book.poster} alt={book.title} className="media-poster" />
              <div className="media-overlay">
                <span className="media-rating">★ {book.rating}</span>
                <div className="media-actions">
                  <button className="icon-btn"><Heart size={18} /></button>
                  <button className="icon-btn"><MoreHorizontal size={18} /></button>
                </div>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{book.title}</h3>
              <div className="media-meta">
                <span>{book.author}</span>
                <span>{book.dateFinished ? book.dateFinished : 'Okunmadı'}</span>
              </div>
              <p className="media-notes">{book.notes}</p>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <BookOpen className="empty-icon" />
            <h3>Kitap bulunamadı</h3>
            <p>Bu listeye henüz kitap eklemedin.</p>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Yeni Kitap Ekle</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label className="form-label">Kitap Adı</label>
                <input 
                  type="text" 
                  name="title" 
                  className="form-input" 
                  placeholder="Örn: 1984" 
                  value={newBook.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Yazar</label>
                <input 
                  type="text" 
                  name="author" 
                  className="form-input" 
                  placeholder="Yazar adı..." 
                  value={newBook.author}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Durum</label>
                  <select 
                    name="status" 
                    className="form-select"
                    value={newBook.status}
                    onChange={handleInputChange}
                  >
                    <option value="read">Okundu</option>
                    <option value="to_read">Okunacak</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Puan (0-10)</label>
                  <input 
                    type="number" 
                    name="rating" 
                    className="form-input" 
                    placeholder="Örn: 9.0" 
                    min="0" max="10" step="0.1"
                    value={newBook.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {newBook.status === 'read' && (
                <div className="form-group">
                  <label className="form-label">Bitirme Tarihi</label>
                  <input 
                    type="date" 
                    name="dateFinished" 
                    className="form-input" 
                    value={newBook.dateFinished}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Kişisel Notlar</label>
                <textarea 
                  name="notes" 
                  className="form-input" 
                  placeholder="Kitap hakkındaki düşüncelerin..." 
                  rows="3"
                  value={newBook.notes}
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

export default Books;
