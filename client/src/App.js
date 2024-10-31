// client/src/App.js

import React from 'react';
import Header from './components/Layout/Header';
import Chat from './components/Chat/Chat';
import styles from './App.module.css';

/**
 * App Component - Root Component of the Application
 */
function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Chat />
      </main>
    </div>
  );
}

export default App;
