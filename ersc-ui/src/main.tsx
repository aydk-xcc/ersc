import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import './assets/css/main.css'
import { BrowserRouter } from 'react-router'
import CusRouters from './router/index'
import { Provider } from 'react-redux'
import { store } from './stores'

createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <CusRouters />
    </BrowserRouter>
  </Provider>
)
