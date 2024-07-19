// src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from './utilities/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import TradeList from './components/TradeList';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <button onClick={() => auth.signOut()}>Sign Out</button>
          <TradeList />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
