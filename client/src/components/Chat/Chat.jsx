// client/src/components/Chat/Chat.jsx

import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { useChat } from '../../hooks/useChat';
import { toast } from 'react-toastify';

/**
 * Chat Component - Handles the chat interface and interactions
 */
const Chat = () => {
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    isLoading,
  } = useChat();

  const messagesEndRef = useRef(null);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') {
      toast.warn('Please enter a message.');
      return;
    }
    handleSendMessage();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === 'You' ? styles.user : styles.bot
            }`}
          >
            <div className={styles.sender}>{msg.sender}:</div>
            <div className={styles.text}>{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.sender}>Zoltan:</div>
            <div className={styles.text}>Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles.inputForm} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={isLoading || input.trim() === ''}
          className={styles.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
