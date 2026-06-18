import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name required';
    if (!form.email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role })
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ api: data.error }); return; }
      setMsg('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch { setErrors({ api: 'Server error' }); }
    finally { setLoading(false); }
  };

  const f = (name) => ({
    value: form[name],
    onChange: e => setForm({...form, [name]: e.target.value}),
    className: `form-control ${errors[name] ? 'error' : ''}`
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">Create Account</div>
        <div className="auth-subtitle">Join Smart University Ecosystem</div>
        {msg && <div className="alert alert-success">{msg}</div>}
        {errors.api && <div className="alert alert-error">{errors.api}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input {...f('name')} placeholder="Muhammad Ali Khan" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input {...f('email')} type="email" placeholder="you@uni.edu" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select {...f('role')}>
              <option value="student">Student</option>
              <option value="club_rep">Club Representative</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input {...f('password')} type="password" placeholder="••••••" />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input {...f('confirm')} type="password" placeholder="••••••" />
            {errors.confirm && <div className="error-text">{errors.confirm}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{width:'100%',justifyContent:'center',padding:'0.75rem'}}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'1rem',fontSize:'0.85rem'}}>
          Already have account? <Link to="/login" style={{color:'var(--primary)'}}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
