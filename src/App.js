import React, { useState } from "react";
import HeartRender from "./HeartRender";
import Login from "./Login";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleProp = (e) => {
    setUsername(e);
  };

  return (
    <div className={isLoggedIn ? "container-1" : "container-2"}>
      {isLoggedIn ? (
        <HeartRender username={username} />
      ) : (
        <Login onLogin={handleLogin} handleProp={handleProp} />
      )}
    </div>
  );
}

export default App;
