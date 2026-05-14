import React from 'react'
import ReactDOM from 'react-dom/client'
import { TopApp, BottomApp } from './App.jsx'
import './index.css'
import './i18n'

// Two React mount points so PHP can server-render the 7 marketing
// content articles as HTML between them. Everything else (navbar, hero
// with H1, tool widget, CTA, footer) stays React-rendered.
const mount = (id, element) => {
  const node = document.getElementById(id);
  if (!node) return;
  ReactDOM.createRoot(node).render(
    <React.StrictMode>{element}</React.StrictMode>
  );
};

mount('akt-root',   <TopApp />);
mount('akt-bottom', <BottomApp />);
