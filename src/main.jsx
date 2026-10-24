import { Buffer } from 'buffer'
// @react-pdf/renderer expects a Node-style Buffer global in the browser.
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installAuthFetch } from './api/authFetch.js'

installAuthFetch()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
