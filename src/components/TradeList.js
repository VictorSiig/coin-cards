// src/components/TradeList.js
import React from 'react';
import { useFetchData } from '../hooks/useFetchData';
import '../styles/TradeList.css';

const TradeList = () => {
  const { data: trades, error, loading } = useFetchData('trades');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trades: {error.message}</p>;

  return (
    <div className="trade-list">
      <h2>Your Trades</h2>
      <div className="trade-card">
        <table>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Bought</th>
              <th>Sold</th>
              <th>Difference</th>
              <th>Profits</th>
              <th>Date Entered</th>
              <th>Date Sold</th>
              <th>Trade Lasted</th>
              <th>Ongoing</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id}>
                <td>{trade.coin}</td>
                <td>{trade.bought}</td>
                <td>{trade.sold}</td>
                <td>{trade.difference}</td>
                <td>{trade.profits}</td>
                <td>{trade.dateEntered}</td>
                <td>{trade.dateSold}</td>
                <td>{trade.tradeLasted}</td>
                <td>{trade.ongoing ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeList;
