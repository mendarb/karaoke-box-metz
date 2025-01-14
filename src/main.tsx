import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from '@/lib/supabase';

// Set up Supabase auth persistence
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Store the session in localStorage
    localStorage.setItem('supabase.auth.token', session?.access_token || '');
  }
  if (event === 'SIGNED_OUT') {
    // Clear the session from localStorage
    localStorage.removeItem('supabase.auth.token');
  }
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);