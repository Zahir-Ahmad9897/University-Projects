import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registration.php?action=my', { credentials: 'include' })
      .then(r => r.json()).then(setMyEvents).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = myEvents.filter(e => new Date(e.event_date) >= new Date());
  const past = myEvents.filter(e => new Date(e.event_date) < new Date());

  const catBadge = (cat) => <span className={`badge badge-${cat}`}>{cat}</span>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">👋 Hello, {user?.name?.split(' ')[0]}!</div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{myEvents.length}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{upcoming.length}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--warning)'}}>⭐ {user?.points || 0}</div>
            <div className="stat-label">Points Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color:'var(--success)'}}>{past.length}</div>
            <div className="stat-label">Events Attended</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h2 style={{fontSize:'1.1rem',fontWeight:'700'}}>Upcoming Events</h2>
              <Link to="/events" className="btn btn-outline btn-sm">Browse More</Link>
            </div>
            {loading ? <p>Loading...</p> : upcoming.length === 0 ? (
              <p style={{color:'var(--gray)',fontSize:'0.9rem'}}>No upcoming events. <Link to="/events">Browse events</Link></p>
            ) : upcoming.map(e => (
              <div key={e.id} style={{padding:'0.8rem',border:'1px solid var(--border)',borderRadius:'8px',marginBottom:'0.6rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontWeight:'600',fontSize:'0.9rem'}}>{e.title}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--gray)',marginTop:'0.2rem'}}>
                      📅 {new Date(e.event_date).toLocaleDateString()} &nbsp; ⏰ {e.start_time}
                    </div>
                    <div style={{fontSize:'0.8rem',color:'var(--gray)'}}>🏢 {e.club_name}</div>
                  </div>
                  {catBadge(e.category)}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 style={{fontSize:'1.1rem',fontWeight:'700',marginBottom:'1rem'}}>Quick Actions</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
              <Link to="/events" className="btn btn-primary">🎯 Browse & Register for Events</Link>
              <Link to="/attendance" className="btn btn-secondary">📋 View Attendance History</Link>
              <Link to="/rewards" className="btn btn-success">🎁 Redeem Rewards</Link>
            </div>
            <div style={{marginTop:'1.5rem',padding:'1rem',background:'#f0f4f8',borderRadius:'8px'}}>
              <div style={{fontWeight:'600',fontSize:'0.9rem',marginBottom:'0.5rem'}}>⭐ Points Status</div>
              <div style={{fontSize:'0.85rem',color:'var(--gray)'}}>
                You have <strong>{user?.points || 0} points</strong>.<br/>
                {(user?.points || 0) >= 20 
                  ? '✅ Eligible to redeem rewards!' 
                  : `Earn ${20 - (user?.points || 0)} more points to unlock rewards.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
