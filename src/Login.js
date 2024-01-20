import React, { useState } from "react";

function Login({ onLogin, handleProp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Simple authentication logic (replace with your actual authentication mechanism)
    if (password === process.env.REACT_APP_PASSWORD) {
      handleProp(username);
      setError("");
      onLogin();
    } else {
      setError("Sai rồi bạn nhé hihi");
    }
  };
  return (
    <div className="form-container">
      <h2>This is for May</h2>
      <div className="form-box">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Type in your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-box">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Please tell your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-btn" onClick={handleLogin}>
        Let's gooo!
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
