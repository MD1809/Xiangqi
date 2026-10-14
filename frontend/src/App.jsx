import React, { useState } from 'react';
import LobbyView from './views/LobbyView';
import BoardSetupView from './views/BoardSetupView';


export default function App() {
  const [currentView, setCurrentView] = useState('LOBBY');

  if (currentView === 'BOARD_SETUP') {
    return <BoardSetupView onNavigateToLobby={() => setCurrentView('LOBBY')} />;
  }

  return <LobbyView onNavigateToArena={() => setCurrentView('BOARD_SETUP')} />;
}
