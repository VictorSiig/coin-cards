import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TradeListMain from './components/TradeList/TradeListMain';
import Login from './pages/Login';
import './styles/Login.css';

function App() {
  return (
    <Router basename="/coin-cards">
      <div className="Login">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/trades" element={<TradeListMain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
