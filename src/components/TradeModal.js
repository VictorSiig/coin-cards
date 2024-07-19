// src/components/TradeModal.js
import React, { useState } from 'react';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utilities/firebase';
import '../styles/TradeModal.css';

const TradeModal = ({ userId, onClose, fetchData }) => {
  const [coin, setCoin] = useState('');
  const [bought, setBought] = useState('');
  const [sold, setSold] = useState('');
  const [dateEntered, setDateEntered] = useState('');
  const [dateSold, setDateSold] = useState('');
  const [tradeLasted, setTradeLasted] = useState('');
  const [ongoing, setOngoing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tradeRef = doc(collection(db, 'users', userId, 'trades'));
      await setDoc(tradeRef, {
        coin,
        bought: parseFloat(bought),
        sold: parseFloat(sold),
        difference: parseFloat(sold) - parseFloat(bought),
        profits: parseFloat(sold) - parseFloat(bought),
        dateEntered,
        dateSold,
        tradeLasted,
        ongoing
      });

      // Remove initial trade if exists
      const initialTradeRef = doc(db, 'users', userId, 'trades', 'initialTrade');
      await deleteDoc(initialTradeRef);

      fetchData(); // Refresh data
      onClose();
    } catch (err) {
      console.error('Error adding trade: ', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Trade</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Coin</label>
            <input
              type="text"
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Bought</label>
            <input
              type="number"
              value={bought}
              onChange={(e) => setBought(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date Entered</label>
            <input
              type="date"
              value={dateEntered}
              onChange={(e) => setDateEntered(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Trade</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
