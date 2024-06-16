import React, { useState, useContext} from 'react';
import "../App.css";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 
  const {setAuthState} = useContext(AuthContext);
  let navigate = useNavigate();

  const handleRegister = (e) => {
      e.preventDefault();
  
      axios.post(`${apiUrl}/auth/login`, { username, password })
        .then(res => {
          sessionStorage.setItem("accessToken", res.data.token);
          setAuthState(true);
          setSuccess('Congratulations! You have successfully logged in.');
          setTimeout(() => {
            navigate('/'); 
          }, 800);
        })
        .catch(err => {
          setError('Incorrect username or password');
          console.error(err);
        });
    }


  return (
    <div className='createpost-page'>
    <form className='create' onSubmit={handleRegister}>
      <input className="userinput" type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />
      <input className="userinput" type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>} 
      <div className='reset-link'>
        <Link to="/ChangePassword">Forget password?</Link>
      </div>
      <button type='submit' className='upload'>Login</button>
    </form>
  </div>
  )
}

export default Login
