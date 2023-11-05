import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import Chats from "./pages/Chats";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
