// src/components/SellTradeModal.js
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utilities/firebase';
import '../styles/SellTradeModal.css';

const SellTradeModal = ({ userId, trade, onClose, fetchData }) => {
  const [sold, setSold] = useState('');
  const [dateSold, setDateSold] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tradeRef = doc(db, 'users', userId, 'trades', trade.id);
      const difference = parseFloat(sold) - trade.bought;
      const profits = ((difference / trade.bought) * 100).toFixed(2);
      const tradeLasted = calculateTradeLasted(trade.dateEntered, dateSold);

      await updateDoc(tradeRef, {
        sold: parseFloat(sold),
        dateSold,
        difference,
        profits,
        tradeLasted,
        ongoing: false
      });

      fetchData();
      onClose();
    } catch (err) {
      console.error('Error updating trade: ', err);
    }
  };

  const calculateTradeLasted = (dateEntered, dateSold) => {
    const startDate = new Date(dateEntered);
    const endDate = new Date(dateSold);
    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return `${differenceInDays} days`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sell Trade</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Sold</label>
            <input
              type="number"
              value={sold}
              onChange={(e) => setSold(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date Sold</label>
            <input
              type="date"
              value={dateSold}
              onChange={(e) => setDateSold(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sell Trade</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default SellTradeModal;
