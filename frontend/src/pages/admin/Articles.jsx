import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesApi } from '../../services/api';

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    articlesApi.adminGetAll().then(r => setArticles(r.data.articles || r.data)).catch(console.error).finally(()=>setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Eliminar "${title}"?`)) return;
    try { await articlesApi.delete(id); showToast('Artículo eliminado'); load(); }
    catch { showToast('Error al eliminar','error'); }
  };

  const badge = s => <span className={`badge badge--${s==='published'?'available':'reserved'}`}>{s}</span>;

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">ARTÍCULOS</div>
        <button className="btn-submit-admin" onClick={()=>navigate('/admin/articles/new')}>+ NUEVO</button>
      </div>
      <div className="admin-content">
        {loading ? <div className="loading"/> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Título</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
              <tbody>
                {articles.length ? articles.map(a=>(
                  <tr key={a.id}>
                    <td><div style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500,letterSpacing:'1px',color:'#000'}}>{a.title}</div><div style={{fontSize:11,color:'#aaa',marginTop:2}}>{a.slug}</div></td>
                    <td>{badge(a.status)}</td>
                    <td>{new Date(a.created_at).toLocaleDateString('es-CL')}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn-icon btn-icon--edit" onClick={()=>navigate(`/admin/articles/${a.id}`)}>Editar</button>
                        <button className="btn-icon btn-icon--delete" onClick={()=>handleDelete(a.id,a.title)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4} style={{textAlign:'center',padding:'40px',color:'#ccc'}}>Sin artículos</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
