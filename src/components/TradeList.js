// src/components/TradeList.js
import React, { useState, useContext } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import '../styles/TradeList.css';
import TradeModal from './TradeModal';
import SellTradeModal from './SellTradeModal';
import { AuthContext } from '../context/AuthContext';

const TradeList = () => {
    const { user } = useContext(AuthContext);
    const { data: groupedTrades, error, loading, fetchData } = useFetchData(user ? user.uid : null, 'trades');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [tradeToSell, setTradeToSell] = useState(null);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading trades: {error.message}</p>;
  
    const handleSell = (trade) => {
      setTradeToSell(trade);
      setIsSellModalOpen(true);
    };
  
    return (
      <div className="trade-list">
        <h2>Your Trades</h2>
        <button onClick={() => setIsModalOpen(true)}>Add New Trade</button>
        {isModalOpen && (
          <TradeModal
            userId={user.uid}
            onClose={() => setIsModalOpen(false)}
            fetchData={fetchData}
          />
        )}
        {isSellModalOpen && (
          <SellTradeModal
            userId={user.uid}
            trade={tradeToSell}
            onClose={() => setIsSellModalOpen(false)}
            fetchData={fetchData}
          />
        )}
        {Object.keys(groupedTrades).map(coin => (
          <div key={coin} className="trade-card">
            <h3>{coin}</h3>
            <table>
              <thead>
                <tr>
                  <th>Bought</th>
                  <th>Sold</th>
                  <th>Difference</th>
                  <th>Profits</th>
                  <th>Date Entered</th>
                  <th>Date Sold</th>
                  <th>Trade Lasted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedTrades[coin].map(trade => (
                  <tr key={trade.id}>
                    <td>{trade.bought}</td>
                    <td>{trade.sold}</td>
                    <td>{trade.difference}</td>
                    <td>{trade.profits}</td>
                    <td>{trade.dateEntered}</td>
                    <td>{trade.dateSold}</td>
                    <td>{trade.tradeLasted}</td>
                    <td>
                      {!trade.sold && <button onClick={() => handleSell(trade)}>Sell</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };
  
  export default TradeList;