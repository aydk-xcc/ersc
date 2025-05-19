import { createRoot } from 'react-dom/client'
import './assets/css/main.css'
import { BrowserRouter } from 'react-router'
import CusRouters from './router/index'
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <CusRouters />
  </BrowserRouter>
)
