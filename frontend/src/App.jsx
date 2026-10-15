import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LobbyView from './views/LobbyView';
import BoardSetupView from './views/BoardSetupView';

function LobbyRoute() {
  const navigate = useNavigate();
  return <LobbyView onNavigateToArena={() => navigate('/board-setup')} />;
}

function BoardSetupRoute() {
  const navigate = useNavigate();
  return <BoardSetupView onNavigateToLobby={() => navigate('/lobby')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lobby" replace />} />
        <Route path="/lobby" element={<LobbyRoute />} />
        <Route path="/board-setup" element={<BoardSetupRoute />} />
        <Route path="*" element={<Navigate to="/lobby" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
