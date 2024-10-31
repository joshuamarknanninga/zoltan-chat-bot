// client/src/components/Layout/Header.jsx

import React from 'react';
import styles from './Header.module.css';

/**
 * Header Component - Displays the application title
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Zoltan Chatbot</h1>
    </header>
  );
};

export default Header;
