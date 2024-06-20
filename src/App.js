import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from './page/Main';
import Chat from './page/Chat';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;