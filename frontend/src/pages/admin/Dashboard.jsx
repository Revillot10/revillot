import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { miscApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const badge = s => <span className={`badge badge--${s}`}>{s?.replace('_',' ')}</span>;

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    miscApi.getDashboard().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <><div className="admin-topbar"><div className="admin-topbar__title">DASHBOARD</div></div><div className="admin-content"><div className="loading" /></div></>;

  const { stats, recentLeads, recentVehicles } = data || {};
  const statCards = [
    { label:'Vehículos disponibles', value: stats?.vehicles?.available||0, icon:'directions_car', link:'/admin/vehicles?status=available' },
    { label:'Vehículos vendidos',    value: stats?.vehicles?.sold||0,      icon:'sell',           link:'/admin/vehicles?status=sold' },
    { label:'Leads recibidos',       value: stats?.leads?.total||0,        icon:'mail',           link:'/admin/leads' },
    { label:'Artículos publicados',  value: stats?.articles?.published||0, icon:'article',        link:'/admin/articles' },
  ];

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-topbar__title">DASHBOARD</div>
        <div className="admin-topbar__user"><span className="material-icons" style={{fontSize:16}}>person</span>{user?.firstName}</div>
      </div>
      <div className="admin-content">
        <div className="stats-grid">
          {statCards.map(c => (
            <div key={c.label} className="stat-card" onClick={()=>navigate(c.link)}>
              <div className="stat-card__label">{c.label}</div>
              <div className="stat-card__value">{c.value}</div>
              <span className="material-icons stat-card__icon">{c.icon}</span>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500,letterSpacing:'3px',textTransform:'uppercase',color:'#000'}}>LEADS RECIENTES</div>
              <button onClick={()=>navigate('/admin/leads')} style={{fontFamily:'Montserrat,sans-serif',fontSize:8,letterSpacing:'2px',textTransform:'uppercase',color:'#000',border:'1px solid #000',padding:'6px 12px',background:'none',cursor:'pointer'}}>VER TODOS</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Tipo</th><th>Estado</th><th>Fecha</th></tr></thead>
                <tbody>
                  {recentLeads?.length ? recentLeads.map(l => (
                    <tr key={l.id}>
                      <td style={{color:'#000',fontWeight:400}}>{l.first_name} {l.last_name}</td>
                      <td>{l.lead_type?.replace('_',' ')}</td>
                      <td>{badge(l.status)}</td>
                      <td>{new Date(l.created_at).toLocaleDateString('es-CL')}</td>
                    </tr>
                  )) : <tr><td colSpan={4} style={{textAlign:'center',color:'#ccc'}}>Sin leads</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500,letterSpacing:'3px',textTransform:'uppercase',color:'#000'}}>VEHÍCULOS RECIENTES</div>
              <button onClick={()=>navigate('/admin/vehicles')} style={{fontFamily:'Montserrat,sans-serif',fontSize:8,letterSpacing:'2px',textTransform:'uppercase',color:'#000',border:'1px solid #000',padding:'6px 12px',background:'none',cursor:'pointer'}}>VER TODOS</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Vehículo</th><th>Precio</th><th>Estado</th></tr></thead>
                <tbody>
                  {recentVehicles?.length ? recentVehicles.map(v => (
                    <tr key={v.id}>
                      <td style={{color:'#000',fontWeight:400}}>{v.brand_name} {v.model} {v.year}</td>
                      <td>{v.price ? `$${Number(v.price).toLocaleString('es-CL')}` : 'A consultar'}</td>
                      <td>{badge(v.status)}</td>
                    </tr>
                  )) : <tr><td colSpan={3} style={{textAlign:'center',color:'#ccc'}}>Sin vehículos</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{marginTop:30,padding:24,background:'#fff',border:'1px solid #e0e0e0'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:10,fontWeight:500,letterSpacing:'3px',textTransform:'uppercase',color:'#000',marginBottom:20,paddingBottom:12,borderBottom:'1px solid #e0e0e0'}}>ACCIONES RÁPIDAS</div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {[{label:'Agregar Vehículo',icon:'add',to:'/admin/vehicles/new'},{label:'Nuevo Artículo',icon:'edit',to:'/admin/articles/new'},{label:'Ver Leads',icon:'inbox',to:'/admin/leads'}].map(a => (
              <button key={a.label} onClick={()=>navigate(a.to)} style={{fontFamily:'Montserrat,sans-serif',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',background:'#000',color:'#fff',border:'none',padding:'12px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
                <span className="material-icons" style={{fontSize:14}}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
