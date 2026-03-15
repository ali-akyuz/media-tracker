import React, { useState } from 'react';
import { Film, User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onLogin(userCredential.user.displayName || userCredential.user.email.split('@')[0], userCredential.user.uid);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Save the exact name locally immediately to prevent race conditions
        const finalName = formData.name || userCredential.user.email.split('@')[0];
        localStorage.setItem(`tracker_name_${userCredential.user.uid}`, finalName);
        
        // Save the actual name to Firebase Profile
        await updateProfile(userCredential.user, { 
          displayName: finalName 
        });

        // Pass the exact name back to App
        onLogin(finalName);
      }
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      if (err.code === 'auth/wrong-password') setError('Hatalı şifre.');
      else if (err.code === 'auth/user-not-found') setError('Böyle bir kullanıcı bulunamadı.');
      else if (err.code === 'auth/email-already-in-use') setError('Bu e-posta zaten kullanımda.');
      else if (err.code === 'auth/weak-password') setError('Şifre en az 6 karakter olmalı.');
      else if (err.code === 'auth/invalid-email') setError('Geçersiz bir e-posta adresi.');
      else if (err.code === 'auth/operation-not-allowed') setError('E-Posta / Şifre girişi Firebase üzerinden aktifleştirilmemiş!');
      else if (err.code === 'auth/configuration-not-found') setError('Lütfen Firebase Konsolundan "Email/Password" giriş yöntemini etkinleştirin!');
      else setError(`Bir hata oluştu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at center, rgba(229, 9, 20, 0.05) 0%, transparent 70%)',
    }}>
      <div className="auth-box fade-in" style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid var(--card-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Film size={32} color="var(--accent)" />
          <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-1px' }}>Media Tracker</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Tekrar Hoş Geldin!' : 'Hesap Oluştur'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isLogin ? 'Medya kütüphanene erişmek için giriş yap.' : 'Kişisel medya takipçine hemen başla.'}
        </p>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(229, 9, 20, 0.1)', 
            color: 'var(--accent)', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                name="name"
                placeholder="Adın Soyadın" 
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', paddingLeft: '2.75rem' }} 
                required={!isLogin}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              name="email"
              placeholder="E-posta Adresin" 
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', paddingLeft: '2.75rem' }} 
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              name="password"
              placeholder="Şifren" 
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', paddingLeft: '2.75rem' }} 
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Bekleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'Hesabın yok mu?' : 'Zaten bir hesabın var mı?'}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            style={{ color: 'var(--accent)', marginLeft: '0.5rem', fontWeight: 600 }}
          >
            {isLogin ? 'Kayıt Ol!' : 'Giriş Yap!'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;
