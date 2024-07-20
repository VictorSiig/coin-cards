import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../utilities/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, collection } from 'firebase/firestore';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use navigate for routing

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          // Add any other user-specific fields here
        });
        
        // Optionally, create an initial document in the trades sub-collection
        await setDoc(doc(collection(db, 'users', user.uid, 'trades'), 'initialTrade'), {
          coin: 'Bitcoin',
          bought: 0,
          sold: 0,
          difference: 0,
          profits: 0,
          dateEntered: new Date().toISOString(),
          dateSold: null,
          tradeLasted: null,
          ongoing: true
        });
        
        navigate('/trades'); // Navigate to the trades page after registration
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/trades'); // Navigate to the trades page after login
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        <p>
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Register'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
