import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';

function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    socket.emit('join-room', roomId);

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('code-change', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('chat-message');
      socket.off('code-change');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat-message', { roomId, message: input });
      setMessages((prev) => [...prev, input]);
      setInput('');
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit('code-change', { roomId, code: newCode });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <h2>Room ID: {roomId}</h2>

      <textarea
        ref={editorRef}
        value={code}
        onChange={handleCodeChange}
        placeholder="Start typing code..."
        rows={10}
        cols={80}
        style={{ fontFamily: 'monospace', fontSize: '1rem' }}
      />

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <ul>
        {messages.map((msg, i) => (
          <li key={i} style={{ textAlign: 'left' }}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default Room;
