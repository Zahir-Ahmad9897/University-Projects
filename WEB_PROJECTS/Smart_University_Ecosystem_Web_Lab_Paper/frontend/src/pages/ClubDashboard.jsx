import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ClubDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events.php?action=list', { credentials: 'include' })
      .then(r => r.json()).then(setEvents).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const catBadge = (cat) => <span className={`badge badge-${cat}`}>{cat}</span>;

  return (
    <div className="page">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <div className="page-title" style={{margin:0}}>🏛️ Club Dashboard</div>
          <Link to="/create-event" className="btn btn-primary">➕ Create Event</Link>
        </div>

        <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <div className="stat-card"><div className="stat-value">{events.length}</div><div className="stat-label">Total Events</div></div>
          <div className="stat-card"><div className="stat-value">{events.reduce((s,e)=>s+parseInt(e.registered),0)}</div><div className="stat-label">Total Registrations</div></div>
          <div className="stat-card"><div className="stat-value">{events.filter(e=>new Date(e.event_date)>=new Date()).length}</div><div className="stat-label">Upcoming</div></div>
        </div>

        <div className="card">
          <h2 style={{fontWeight:'700',marginBottom:'1rem'}}>All Events</h2>
          {loading ? <p>Loading...</p> : events.length === 0 ? (
            <p style={{color:'var(--gray)'}}>No events yet. <Link to="/create-event">Create one!</Link></p>
          ) : (
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Category</th><th>Registrations</th><th>Points</th></tr></thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.title}</strong><br/><span style={{fontSize:'0.8rem',color:'var(--gray)'}}>{e.club_name}</span></td>
                    <td>{new Date(e.event_date).toLocaleDateString()}<br/><span style={{fontSize:'0.8rem',color:'var(--gray)'}}>{e.start_time}</span></td>
                    <td>{catBadge(e.category)}</td>
                    <td>
                      <div>{e.registered}/{e.capacity}</div>
                      <div style={{background:'#e5e7eb',borderRadius:'4px',height:'4px',marginTop:'4px'}}>
                        <div style={{background:'var(--primary)',width:`${(e.registered/e.capacity)*100}%`,height:'100%',borderRadius:'4px'}}/>
                      </div>
                    </td>
                    <td><span className="badge badge-points">+{e.points_reward}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
