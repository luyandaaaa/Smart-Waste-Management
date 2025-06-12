import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Scan from './Scan';
import Rewards from './Rewards';
import Municipal from './Municipal';
import Login from './Login';
import Signup from './Signup';
import { useState } from 'react';
import Gamification from './SmartGamification';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scan" 
          element={isAuthenticated ? <Scan /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/rewards" 
          element={isAuthenticated ? <Rewards /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/municipal" 
          element={isAuthenticated ? <Municipal /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/gamification" 
          element={isAuthenticated ? <Gamification setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;