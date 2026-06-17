import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LOGO = 'https://images.67degreescdn.co.uk/zy7y1N-3pfL5Q_-hT8x0dorFXEY=/100x/filters:no_upscale()/137/1/162513748360dda14b60068_romans-international-logo-whiteout.png';

const NAV = [
  { to:'/admin/dashboard', icon:'dashboard',     label:'DASHBOARD' },
  { section:'INVENTARIO' },
  { to:'/admin/vehicles',  icon:'directions_car', label:'VEHÍCULOS' },
  { section:'CONTENIDO' },
  { to:'/admin/articles',  icon:'article',        label:'ARTÍCULOS' },
  { to:'/admin/videos',    icon:'play_circle',    label:'VIDEOS' },
  { section:'LEADS' },
  { to:'/admin/leads',     icon:'mail',           label:'LEADS' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize: 20, fontWeight: 400, letterSpacing: '4px', textTransform: 'uppercase', color: '#fff', lineHeight: 1, marginBottom: 6, textAlign: 'center' }}>
            REVILLOT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <div style={{ height: '0.5px', width: 16, background: 'rgba(255,255,255,0.35)' }} />
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 6, fontWeight: 400, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
              GARAGE
            </div>
            <div style={{ height: '0.5px', width: 16, background: 'rgba(255,255,255,0.35)' }} />
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="admin-nav__section-title">{item.section}</div>
            ) : (
              <NavLink key={item.to} to={item.to} className={({isActive})=>`admin-nav__item${isActive?' active':''}`}>
                <span className="material-icons">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>
        <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:4}}>{user?.role}</div>
          <div style={{fontFamily:'Roboto,sans-serif',fontSize:13,fontWeight:300,color:'rgba(255,255,255,0.7)',marginBottom:12}}>{user?.firstName} {user?.lastName}</div>
          <button onClick={handleLogout} style={{fontFamily:'Montserrat,sans-serif',fontSize:8,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',background:'none',border:'1px solid rgba(255,255,255,0.1)',padding:'6px 12px',cursor:'pointer'}}>SALIR</button>
        </div>
      </aside>
      <div className="admin-main"><Outlet /></div>
    </div>
  );
}
