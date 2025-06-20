import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };

  return (
    <div>
      <h1>Welcome to Codemate</h1>
      <button onClick={createRoom}>Create New Room</button>
    </div>
  );
};

export default Home;
