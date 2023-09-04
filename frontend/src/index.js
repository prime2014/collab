import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store_settings } from "./redux/store";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store_settings.store}>
      <PersistGate loading={null} persistor={store_settings.persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
