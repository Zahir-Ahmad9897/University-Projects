import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Attendance from './pages/Attendance';
import Rewards from './pages/Rewards';
import CreateEvent from './pages/CreateEvent';
import ClubDashboard from './pages/ClubDashboard';
import Admin from './pages/Admin';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{textAlign:'center',padding:'3rem'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><Dashboard /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute roles={['student']}><Attendance /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute roles={['student']}><Rewards /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute roles={['club_rep','admin']}><CreateEvent /></ProtectedRoute>} />
        <Route path="/club-dashboard" element={<ProtectedRoute roles={['club_rep','admin']}><ClubDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
