import { Route, Routes } from "react-router-dom";

import './App.css';
import Navbar from './components/Navbar';
import { Home, Profile, Create, Explore,  Login, ItemDetail } from './pages';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts/:itemId" element={<ItemDetail />} />

          <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;