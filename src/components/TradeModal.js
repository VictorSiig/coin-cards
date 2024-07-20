import React, { useState } from 'react';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utilities/firebase';
import '../styles/TradeModal.css';

const TradeModal = ({ userId, onClose, fetchData, existingCoins, fetchCoinNames }) => {
  const [coin, setCoin] = useState('');
  const [bought, setBought] = useState('');
  const [dateEntered, setDateEntered] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tradeRef = doc(collection(db, 'users', userId, 'trades'));
      await setDoc(tradeRef, {
        coin,
        bought: parseFloat(bought),
        sold: null,
        difference: null,
        profits: null,
        dateEntered,
        dateSold: null,
        tradeLasted: null,
        ongoing: true
      });

      // Remove initial trade if exists
      const initialTradeRef = doc(db, 'users', userId, 'trades', 'initialTrade');
      await deleteDoc(initialTradeRef);

      fetchData(); // Refresh data
      fetchCoinNames(); // Fetch updated list of coin names
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
              list="coin-suggestions"
              required
            />
            <datalist id="coin-suggestions">
              {existingCoins.map((coinName) => (
                <option key={coinName} value={coinName} />
              ))}
            </datalist>
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
