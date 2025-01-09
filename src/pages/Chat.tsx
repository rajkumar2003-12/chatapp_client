import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Zod {
  chatId: number;
  userId: number;
}

interface Message {
  chatId: number;
  content: string;
}

const socket: Socket = io('http://localhost:3000'); // Your backend URL

const Chat: React.FC<Zod> = ({ chatId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    socket.emit('joinChat', { chatId, userId });

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [chatId, userId]);

  const sendMessage = () => {
    socket.emit('sendMessage', { chatId, userId, content });
    setContent('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.content}</div>
        ))}
      </div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
