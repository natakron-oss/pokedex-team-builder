import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { TeamProvider } from './context/TeamContext.jsx'
import './index.css'

// R4: TeamProvider ครอบทุกอย่างที่ต้องใช้ทีม (Nav + ทุกหน้า) — อยู่ใต้ BrowserRouter ก็ได้เพราะไม่พึ่ง router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TeamProvider>
        <App />
      </TeamProvider>
    </BrowserRouter>
  </StrictMode>,
)
