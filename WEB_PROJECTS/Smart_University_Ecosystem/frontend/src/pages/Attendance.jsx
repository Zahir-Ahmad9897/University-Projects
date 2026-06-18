import { useState, useEffect } from 'react';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registration.php?action=history', { credentials: 'include' })
      .then(r => r.json()).then(setHistory).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = history.reduce((sum, e) => sum + parseInt(e.points_reward), 0);

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">📋 Attendance History</div>
        <div className="grid-2" style={{marginBottom:'1.5rem'}}>
          <div className="stat-card"><div className="stat-value">{history.length}</div><div className="stat-label">Events Attended</div></div>
          <div className="stat-card"><div className="stat-value" style={{color:'var(--warning)'}}>⭐ {total}</div><div className="stat-label">Total Points Earned</div></div>
        </div>
        <div className="card">
          {loading ? <p>Loading...</p> : history.length === 0 ? (
            <p style={{color:'var(--gray)',textAlign:'center',padding:'2rem'}}>No attendance records yet.</p>
          ) : (
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Points</th><th>Attended At</th></tr></thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.title}</strong></td>
                    <td>{new Date(row.event_date).toLocaleDateString()}</td>
                    <td><span className="badge badge-points">+{row.points_reward}</span></td>
                    <td style={{fontSize:'0.85rem',color:'var(--gray)'}}>{new Date(row.attended_at).toLocaleString()}</td>
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
