import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articlesApi } from '../../services/api';

export default function ArticleForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id;
  const [form, setForm] = useState({ title:'', slug:'', excerpt:'', content:'', status:'draft', cover_image:'' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit) articlesApi.adminGetAll().then(r => {
      const a = (r.data.articles||r.data).find(x => String(x.id)===id);
      if (a) setForm({ title:a.title||'', slug:a.slug||'', excerpt:a.excerpt||'', content:a.content||'', status:a.status||'draft', cover_image:a.cover_image||'' });
    }).catch(console.error);
  }, [id]);

  const f = k => e => setForm(prev => {
    const next = {...prev, [k]: e.target.value};
    if (k==='title' && !isEdit) next.slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,'-');
    return next;
  });

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await articlesApi.update(id, form);
      else        await articlesApi.create(form);
      showToast(isEdit ? 'Artículo actualizado' : 'Artículo creado');
      setTimeout(()=>navigate('/admin/articles'),1200);
    } catch (err) { showToast(err.response?.data?.error||'Error','error'); }
    finally { setSaving(false); }
  };

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">{isEdit?'EDITAR':'NUEVO'} ARTÍCULO</div>
        <div style={{display:'flex',gap:12}}>
          <button className="btn-cancel" onClick={()=>navigate('/admin/articles')}>CANCELAR</button>
          <button className="btn-submit-admin" onClick={handleSubmit} disabled={saving}>{saving?'GUARDANDO...':'GUARDAR'}</button>
        </div>
      </div>
      <div className="admin-content">
        <form onSubmit={handleSubmit} className="admin-form-page">
          <div className="admin-form">
            <div className="form-section-title">CONTENIDO</div>
            <div className="form-group" style={{marginBottom:12}}>
              <label className="form-label">Título *</label>
              <input className="form-input" value={form.title} onChange={f('title')} required style={{marginBottom:0}} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input className="form-input" value={form.slug} onChange={f('slug')} style={{marginBottom:0}} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" value={form.status} onChange={f('status')} style={{marginBottom:0}}>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{marginBottom:12}}>
              <label className="form-label">Imagen de portada (URL)</label>
              <input className="form-input" value={form.cover_image} onChange={f('cover_image')} placeholder="https://..." style={{marginBottom:0}} />
            </div>
            <div className="form-group" style={{marginBottom:12}}>
              <label className="form-label">Resumen</label>
              <textarea className="form-input" rows={3} value={form.excerpt} onChange={f('excerpt')} style={{marginBottom:0,height:'auto'}} />
            </div>
            <div className="form-group">
              <label className="form-label">Contenido completo</label>
              <textarea className="form-input" rows={15} value={form.content} onChange={f('content')} style={{marginBottom:0,height:'auto'}} />
            </div>
          </div>
          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:16}}>
            <button type="button" className="btn-cancel" onClick={()=>navigate('/admin/articles')}>CANCELAR</button>
            <button type="submit" className="btn-submit-admin" disabled={saving}>{saving?'GUARDANDO...':'GUARDAR'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
