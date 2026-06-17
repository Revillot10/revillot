import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videosApi } from '../../services/api';

export default function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', youtube_id:'', thumbnail_url:'' });
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const load = () => { setLoading(true); videosApi.adminGetAll().then(r=>setVideos(r.data||[])).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(load,[]);
  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleSave = async () => {
    try {
      if (editId) await videosApi.update(editId, form);
      else await videosApi.create(form);
      showToast(editId?'Video actualizado':'Video creado');
      setShowForm(false); setEditId(null); setForm({title:'',youtube_id:'',thumbnail_url:''});
      load();
    } catch { showToast('Error','error'); }
  };

  const handleEdit = (v) => { setForm({title:v.title||'',youtube_id:v.youtube_id||'',thumbnail_url:v.thumbnail_url||''}); setEditId(v.id); setShowForm(true); };
  const handleDelete = async (id) => { if(!window.confirm('¿Eliminar?'))return; try{await videosApi.delete(id);showToast('Eliminado');load();}catch{showToast('Error','error');} };

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">VIDEOS</div>
        <button className="btn-submit-admin" onClick={()=>{setShowForm(true);setEditId(null);setForm({title:'',youtube_id:'',thumbnail_url:''});}}>+ NUEVO</button>
      </div>
      <div className="admin-content">
        {showForm && (
          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">{editId?'EDITAR':'NUEVO'} VIDEO</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Título</label><input className="form-input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={{marginBottom:0}}/></div>
              <div className="form-group"><label className="form-label">YouTube ID</label><input className="form-input" value={form.youtube_id} onChange={e=>setForm(p=>({...p,youtube_id:e.target.value}))} placeholder="Ej: RUCF5qeoljA" style={{marginBottom:0}}/></div>
              <div className="form-group"><label className="form-label">Thumbnail URL</label><input className="form-input" value={form.thumbnail_url} onChange={e=>setForm(p=>({...p,thumbnail_url:e.target.value}))} style={{marginBottom:0}}/></div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:16}}>
              <button className="btn-submit-admin" onClick={handleSave}>GUARDAR</button>
              <button className="btn-cancel" onClick={()=>setShowForm(false)}>CANCELAR</button>
            </div>
          </div>
        )}
        {loading ? <div className="loading"/> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Thumbnail</th><th>Título</th><th>YouTube ID</th><th>Acciones</th></tr></thead>
              <tbody>
                {videos.length ? videos.map(v=>(
                  <tr key={v.id}>
                    <td>{v.thumbnail_url&&<img src={v.thumbnail_url} alt="" style={{width:80,height:45,objectFit:'cover'}} loading="lazy"/>}</td>
                    <td style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:500}}>{v.title}</td>
                    <td><a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer" style={{color:'#1565c0',fontFamily:'Montserrat,sans-serif',fontSize:10}}>{v.youtube_id}</a></td>
                    <td><div className="admin-actions">
                      <button className="btn-icon btn-icon--edit" onClick={()=>handleEdit(v)}>Editar</button>
                      <button className="btn-icon btn-icon--delete" onClick={()=>handleDelete(v.id)}>Eliminar</button>
                    </div></td>
                  </tr>
                )) : <tr><td colSpan={4} style={{textAlign:'center',padding:'40px',color:'#ccc'}}>Sin videos</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
