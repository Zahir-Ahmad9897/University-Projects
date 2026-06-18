import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    title:'', description:'', club_id:'', event_date:'', start_time:'', end_time:'',
    capacity:30, points_reward:10, category:'physical', meeting_link:'', location:''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/rewards.php?action=clubs', { credentials: 'include' })
      .then(r => r.json()).then(setClubs).catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title required';
    if (!form.event_date) errs.event_date = 'Date required';
    if (!form.start_time) errs.start_time = 'Start time required';
    if (!form.end_time) errs.end_time = 'End time required';
    if (form.start_time && form.end_time && form.start_time >= form.end_time) errs.end_time = 'End must be after start';
    if ((form.category === 'online' || form.category === 'hybrid') && !form.meeting_link) errs.meeting_link = 'Meeting link required';
    if ((form.category === 'physical' || form.category === 'hybrid') && !form.location) errs.location = 'Location required';
    if (form.capacity < 1) errs.capacity = 'Capacity must be at least 1';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      const res = await fetch('/api/events.php?action=create', {
        method:'POST', credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setErrors({api: data.error}); return; }
      navigate('/events');
    } catch { setErrors({api:'Server error'}); }
    finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  return (
    <div className="page">
      <div className="container" style={{maxWidth:'680px'}}>
        <div className="page-title">➕ Create New Event</div>
        <div className="card">
          {errors.api && <div className="alert alert-error">{errors.api}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Title *</label>
              <input className={`form-control ${errors.title?'error':''}`} value={form.title} onChange={set('title')} placeholder="Workshop, Seminar, Hackathon..." />
              {errors.title && <div className="error-text">{errors.title}</div>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={set('description')} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Club</label>
                <select className="form-control" value={form.club_id} onChange={set('club_id')}>
                  <option value="">-- Select Club --</option>
                  {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={form.category} onChange={set('category')}>
                  <option value="physical">Physical</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Date *</label>
                <input className={`form-control ${errors.event_date?'error':''}`} type="date" value={form.event_date} onChange={set('event_date')} min={new Date().toISOString().split('T')[0]} />
                {errors.event_date && <div className="error-text">{errors.event_date}</div>}
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input className={`form-control ${errors.capacity?'error':''}`} type="number" value={form.capacity} onChange={set('capacity')} min={1} />
                {errors.capacity && <div className="error-text">{errors.capacity}</div>}
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Start Time *</label>
                <input className={`form-control ${errors.start_time?'error':''}`} type="time" value={form.start_time} onChange={set('start_time')} />
                {errors.start_time && <div className="error-text">{errors.start_time}</div>}
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input className={`form-control ${errors.end_time?'error':''}`} type="time" value={form.end_time} onChange={set('end_time')} />
                {errors.end_time && <div className="error-text">{errors.end_time}</div>}
              </div>
            </div>
            {(form.category === 'online' || form.category === 'hybrid') && (
              <div className="form-group">
                <label>Meeting Link *</label>
                <input className={`form-control ${errors.meeting_link?'error':''}`} type="url" value={form.meeting_link} onChange={set('meeting_link')} placeholder="https://zoom.us/j/..." />
                {errors.meeting_link && <div className="error-text">{errors.meeting_link}</div>}
              </div>
            )}
            {(form.category === 'physical' || form.category === 'hybrid') && (
              <div className="form-group">
                <label>Location / Room *</label>
                <input className={`form-control ${errors.location?'error':''}`} value={form.location} onChange={set('location')} placeholder="CS Building, Room 201" />
                {errors.location && <div className="error-text">{errors.location}</div>}
              </div>
            )}
            <div className="form-group">
              <label>Points Reward</label>
              <input className="form-control" type="number" value={form.points_reward} onChange={set('points_reward')} min={0} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : '✅ Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
