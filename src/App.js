import React from 'react';
import AppLayout from './components/AppLayout';
import { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username === 'JohannaKnigge' && password === 'Mastermind1234') {
      setLoggedIn(true);
    }

  };

  // return (
  //   <>
  //     {!loggedIn ? (
  //       <div>
  //         <input
  //           type="text"
  //           placeholder="Username"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />
  //         <input
  //           type="password"
  //           placeholder="Password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //         <button onClick={handleLogin}>Login</button>
  //       </div>
  //     ) : (
  //       <AppLayout />
  //     )}
  //   </>
  // );
  return (
    <AppLayout />
  );
}

export default App;

