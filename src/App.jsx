// src/App.jsx
import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import ErrorBoundary from './Utils/ErrorBoundary';
import Header from './Components/Header/Header';
import { ThemeProvider } from './Providers/ThemeContext';
import AppLayout from './Components/AppLayout/AppLayout';
import Footer from './Components/Footer/Footer';

export const AppContext = createContext();

function App() {
  const [appState, setAppState] = useState(() => {
    const savedState = localStorage.getItem('appState');
    return savedState
      ? JSON.parse(savedState)
      : {
        tabs: {
          'tab-1': { id: 'tab-1', name: 'Tab 1', code: "console.log('SUP!')" }
        },
        activeTabId: 'tab-1',
        font: '',
      };
  });

  // Persist app state to localStorage
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(appState));
  }, [appState]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContext.Provider value={{ appState, updateAppState: setAppState }}>
          <div className='app'>
          <Header />
          <AppLayout />
          <Footer />
          </div>
        </AppContext.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
