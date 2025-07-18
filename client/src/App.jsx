import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './pages/Login';
import Home from './pages/Users/Home';
import History from './components/History';
import Vicar from './pages/Users/Vicar';
import ContactUs from './pages/Users/ContactUs';
import Directory from './pages/Users/Directory';

//admin section
import AdminDashboard from './pages/Admin/AdminDashboard';
import News from './pages/Admin/News';
import Events from './pages/Admin/Events';
import Videos from './pages/Admin/Videos';
import Parishes from './pages/Admin/Parishes';
import Gallery from './pages/Admin/Gallery';
import Users from './pages/Admin/Users';
import EditorDashboard from './pages/Editor/EditorDashboard';
import AdminDirectory from './pages/Admin/AdminDirectory';
import AdminContact from './pages/Admin/AdminContact';
import ApostolicVicar from './pages/Users/ApostolicVicar';





function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
          } else {
            sessionStorage.clear();
            setUser(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          sessionStorage.clear();
          setUser(null);
        }
      } else {
        sessionStorage.clear();
        setUser(null);
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/contact' element={<ContactUs/>}/>
        <Route path='/vicariate/vicar'element={<Vicar/>}/>
        <Route path='/vicariate/history' element={< History/>}/>
        <Route path='/vicariate/directory' element={<Directory/>}/>
        <Route path='/apostolic-vicar' element={<ApostolicVicar/>}/>
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* ✅ Admin routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/news" element={<News />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/videos" element={<Videos />} />
            <Route path='/admin/Directory' element={<AdminDirectory/>}/>
            <Route path="/admin/parishes" element={<Parishes />} />
            <Route path="/admin/media" element={<Gallery />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/contact" element={<AdminContact/>}/>

            {/* add more admin routes here */}
          </>
        )}

        {/* ✅ Editor route */}
        {user?.role === 'editor' && (
          <Route path="/editor/dashboard" element={<EditorDashboard />} />
        )}

        {/* 🚫 Protected route fallback */}
        <Route path="/admin/*" element={<Navigate to="/login" />} />
        <Route path="/editor/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
