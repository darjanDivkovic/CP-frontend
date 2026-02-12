// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage/LandingPage';
import RoomPage from './components/pages/RoomPage.js/RoomPage';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/room/:id" element={<RoomPage/>} />
      </Routes>
    </div>
  );
}