import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'640px',padding:'2rem'}}>
        <div style={{fontSize:'5rem'}}>🎓</div>
        <h1 style={{fontSize:'2.2rem',fontWeight:'700',margin:'1rem 0 0.5rem',color:'var(--primary)'}}>Smart University Ecosystem</h1>
        <p style={{color:'var(--gray)',fontSize:'1.05rem',lineHeight:'1.7',marginBottom:'2rem'}}>
          A centralized platform for managing extracurricular activities — events, clubs, attendance, and rewards.
        </p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'club_rep' ? '/club-dashboard' : '/dashboard'}
              className="btn btn-primary" style={{padding:'0.8rem 2rem',fontSize:'1rem'}}>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{padding:'0.8rem 2rem',fontSize:'1rem'}}>Sign In</Link>
              <Link to="/register" className="btn btn-outline" style={{padding:'0.8rem 2rem',fontSize:'1rem'}}>Register</Link>
            </>
          )}
        </div>
        <div style={{marginTop:'3rem',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
          {[['🎯','Browse Events','Find and register for workshops, seminars, and more'],
            ['⭐','Earn Points','Attend events to earn reward points'],
            ['🎁','Redeem Rewards','Exchange points for exciting rewards']].map(([icon,title,desc]) => (
            <div key={title} className="card" style={{textAlign:'center'}}>
              <div style={{fontSize:'2rem'}}>{icon}</div>
              <div style={{fontWeight:'600',margin:'0.5rem 0 0.3rem',fontSize:'0.9rem'}}>{title}</div>
              <div style={{fontSize:'0.8rem',color:'var(--gray)'}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
