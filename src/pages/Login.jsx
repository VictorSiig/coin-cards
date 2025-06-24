import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSubmit } from '../utilities/handleSubmit';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  return (
    <div className="login-container">
      <form
        onSubmit={(e) =>
          handleSubmit({
            e,
            isRegistering,
            email,
            password,
            navigate,
            setError,
          })
        }
      >
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
