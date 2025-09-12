import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App  className=" bg-lime-50"/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
