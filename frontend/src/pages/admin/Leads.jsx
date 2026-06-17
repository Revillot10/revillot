import { useState, useEffect } from 'react';
import { leadsApi } from '../../services/api';

const STATUSES = ['new','contacted','qualified','closed_won','closed_lost'];
const badge = s => <span className={`badge badge--${s}`}>{s?.replace('_',' ')}</span>;

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = () => {
    setLoading(true);
    const q = { page, limit:20 };
    if (filter) q.status = filter;
    leadsApi.getAll(q).then(r=>{setLeads(r.data.leads||[]);setPagination(r.data.pagination||{});}).catch(console.error).finally(()=>setLoading(false));
  };

  useEffect(load,[page,filter]);

  const handleStatusChange = async (id, status) => {
    try { await leadsApi.updateStatus(id, {status}); showToast('Estado actualizado'); load(); }
    catch { showToast('Error','error'); }
  };

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">LEADS</div>
        <div style={{display:'flex',gap:8}}>
          {[['','Todos'],['new','Nuevos'],['contacted','Contactados'],['qualified','Calificados'],['closed_won','Ganados'],['closed_lost','Perdidos']].map(([val,label])=>(
            <button key={val} onClick={()=>{setFilter(val);setPage(1);}} style={{fontFamily:'Montserrat,sans-serif',fontSize:8,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',padding:'6px 12px',border:'1px solid',cursor:'pointer',background:filter===val?'#000':'#fff',color:filter===val?'#fff':'#999',borderColor:filter===val?'#000':'#e0e0e0'}}>{label}</button>
          ))}
        </div>
      </div>
      <div className="admin-content">
        {loading ? <div className="loading"/> : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Tipo</th><th>Vehículo</th><th>Estado</th><th>Fecha</th><th>Acción</th></tr></thead>
                <tbody>
                  {leads.length ? leads.map(l=>(
                    <tr key={l.id} style={{cursor:'pointer'}} onClick={()=>setSelected(selected?.id===l.id?null:l)}>
                      <td><div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500,color:'#000'}}>{l.first_name} {l.last_name}</div></td>
                      <td><a href={`mailto:${l.email}`} onClick={e=>e.stopPropagation()} style={{color:'#1565c0'}}>{l.email}</a></td>
                      <td>{l.phone}</td>
                      <td><span style={{fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'1px',textTransform:'uppercase'}}>{l.lead_type?.replace('_',' ')}</span></td>
                      <td style={{fontFamily:'Montserrat,sans-serif',fontSize:10}}>{l.vehicle_name||'—'}</td>
                      <td onClick={e=>e.stopPropagation()}>
                        <select value={l.status||'new'} onChange={e=>handleStatusChange(l.id,e.target.value)} style={{fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'1px',textTransform:'uppercase',border:'1px solid #e0e0e0',padding:'4px 8px',cursor:'pointer',background:'#fff'}}>
                          {STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                        </select>
                      </td>
                      <td>{new Date(l.created_at).toLocaleDateString('es-CL')}</td>
                      <td>
                        <a href={`tel:${l.phone}`} onClick={e=>e.stopPropagation()} className="btn-icon btn-icon--edit" style={{display:'inline-block'}}>Llamar</a>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'#ccc'}}>Sin leads</td></tr>}
                </tbody>
              </table>
            </div>
            {selected && (
              <div style={{marginTop:20,background:'#fff',border:'1px solid #e0e0e0',padding:24}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:10,fontWeight:500,letterSpacing:'3px',textTransform:'uppercase',color:'#000',marginBottom:16}}>MENSAJE DE {selected.first_name?.toUpperCase()} {selected.last_name?.toUpperCase()}</div>
                <p style={{fontFamily:'Roboto,sans-serif',fontSize:14,fontWeight:300,color:'rgb(102,102,102)',lineHeight:1.7}}>{selected.message||'Sin mensaje'}</p>
              </div>
            )}
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({length:pagination.pages},(_,i)=>i+1).map(p=>(
                  <button key={p} className={p===page?'active':''} onClick={()=>setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
