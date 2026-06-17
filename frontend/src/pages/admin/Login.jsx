import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, pass); navigate('/admin/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Credenciales inválidas'); }
    finally { setLoading(false); }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__logo">
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize: 26, fontWeight: 400, letterSpacing: '4px', textTransform: 'uppercase', color: '#000', lineHeight: 1, marginBottom: 7, textAlign: 'center' }}>
            REVILLOT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ height: '0.5px', width: 20, background: 'rgba(0,0,0,0.35)' }} />
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 7, fontWeight: 400, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', lineHeight: 1 }}>
              GARAGE
            </div>
            <div style={{ height: '0.5px', width: 20, background: 'rgba(0,0,0,0.35)' }} />
          </div>
        </div>
        <h1>PANEL ADMIN</h1>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus />
          <input className="form-input" type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} required style={{marginTop:4}} />
          <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:8}}>{loading?'INGRESANDO...':'INGRESAR'}</button>
        </form>
        <div style={{marginTop:24,textAlign:'center'}}>
          <a href="/" style={{fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'#999',textDecoration:'none'}}>← Volver al sitio</a>
        </div>
      </div>
    </div>
  );
}
