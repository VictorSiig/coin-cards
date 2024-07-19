// src/components/TradeList.js
import React, { useState, useContext } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import '../styles/TradeList.css';
import TradeModal from './TradeModal';
import SellTradeModal from './SellTradeModal';
import { AuthContext } from '../context/AuthContext';

const TradeList = () => {
  const { user } = useContext(AuthContext);
  const { data: groupedTrades, originalData, error, loading, fetchData } = useFetchData(user ? user.uid : null, 'trades');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [tradeToSell, setTradeToSell] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trades: {error.message}</p>;

  const handleSell = (trade) => {
    setTradeToSell(trade);
    setIsSellModalOpen(true);
  };

  const getRowClass = (trade) => {
    if (trade.ongoing) {
      return 'ongoing';
    } else if (trade.difference > 0) {
      return 'positive';
    } else {
      return 'negative';
    }
  };

  const parseDate = (dateString) => {
    return dateString ? new Date(dateString) : new Date(0); // Handle null dates by setting to epoch time
  };

  const sortedTrades = (trades) => {
    if (sortConfig.key && sortConfig.direction !== 'default') {
      return trades.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key.includes('date')) {
          aValue = parseDate(aValue);
          bValue = parseDate(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return originalData;
      });
    }
    return trades;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'default';
      }
    } else {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });

    // Reset to original data if direction is 'default'
    if (direction === 'default') {
      fetchData();
    }
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return '▲';
      } else if (sortConfig.direction === 'descending') {
        return '▼';
      }
    }
    return '▲▼';
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
                <th onClick={() => requestSort('bought')}>
                  Bought {getSortSymbol('bought')}
                </th>
                <th onClick={() => requestSort('sold')}>
                  Sold {getSortSymbol('sold')}
                </th>
                <th onClick={() => requestSort('difference')}>
                  Difference {getSortSymbol('difference')}
                </th>
                <th onClick={() => requestSort('profits')}>
                  Profits {getSortSymbol('profits')}
                </th>
                <th onClick={() => requestSort('dateEntered')}>
                  Date Entered {getSortSymbol('dateEntered')}
                </th>
                <th onClick={() => requestSort('dateSold')}>
                  Date Sold {getSortSymbol('dateSold')}
                </th>
                <th onClick={() => requestSort('tradeLasted')}>
                  Trade Lasted {getSortSymbol('tradeLasted')}
                </th>
                <th onClick={() => requestSort('ongoing')}>
                  Ongoing {getSortSymbol('ongoing')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades(groupedTrades[coin]).map(trade => (
                <tr key={trade.id} className={getRowClass(trade)}>
                  <td>{trade.bought}</td>
                  <td>{trade.sold}</td>
                  <td>{trade.difference}</td>
                  <td>{trade.profits}</td>
                  <td>{trade.dateEntered}</td>
                  <td>{trade.dateSold}</td>
                  <td>{trade.tradeLasted}</td>
                  <td>{trade.ongoing ? 'Yes' : 'No'}</td>
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