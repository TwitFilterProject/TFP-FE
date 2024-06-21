import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from './page/Main';
import Chat from './page/Chat';
import Photo from './page/Photo';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/photo' element={<Photo />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;