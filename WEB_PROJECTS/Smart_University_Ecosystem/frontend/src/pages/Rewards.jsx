import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Rewards() {
  const { user, setUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({});

  useEffect(() => {
    fetch('/api/rewards.php?action=list', { credentials: 'include' })
      .then(r => r.json()).then(setRewards).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const redeem = async (rewardId, pointsReq) => {
    if (!window.confirm('Redeem this reward?')) return;
    setMsg(prev => ({ ...prev, [rewardId]: { type: 'loading', text: 'Redeeming...' } }));
    try {
      const res = await fetch('/api/rewards.php?action=redeem', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward_id: rewardId })
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(prev => ({ ...prev, [rewardId]: { type: 'error', text: data.error } }));
      } else {
        setMsg(prev => ({ ...prev, [rewardId]: { type: 'success', text: '🎉 Redeemed!' } }));
        setUser(prev => ({ ...prev, points: prev.points - pointsReq }));
        setRewards(prev => prev.map(r => r.id === rewardId ? {...r, stock: r.stock - 1} : r));
      }
    } catch { setMsg(prev => ({ ...prev, [rewardId]: { type: 'error', text: 'Server error' } })); }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <div className="page-title" style={{margin:0}}>🎁 Reward Store</div>
          <div className="card" style={{padding:'0.6rem 1.2rem'}}>
            <strong>⭐ Your Points: {user?.points || 0}</strong>
          </div>
        </div>
        {loading ? <p>Loading...</p> : (
          <div className="grid-3">
            {rewards.map(r => (
              <div key={r.id} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>🎁</div>
                <h3 style={{fontSize:'1rem',marginBottom:'0.5rem'}}>{r.title}</h3>
                <p style={{fontSize:'0.85rem',color:'var(--gray)',marginBottom:'1rem'}}>{r.description}</p>
                <div className="badge badge-points" style={{fontSize:'0.9rem',padding:'0.4rem 0.9rem',marginBottom:'0.8rem'}}>
                  ⭐ {r.points_required} points
                </div>
                <div style={{fontSize:'0.8rem',color:'var(--gray)',marginBottom:'1rem'}}>Stock: {r.stock}</div>
                {msg[r.id] && (
                  <div className={`alert alert-${msg[r.id].type === 'success' ? 'success' : 'error'}`}
                    style={{fontSize:'0.82rem',padding:'0.4rem 0.7rem',marginBottom:'0.8rem'}}>
                    {msg[r.id].text}
                  </div>
                )}
                <button className="btn btn-success btn-sm"
                  disabled={(user?.points || 0) < r.points_required || r.stock <= 0 || msg[r.id]?.type === 'loading'}
                  onClick={() => redeem(r.id, r.points_required)}>
                  {r.stock <= 0 ? 'Out of Stock' : (user?.points || 0) < r.points_required ? 'Not Enough Points' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>
        )}
        {(user?.points || 0) < 20 && (
          <div className="alert alert-error" style={{marginTop:'1rem'}}>
            ⚠️ You need at least 2 event attendances to be eligible for rewards.
          </div>
        )}
      </div>
    </div>
  );
}
