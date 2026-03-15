import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Film, Tv, BookOpen, X, Loader2 } from 'lucide-react';

const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Let's use public APIs mostly
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org/search.json';

const SearchBar = ({ onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce the search term to avoid hitting API on every single keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        performSearch();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500); // Wait 500ms after user stops typing to start search

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const performSearch = async () => {
    setIsLoading(true);
    setIsOpen(true);

    try {
      // 1. Search OpenLibrary for books (Free, no auth needed)
      let bookResults = [];
      try {
        const bookRes = await axios.get(`${OPEN_LIBRARY_BASE_URL}?q=${encodeURIComponent(query)}&limit=3`);
        bookResults = bookRes.data.docs ? bookRes.data.docs.map((book) => ({
          id: `book-${book.key}`,
          title: book.title,
          year: book.first_publish_year || '',
          author: book.author_name ? book.author_name[0] : 'Bilinmeyen Yazar',
          type: 'book',
          poster: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/60x90/2a2a2a/ededed?text=Kapak+Yok',
          rating: 0
        })) : [];
      } catch (err) {
        console.error("Book Search Error", err);
      }

      // 2. We don't have a TMDB key right now, let's use TVMaze API for movies/series which is open and free
      let tvResults = [];
      try {
        const tvMazeRes = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);

        tvResults = tvMazeRes.data.slice(0, 4).map(item => {
          const show = item.show;
          return {
            id: `show-${show.id}`,
            title: show.name,
            year: show.premiered ? show.premiered.substring(0, 4) : '',
            type: show.type === 'Scripted' ? 'series' : 'movie',
            poster: show.image ? show.image.medium : 'https://via.placeholder.com/60x90/2a2a2a/ededed?text=Afi%C5%9F',
            rating: show.rating?.average || 0,
            genres: show.genres || []
          }
        });
      } catch (err) {
        console.error("TV Search Error", err);
      }

      // Combine and filter results
      setResults([...tvResults, ...bookResults]);

    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultSelect = (item) => {
    onResultClick(item);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="search-container" ref={wrapperRef} style={{ position: 'relative', width: '300px' }}>
      <div className="search-bar" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <Search size={18} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Film, dizi veya kitap ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length > 2) setIsOpen(true) }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '120%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          zIndex: 9,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {isLoading ? (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} className="spin-animation" style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.9rem' }}>Aranıyor...</span>
            </div>
          ) : results.length > 0 ? (
            <div style={{ padding: '0.5rem 0' }}>
              {results.map((item, index) => (
                <div
                  key={`${item.type}-${item.id}-${index}`}
                  onClick={() => handleResultSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderBottom: index !== results.length - 1 ? '1px solid var(--card-border)' : 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.type === 'movie' && <Film size={12} color="var(--accent)" />}
                      {item.type === 'series' && <Tv size={12} color="#3b82f6" />}
                      {item.type === 'book' && <BookOpen size={12} color="#10b981" />}
                      <span>{item.type === 'movie' ? 'Film' : item.type === 'series' ? 'Dizi' : 'Kitap'}</span>
                      {item.year && <span>• {item.year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Piyasa araştırması yapıldı ama "<b>{query}</b>" adına bir şey bulunamadı.
            </div>
          )}
        </div>
      )}

      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
