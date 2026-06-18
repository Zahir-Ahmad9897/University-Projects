import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Client-side validation (JS)
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'club_rep') navigate('/club-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">🎓 Welcome Back</div>
        <div className="auth-subtitle">Smart University Ecosystem</div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className={`form-control ${errors.email ? 'error' : ''}`}
              type="text" placeholder="student@uni.edu"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className={`form-control ${errors.password ? 'error' : ''}`}
              type="password" placeholder="••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'0.75rem'}}
            type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:'1.2rem',fontSize:'0.85rem',color:'#6b7280'}}>
          Demo: <strong>ali@student.edu</strong> / <strong>password</strong>
        </div>
        <div style={{textAlign:'center',marginTop:'0.8rem',fontSize:'0.85rem'}}>
          No account? <Link to="/register" style={{color:'var(--primary)'}}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
