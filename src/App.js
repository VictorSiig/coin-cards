// src/App.js
import React from 'react';
import Login from './pages/Login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
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
          <button onClick={() => getAuth().signOut()}>Sign Out</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
