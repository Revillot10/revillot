import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vehiclesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const fmtPrice = v => v ? `$${Number(v).toLocaleString('es-CL')}` : 'A consultar';
const badge = s => <span className={`badge badge--${s}`}>{s?.replace('_',' ')}</span>;

export default function VehiclesAdmin() {
  const [vehicles,   setVehicles]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const [params,     setParams]     = useSearchParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const page   = Number(params.get('page')) || 1;
  const status = params.get('status') || '';

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = () => {
    setLoading(true);
    vehiclesApi.adminGetAll({page, limit:20, status})
      .then(r=>{setVehicles(r.data.vehicles);setPagination(r.data.pagination);})
      .catch(console.error).finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); }, [page, status]);

  const setFilter = (k,v) => { const n=new URLSearchParams(params); if(v) n.set(k,v); else n.delete(k); n.delete('page'); setParams(n); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar ${name}?`)) return;
    try { await vehiclesApi.delete(id); showToast('Vehículo eliminado'); load(); }
    catch { showToast('Error al eliminar','error'); }
  };

  const handleMarkSold = async (id, name) => {
    const price = window.prompt(`Precio de venta de ${name} (dejar vacío si es confidencial):`);
    if (price === null) return;
    try { await vehiclesApi.markSold(id, {sold_price: price||null}); showToast('Marcado como vendido'); load(); }
    catch { showToast('Error','error'); }
  };

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">VEHÍCULOS</div>
        <button className="btn-submit-admin" onClick={()=>navigate('/admin/vehicles/new')}>+ AGREGAR</button>
      </div>
      <div className="admin-content">
        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
          {[['','Todos'],['available','Disponibles'],['under_offer','Bajo oferta'],['sold','Vendidos'],['reserved','Reservados']].map(([val,label])=>(
            <button key={val} onClick={()=>setFilter('status',val)} style={{fontFamily:'Montserrat,sans-serif',fontSize:8,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',padding:'8px 14px',border:'1px solid',cursor:'pointer',background:status===val?'#000':'#fff',color:status===val?'#fff':'#999',borderColor:status===val?'#000':'#e0e0e0'}}>{label}</button>
          ))}
          <div style={{marginLeft:'auto',fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'2px',color:'#999',alignSelf:'center'}}>{pagination.total||0} vehículos</div>
        </div>

        {loading ? <div className="loading"/> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Vehículo</th><th>Año</th><th>Color</th><th>Km</th><th>Precio</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
              <tbody>
                {vehicles.length ? vehicles.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        {v.images?.[0] && <img src={v.images[0].url} alt="" style={{width:60,height:40,objectFit:'cover',background:'#eee'}} loading="lazy" />}
                        <div>
                          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500,letterSpacing:'1px',textTransform:'uppercase',color:'#000'}}>{v.brand_name} {v.model}</div>
                          {v.variant && <div style={{fontSize:11,color:'#999'}}>{v.variant}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{v.year}</td>
                    <td>{v.colour}</td>
                    <td>{v.mileage?.toLocaleString('es-CL')}</td>
                    <td>{fmtPrice(v.price)}</td>
                    <td>{badge(v.status)}</td>
                    <td>{new Date(v.created_at).toLocaleDateString('es-CL')}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn-icon btn-icon--edit" onClick={()=>navigate(`/admin/vehicles/${v.id}`)}>Editar</button>
                        {v.status!=='sold' && <button className="btn-icon btn-icon--sell" onClick={()=>handleMarkSold(v.id,`${v.brand_name} ${v.model}`)}>Vendido</button>}
                        {isAdmin && <button className="btn-icon btn-icon--delete" onClick={()=>handleDelete(v.id,`${v.brand_name} ${v.model}`)}>Eliminar</button>}
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'#ccc'}}>Sin vehículos</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({length:pagination.pages},(_,i)=>i+1).map(p=>(
              <button key={p} className={p===page?'active':''} onClick={()=>setFilter('page',p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
