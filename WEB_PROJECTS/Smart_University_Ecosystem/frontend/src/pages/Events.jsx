import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [msg, setMsg] = useState({});

  const fetchEvents = () => {
    const url = filter ? `/api/events.php?action=list&category=${filter}` : '/api/events.php?action=list';
    fetch(url, { credentials: 'include' })
      .then(r => r.json()).then(setEvents).catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [filter]);

  const register = async (eventId) => {
    setMsg(prev => ({ ...prev, [eventId]: { type: 'loading', text: 'Registering...' } }));
    try {
      const res = await fetch('/api/registration.php?action=register', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId })
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(prev => ({ ...prev, [eventId]: { type: 'error', text: data.error } }));
      } else {
        setMsg(prev => ({ ...prev, [eventId]: { type: 'success', text: 'Registered successfully! ✓' } }));
        fetchEvents(); // Issue 2 fix: refresh list immediately
      }
    } catch {
      setMsg(prev => ({ ...prev, [eventId]: { type: 'error', text: 'Server error' } }));
    }
  };

  const catBadge = (cat) => <span className={`badge badge-${cat}`}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</span>;

  return (
    <div className="page">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
          <div className="page-title" style={{margin:0}}>🗓️ Events</div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {['','online','physical','hybrid'].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`btn btn-sm ${filter===cat ? 'btn-primary' : 'btn-outline'}`}>
                {cat || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <p>Loading events...</p> : events.length === 0 ? (
          <div className="card" style={{textAlign:'center',padding:'3rem',color:'var(--gray)'}}>
            <div style={{fontSize:'3rem'}}>📭</div>
            <p>No events found.</p>
          </div>
        ) : (
          <div className="grid-3">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <h3>{event.title}</h3>
                  {catBadge(event.category)}
                </div>
                <p style={{fontSize:'0.85rem',color:'var(--gray)',lineHeight:'1.4'}}>{event.description}</p>
                <div className="event-meta">
                  <span>📅 {new Date(event.event_date).toLocaleDateString('en-PK',{month:'short',day:'numeric',year:'numeric'})}</span>
                  <span>⏰ {event.start_time} – {event.end_time}</span>
                </div>
                <div className="event-meta">
                  <span>🏢 {event.club_name || 'University'}</span>
                  <span>👥 {event.registered}/{event.capacity}</span>
                  <span className="badge badge-points">+{event.points_reward} pts</span>
                </div>
                {event.category !== 'physical' && event.meeting_link &&
                  <div style={{fontSize:'0.8rem'}}><a href={event.meeting_link} target="_blank" rel="noreferrer" style={{color:'var(--primary)'}}>🔗 Join Online</a></div>}
                {event.category !== 'online' && event.location &&
                  <div style={{fontSize:'0.8rem',color:'var(--gray)'}}>📍 {event.location}</div>}

                {/* Capacity bar */}
                <div style={{background:'#e5e7eb',borderRadius:'999px',height:'6px'}}>
                  <div style={{background: event.registered >= event.capacity ? 'var(--danger)' : 'var(--success)',
                    width:`${Math.min(100,(event.registered/event.capacity)*100)}%`,height:'100%',borderRadius:'999px'}}/>
                </div>

                {msg[event.id] && (
                  <div className={`alert alert-${msg[event.id].type === 'success' ? 'success' : 'error'}`}
                    style={{margin:0,padding:'0.5rem 0.8rem',fontSize:'0.82rem'}}>
                    {msg[event.id].text}
                  </div>
                )}

                <div className="actions">
                  {user?.role === 'student' && (
                    <button className="btn btn-primary btn-sm"
                      disabled={event.registered >= event.capacity || msg[event.id]?.type === 'loading'}
                      onClick={() => register(event.id)}>
                      {event.registered >= event.capacity ? 'Full' : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
