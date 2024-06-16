import React, { useState} from 'react';
import "../App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(''); 
    let navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
    
        axios.post(`${apiUrl}/auth/registration`, { username, password })
          .then(res => {
            const userId = res.data.userId; 
            setSuccess(`Congratulations! You have successfully registered. Your unique ID is: ${userId}`); 
            setTimeout(() => {
              navigate('/login'); 
            }, 2000);
          })
          .catch(err => console.log(err));
      }


  return (
    <div className='createpost-page'>
      <form className='create' onSubmit={handleRegister}>
        <input className="userinput" type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="userinput" type="password"placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
        {success && <div className="success-message">{success}</div>} 
        <button type='submit' className='upload'>Register</button>
      </form>
    </div>
  )
}

export default Registration
