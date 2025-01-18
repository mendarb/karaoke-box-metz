import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from '@/lib/supabase';

// Amélioration de la gestion de session
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    localStorage.setItem('supabase.auth.token', session?.access_token || '');
    window.location.href = '/'; // Redirection explicite vers la page d'accueil
  }
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('supabase.auth.token');
  }
  if (event === 'TOKEN_REFRESHED') {
    localStorage.setItem('supabase.auth.token', session?.access_token || '');
  }
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);