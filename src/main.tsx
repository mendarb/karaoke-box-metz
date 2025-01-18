import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from '@/lib/supabase';

// Amélioration de la gestion de session
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event);
  
  if (event === 'SIGNED_IN') {
    // Ne pas rediriger si on est déjà sur la page de callback
    if (!window.location.pathname.includes('/auth/callback')) {
      window.location.href = '/';
    }
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