// client/src/tests/Chat.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../components/Chat/Chat';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ToastContainer } from 'react-toastify';

// Mock Server Setup
const server = setupServer(
  rest.post('http://localhost:5000/api/chat', (req, res, ctx) => {
    return res(ctx.json({ reply: 'Hello from Zoltan!' }));
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('Chat Component', () => {
  test('renders initial message', () => {
    render(
      <>
        <Chat />
        <ToastContainer />
      </>
    );
    expect(screen.getByText(/Zoltan:/)).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am Zoltan/i)).toBeInTheDocument();
  });

  test('sends a message and receives a reply', async () => {
    render(
      <>
        <Chat />
        <ToastContainer />
      </>
    );

    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send/i);

    // User types a message
    fireEvent.change(input, { target: { value: 'Hi Zoltan!' } });
    fireEvent.click(sendButton);

    // User message appears
    expect(screen.getByText(/You:/)).toBeInTheDocument();
    expect(screen.getByText(/Hi Zoltan!/i)).toBeInTheDocument();

    // Loading indicator appears
    expect(screen.getByText(/Typing.../i)).toBeInTheDocument();

    // Wait for bot reply
    await waitFor(() => {
      expect(screen.getByText(/Hello from Zoltan!/i)).toBeInTheDocument();
    });

    // Loading indicator disappears
    expect(screen.queryByText(/Typing.../i)).not.toBeInTheDocument();
  });

  test('handles server error gracefully', async () => {
    // Override the initial handler to return an error
    server.use(
      rest.post('http://localhost:5000/api/chat', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <>
        <Chat />
        <ToastContainer />
      </>
    );

    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send/i);

    // User types a message
    fireEvent.change(input, { target: { value: 'Hi Zoltan!' } });
    fireEvent.click(sendButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to send message/i)).toBeInTheDocument();
      expect(screen.getByText(/Sorry, something went wrong/i)).toBeInTheDocument();
    });
  });
});
