import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TradeList from './components/TradeList';
import Login from './pages/Login';
import './styles/Login.css';

function App() {
  return (
    <Router>
      <div className="Login">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/trades" element={<TradeList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
