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
    // ✅ Join the room
    socket.emit('join-room', roomId);

    // ✅ Receive chat messages
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // ✅ Receive code changes
    socket.on('code-change', (newCode) => {
      setCode(newCode);
    });

    // ✅ Cleanup
    return () => {
      socket.off('chat-message');
      socket.off('code-change');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      // ✅ Emit chat message with roomId
      socket.emit('chat-message', { roomId, message: input });
      setMessages((prev) => [...prev, input]);
      setInput('');
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    // ✅ Emit code change with roomId
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
          onChange={(e) => setInpu
