import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import VideoLibrary from './components/VideoLibrary';
import VideoPlayer from './components/VideoPlayer';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import Dashboard from './components/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';


function App() {
  return (
    <AuthProvider>
      

      
      <Router>
      <Navbar/>
      <div className='flex '>

     <div className='w-64'>
      <Sidebar/>
     </div>
      
      <div className='flex-1 p-4'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route 
            path="/videos/:id" 
            element={
              <ProtectedRoute element={<VideoPlayer />} />
            } 
          />         
          <Route 
            path="/videos" 
            element={
              <ProtectedRoute element={<VideoLibrary />} />
            } 
          />
        </Routes>
        </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
