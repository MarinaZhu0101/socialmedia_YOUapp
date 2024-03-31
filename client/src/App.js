import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import ChangePassword from "./pages/ChangePassword";
import logo from './assets/YOU.png';


function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")){
      setAuthState(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setAuthState(false);
  };

  return (
    <BrowserRouter className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <div className="navbar">
          <div className="left">           
            <Link to="/"> <img src={logo} alt="logo"></img></Link>
            <Link className="nav-link" to="/createpost"> Create A Post</Link>
          </div>
          <div className="right">
            { !authState ? (
            <>
            <Link className="nav-link" to="/login"> Login</Link>     
            <Link className="nav-link" to="/registration"> Register</Link> 
            </>
            ) : (
              <button onClick={logout}>Logout</button>
            )}     
            </div>       
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/users" element={<Users />} /> */}
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
    

  );
}

export default App;
