import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='container mx-auto p-4'>
      <App />
      <ToastContainer />
    </div>
  </StrictMode>,
)
