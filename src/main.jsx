import React from 'react'
import ReactDOM from 'react-dom/client'
import { NavbarApp, ToolApp, BottomApp } from './App.jsx'
import './index.css'
import './i18n'

// Three mount points so PHP can server-render the SEO-critical hero and
// content-section blocks between them. Each root re-uses the shared i18n
// instance imported above.
const mountIfPresent = (id, element) => {
  const node = document.getElementById(id);
  if (!node) return;
  ReactDOM.createRoot(node).render(
    <React.StrictMode>{element}</React.StrictMode>
  );
};

mountIfPresent('akt-navbar', <NavbarApp />);
mountIfPresent('akt-tool',   <ToolApp />);
mountIfPresent('akt-bottom', <BottomApp />);
