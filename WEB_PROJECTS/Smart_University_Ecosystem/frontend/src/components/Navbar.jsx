import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">🎓 Smart University</Link>
        <div className="navbar-nav">
          {user ? (
            <>
              <Link to="/events" className={isActive('/events')}>Events</Link>
              {user.role === 'student' && <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link to="/attendance" className={isActive('/attendance')}>Attendance</Link>
                <Link to="/rewards" className={isActive('/rewards')}>Rewards</Link>
              </>}
              {user.role === 'club_rep' && <>
                <Link to="/club-dashboard" className={isActive('/club-dashboard')}>Club Panel</Link>
                <Link to="/create-event" className={isActive('/create-event')}>Create Event</Link>
              </>}
              {user.role === 'admin' && <>
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              </>}
              <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.85rem'}}>Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'student' && <span className="badge badge-points">⭐ {user.points}</span>}
              <button className="btn btn-outline" style={{borderColor:'rgba(255,255,255,0.5)',color:'white'}} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,0.6)',color:'white'}}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
