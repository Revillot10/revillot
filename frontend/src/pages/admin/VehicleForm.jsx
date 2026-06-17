import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesApi, miscApi } from '../../services/api';

const BODY_STYLES  = ['Coupe','Convertible','SUV','Saloon','Estate','Hatchback','Pickup','Supercar'];
const FUEL_TYPES   = ['Gasolina','Diesel','Híbrido','Eléctrico'];
const TRANSMISSIONS = ['Automático','Manual','Semi-automático'];
const STATUSES     = ['available','under_offer','reserved','sold'];

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [brands,  setBrands]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    brand_id:'', model:'', variant:'', year: new Date().getFullYear(),
    colour:'', interior_colour:'', body_style:'', fuel_type:'Gasolina',
    transmission:'', engine_description:'', power_bhp:'', zero_to_sixty:'',
    top_speed_mph:'', mileage:'', price:'', status:'available',
    featured: false, description:'',
    // Images
    images: [],
  });

  useEffect(() => {
    miscApi.getBrands().then(r => setBrands(r.data)).catch(console.error);
    if (isEdit) {
      setLoading(true);
      vehiclesApi.getOne(id)
        .then(r => {
          const v = r.data.vehicle;
          setForm(prev => ({...prev,
            brand_id: v.brand_id || '',
            model: v.model || '', variant: v.variant || '',
            year: v.year || '', colour: v.colour || '',
            interior_colour: v.interior_colour || '',
            body_style: v.body_style || '', fuel_type: v.fuel_type || 'Gasolina',
            transmission: v.transmission || '',
            engine_description: v.engine_description || '',
            power_bhp: v.power_bhp || '', zero_to_sixty: v.zero_to_sixty || '',
            top_speed_mph: v.top_speed_mph || '',
            mileage: v.mileage || '', price: v.price || '',
            status: v.status || 'available',
            featured: v.featured || false,
            description: v.description || '',
            images: v.images || [],
          }));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const f = k => e => setForm(prev => ({...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}));
  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const validate = () => {
    const e = {};
    if (!form.brand_id) e.brand_id = 'Requerido';
    if (!form.model)    e.model    = 'Requerido';
    if (!form.year)     e.year     = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        year:          parseInt(form.year)     || null,
        mileage:       parseInt(form.mileage)  || 0,
        price:         parseFloat(form.price)  || null,
        power_bhp:     parseFloat(form.power_bhp) || null,
        zero_to_sixty: parseFloat(form.zero_to_sixty) || null,
        top_speed_mph: parseInt(form.top_speed_mph) || null,
        brand_id:      parseInt(form.brand_id),
      };
      if (isEdit) await vehiclesApi.update(id, payload);
      else        await vehiclesApi.create(payload);
      showToast(isEdit ? 'Vehículo actualizado' : 'Vehículo creado');
      setTimeout(() => navigate('/admin/vehicles'), 1200);
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImageUrl = () => {
    const url = window.prompt('URL de la imagen:');
    if (!url) return;
    setForm(prev => ({...prev, images: [...prev.images, { url, isPrimary: prev.images.length === 0 }]}));
  };

  const handleSetPrimary = (idx) => {
    setForm(prev => ({...prev, images: prev.images.map((img, i) => ({...img, isPrimary: i === idx}))}));
  };

  const handleRemoveImage = (idx) => {
    setForm(prev => ({...prev, images: prev.images.filter((_,i) => i !== idx)}));
  };

  if (loading) return <><div className="admin-topbar"><div className="admin-topbar__title">{isEdit?'EDITAR':'NUEVO'} VEHÍCULO</div></div><div className="admin-content"><div className="loading"/></div></>;

  const Input = ({label, field, type='text', required, ...rest}) => (
    <div className="form-group">
      <label className="form-label">{label}{required&&' *'}</label>
      <input className="form-input" type={type} value={form[field]||''} onChange={f(field)} style={{marginBottom:0,...(errors[field]?{borderColor:'#c62828'}:{})}} {...rest} />
      {errors[field] && <span style={{color:'#c62828',fontSize:10,fontFamily:'Montserrat,sans-serif',letterSpacing:'1px'}}>{errors[field]}</span>}
    </div>
  );

  const Select = ({label, field, options, required}) => (
    <div className="form-group">
      <label className="form-label">{label}{required&&' *'}</label>
      <select className="form-input" value={form[field]||''} onChange={f(field)} style={{marginBottom:0,...(errors[field]?{borderColor:'#c62828'}:{})}}>
        <option value="">— Seleccionar —</option>
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[field] && <span style={{color:'#c62828',fontSize:10,fontFamily:'Montserrat,sans-serif'}}>{errors[field]}</span>}
    </div>
  );

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}
      <div className="admin-topbar">
        <div className="admin-topbar__title">{isEdit ? 'EDITAR' : 'NUEVO'} VEHÍCULO</div>
        <div style={{display:'flex',gap:12}}>
          <button className="btn-cancel" onClick={()=>navigate('/admin/vehicles')}>CANCELAR</button>
          <button className="btn-submit-admin" onClick={handleSubmit} disabled={saving}>{saving?'GUARDANDO...':'GUARDAR'}</button>
        </div>
      </div>

      <div className="admin-content">
        <form onSubmit={handleSubmit} className="admin-form-page">
          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">INFORMACIÓN BÁSICA</div>
            <div className="form-grid">
              <Select label="Marca" field="brand_id" required options={brands.map(b=>({value:b.id,label:b.name}))} />
              <Input  label="Modelo" field="model" required placeholder="Ej: 911 GT3" />
              <Input  label="Variante" field="variant" placeholder="Ej: (992) Touring" />
              <Input  label="Año" field="year" type="number" required min="1950" max="2030" />
            </div>
            <div className="form-grid">
              <Select label="Estado" field="status" options={STATUSES} />
              <Input  label="Precio (CLP)" field="price" type="number" placeholder="Ej: 45000000" />
            </div>
            <div className="form-group" style={{marginTop:8}}>
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontFamily:'Montserrat,sans-serif',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'#999'}}>
                <input type="checkbox" checked={!!form.featured} onChange={f('featured')} style={{width:16,height:16}} />
                VEHÍCULO DESTACADO (aparece en homepage)
              </label>
            </div>
          </div>

          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">CARACTERÍSTICAS</div>
            <div className="form-grid">
              <Input  label="Color exterior" field="colour" placeholder="Ej: Rosso Corsa" />
              <Input  label="Color interior" field="interior_colour" placeholder="Ej: Nero" />
              <Select label="Carrocería" field="body_style" options={BODY_STYLES} />
              <Select label="Combustible" field="fuel_type" options={FUEL_TYPES} />
              <Select label="Transmisión" field="transmission" options={TRANSMISSIONS} />
              <Input  label="Motor" field="engine_description" placeholder="Ej: 4.0L Flat-6 Twin-Turbo" />
              <Input  label="Potencia (BHP)" field="power_bhp" type="number" placeholder="Ej: 503" />
              <Input  label="Kilometraje (km)" field="mileage" type="number" placeholder="Ej: 5258" />
              <Input  label="0-100 km/h (seg)" field="zero_to_sixty" type="number" step="0.01" placeholder="Ej: 3.4" />
              <Input  label="Vel. máxima (mph)" field="top_speed_mph" type="number" placeholder="Ej: 198" />
            </div>
          </div>

          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">DESCRIPCIÓN</div>
            <div className="form-group">
              <textarea className="form-input" rows={6} value={form.description||''} onChange={f('description')} placeholder="Descripción detallada del vehículo..." style={{marginBottom:0,height:'auto'}} />
            </div>
          </div>

          <div className="admin-form" style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:'1px solid #e0e0e0'}}>
              <div className="form-section-title" style={{margin:0,padding:0,border:'none'}}>IMÁGENES</div>
              <button type="button" className="btn-submit-admin" style={{padding:'8px 16px',fontSize:8}} onClick={handleAddImageUrl}>+ AGREGAR URL</button>
            </div>
            {form.images.length === 0 ? (
              <div style={{padding:'30px',textAlign:'center',background:'#f5f5f5',color:'#aaa',fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'2px',textTransform:'uppercase'}}>
                Sin imágenes. Agrega URLs de imágenes.
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {form.images.map((img, i) => (
                  <div key={i} style={{position:'relative',border:`2px solid ${img.isPrimary?'#000':'#e0e0e0'}`}}>
                    <img src={img.url} alt="" style={{width:'100%',height:120,objectFit:'cover',display:'block'}} loading="lazy" />
                    <div style={{padding:'6px 8px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
                      <button type="button" style={{fontFamily:'Montserrat,sans-serif',fontSize:7,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',background:'none',cursor:'pointer',color:img.isPrimary?'#2e7d32':'#999'}} onClick={()=>handleSetPrimary(i)}>
                        {img.isPrimary ? '★ Principal' : 'Set principal'}
                      </button>
                      <button type="button" style={{fontFamily:'Montserrat,sans-serif',fontSize:7,letterSpacing:'1px',textTransform:'uppercase',border:'none',background:'none',cursor:'pointer',color:'#c62828'}} onClick={()=>handleRemoveImage(i)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
            <button type="button" className="btn-cancel" onClick={()=>navigate('/admin/vehicles')}>CANCELAR</button>
            <button type="submit" className="btn-submit-admin" disabled={saving}>{saving?'GUARDANDO...':'GUARDAR VEHÍCULO'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
