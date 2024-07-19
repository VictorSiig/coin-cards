// src/hooks/useFetchData.js
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utilities/firebase';

export const useFetchData = (userId, collectionName) => {
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const querySnapshot = await getDocs(collection(db, `users/${userId}/${collectionName}`));
      const fetchedData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group data by coin
      const groupedData = fetchedData.reduce((acc, trade) => {
        const { coin } = trade;
        if (!acc[coin]) {
          acc[coin] = [];
        }
        acc[coin].push(trade);
        return acc;
      }, {});

      setData(groupedData);
      setOriginalData(groupedData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [userId, collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, originalData, loading, error, fetchData };
};