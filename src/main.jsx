import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { mystore } from './redux/store.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={mystore}>
    <App />
    </Provider>
  </StrictMode>,
)
