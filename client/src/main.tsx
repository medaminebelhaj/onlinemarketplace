import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './app/layout/index.css'

import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStors';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
   
  </StrictMode>,
)
