import { useState, useEffect } from 'react';

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('students');
  const [attendMsg, setAttendMsg] = useState('');
  const [attendForm, setAttendForm] = useState({ student_id: '', event_id: '' });

  useEffect(() => {
    fetch('/api/rewards.php?action=students', { credentials: 'include' })
      .then(r => r.json()).then(setStudents).catch(() => {});
    fetch('/api/events.php?action=list', { credentials: 'include' })
      .then(r => r.json()).then(setEvents).catch(() => {});
  }, []);

  const markAttendance = async () => {
    setAttendMsg('');
    if (!attendForm.student_id || !attendForm.event_id) { setAttendMsg('Select student and event'); return; }
    const res = await fetch('/api/registration.php?action=attend', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: parseInt(attendForm.student_id), event_id: parseInt(attendForm.event_id) })
    });
    const data = await res.json();
    setAttendMsg(data.message || data.error);
    if (res.ok) {
      fetch('/api/rewards.php?action=students', { credentials: 'include' }).then(r => r.json()).then(setStudents).catch(() => {});
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">⚙️ Admin Panel</div>

        <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem'}}>
          {['students','events','attendance'].map(t => (
            <button key={t} className={`btn ${tab===t?'btn-primary':'btn-outline'}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'students' && (
          <div className="card">
            <h2 style={{fontWeight:'700',marginBottom:'1rem'}}>Students Leaderboard</h2>
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Points</th><th>Joined</th></tr></thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i+1}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td><span className="badge badge-points">⭐ {s.points}</span></td>
                    <td style={{fontSize:'0.8rem',color:'var(--gray)'}}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'events' && (
          <div className="card">
            <h2 style={{fontWeight:'700',marginBottom:'1rem'}}>All Events</h2>
            <table>
              <thead><tr><th>Title</th><th>Date</th><th>Category</th><th>Registered/Cap</th><th>Points</th></tr></thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.title}</strong></td>
                    <td>{new Date(e.event_date).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${e.category}`}>{e.category}</span></td>
                    <td>{e.registered}/{e.capacity}</td>
                    <td><span className="badge badge-points">+{e.points_reward}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'attendance' && (
          <div className="card" style={{maxWidth:'500px'}}>
            <h2 style={{fontWeight:'700',marginBottom:'1rem'}}>Mark Attendance</h2>
            {attendMsg && <div className="alert alert-success">{attendMsg}</div>}
            <div className="form-group">
              <label>Select Student</label>
              <select className="form-control" value={attendForm.student_id}
                onChange={e => setAttendForm(p => ({...p, student_id: e.target.value}))}>
                <option value="">-- Select --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Event</label>
              <select className="form-control" value={attendForm.event_id}
                onChange={e => setAttendForm(p => ({...p, event_id: e.target.value}))}>
                <option value="">-- Select --</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title} ({new Date(e.event_date).toLocaleDateString()})</option>)}
              </select>
            </div>
            <button className="btn btn-success" onClick={markAttendance}>✅ Mark Attendance</button>
          </div>
        )}
      </div>
    </div>
  );
}
