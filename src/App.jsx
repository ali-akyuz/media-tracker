import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Film,
  Tv,
  BookOpen,
  NotebookText,
  Calendar as CalendarIcon,
  Search,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Movies from './components/Movies';
import Series from './components/Series';
import Books from './components/Books';
import Notes from './components/Notes';
import WeeklyPlanner from './components/WeeklyPlanner';
import SearchBar from './components/SearchBar';
import SearchResultModal from './components/SearchResultModal';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSearchItem, setSelectedSearchItem] = useState(null);
  const mainContentRef = useRef(null);

  // Check Firebase for existing login
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // First try the locally saved custom name (to prevent race conditions for new signups)
        const localName = localStorage.getItem(`tracker_name_${user.uid}`);
        setUserName(localName || user.displayName || user.email.split('@')[0]);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserName('');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogoClick = () => {
    setActiveTab('dashboard');
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userName={userName} />;
      case 'movies': return <Movies />;
      case 'series': return <Series />;
      case 'books': return <Books />;
      case 'notes': return <Notes />;
      case 'planner': return <WeeklyPlanner />;
      default: return <Dashboard userName={userName} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        Yükleniyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div
          className="sidebar-logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <Film size={28} />
          <span>Media Tracker</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Panel</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <Film size={20} />
            <span>Filmler</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'series' ? 'active' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            <Tv size={20} />
            <span>Diziler</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <BookOpen size={20} />
            <span>Kitaplar</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <NotebookText size={20} />
            <span>Notlar</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'planner' ? 'active' : ''}`}
            onClick={() => setActiveTab('planner')}
          >
            <CalendarIcon size={20} />
            <span>Haftalık Planlayıcı</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
          <button className="nav-link" onClick={handleLogout} style={{ color: 'var(--accent)' }}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" ref={mainContentRef}>
        <header className="topbar">
          <SearchBar onResultClick={(item) => setSelectedSearchItem(item)} />

          <div className="user-profile">
            <button className="icon-btn" style={{ background: 'transparent' }}>
              <Bell size={20} color="var(--text-secondary)" />
            </button>
            <div className="avatar">{userName ? userName.charAt(0).toUpperCase() : 'A'}</div>
          </div>
        </header>

        <div className="page-content">
          {renderContent()}
        </div>
      </main>

      {/* Global Modals */}
      <SearchResultModal 
        item={selectedSearchItem} 
        onClose={() => setSelectedSearchItem(null)} 
      />
    </div>
  );
}

export default App;
