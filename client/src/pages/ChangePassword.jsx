import React, { useState} from 'react';
import "../App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const handleResetpassword = (e) => {
        e.preventDefault();
    
        axios.post('http://localhost:5050/auth/resetpassword', { username, password })
          .then(res => {
            console.log(res);
            navigate('/login'); 
          })
          .catch(err => console.log(err));
      }

  return (
    <div className='createpost-page'>
    <form className='create' onSubmit={handleResetpassword}>
      <h1>Reset Your Password</h1>
      <input className="userinput" placeholder='Username' type="text" value={username} onChange={e => setUsername(e.target.value)} required />
      <input className="userinput" placeholder='New password' type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type='submit' className='upload'>Reset</button>
    </form>
  </div>
  )
}

export default ChangePassword

