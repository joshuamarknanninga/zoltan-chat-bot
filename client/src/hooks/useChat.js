// client/src/hooks/useChat.js

import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

/**
 * Custom hook to manage chat state and interactions
 */
export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'Zoltan',
      text: 'Hello! I am Zoltan, your friendly chatbot. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles sending a message to the server and receiving a response
   */
  const handleSendMessage = async () => {
    const userMessage = { sender: 'You', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await api.post('/api/chat', { message: input });
      const botMessage = { sender: 'Zoltan', text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      const errorMessage = { sender: 'Zoltan', text: 'Sorry, something went wrong. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    isLoading,
  };
};
