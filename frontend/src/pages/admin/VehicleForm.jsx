import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesApi, miscApi } from '../../services/api';

const BODY_STYLES   = ['Coupe','Convertible','SUV','Saloon','Estate','Hatchback','Pickup','Supercar'];
const FUEL_TYPES    = ['Gasolina','Diesel','Híbrido','Eléctrico'];
const TRANSMISSIONS = ['Automático','Manual','Semi-automático'];
const STATUSES      = ['available','under_offer','reserved','sold'];

// 30 marcas más vendidas en Chile (ordenadas por popularidad)
const CHILE_BRANDS = [
  'Chevrolet','Kia','Toyota','Hyundai','Nissan',
  'Suzuki','Mitsubishi','Mazda','Ford','Volkswagen',
  'Renault','Peugeot','Citroën','Honda','Jeep',
  'MG','BYD','Chery','DFSK','JAC',
  'Mercedes-Benz','BMW','Audi','Subaru','Volvo',
  'Land Rover','Fiat','Dodge','RAM','Great Wall',
];

export default function VehicleForm() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = !!id;
  const fileInputRef = useRef(null);

  const [brands,       setBrands]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);
  const [errors,       setErrors]       = useState({});
  const [brandSearch,  setBrandSearch]  = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    brand_id:'', model:'', variant:'', year: new Date().getFullYear(),
    colour:'', interior_colour:'', body_style:'', fuel_type:'Gasolina',
    transmission:'', engine_description:'', power_bhp:'', zero_to_sixty:'',
    top_speed_mph:'', mileage:'', price:'', status:'available',
    featured: false, description:'',
    images: [],
  });

  // Marca actualmente seleccionada (para mostrar su nombre en el campo)
  const selectedBrand = brands.find(b => String(b.id) === String(form.brand_id));

  // Marcas del dropdown: primero las 30 de Chile que existen en BD,
  // luego el resto, filtradas por búsqueda
  const filteredBrands = (() => {
    const q = brandSearch.toLowerCase().trim();
    const all = q ? brands.filter(b => b.name.toLowerCase().includes(q)) : brands;
    const chileSet = new Set(CHILE_BRANDS.map(n => n.toLowerCase()));
    const popular = all.filter(b => chileSet.has(b.name.toLowerCase()));
    const rest     = all.filter(b => !chileSet.has(b.name.toLowerCase()));
    return { popular, rest };
  })();

  useEffect(() => {
    miscApi.getBrands().then(r => setBrands(r.data)).catch(console.error);
    if (isEdit) {
      setLoading(true);
      vehiclesApi.getOne(id)
        .then(r => {
          const v = r.data.vehicle;
          // Pre-fill brand search label
          setBrandSearch(v.brand_name || '');
          setForm(prev => ({...prev,
            brand_id:           v.brand_id           || '',
            model:              v.model              || '',
            variant:            v.variant            || '',
            year:               v.year               || '',
            colour:             v.colour             || '',
            interior_colour:    v.interior_colour    || '',
            body_style:         v.body_style         || '',
            fuel_type:          v.fuel_type          || 'Gasolina',
            transmission:       v.transmission       || '',
            engine_description: v.engine_description || '',
            power_bhp:          v.power_bhp          || '',
            zero_to_sixty:      v.zero_to_sixty      || '',
            top_speed_mph:      v.top_speed_mph      || '',
            mileage:            v.mileage            || '',
            price:              v.price              || '',
            status:             v.status             || 'available',
            featured:           v.featured           || false,
            description:        v.description        || '',
            images:             v.images             || [],
          }));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.brand-select-wrapper')) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const f = k => e => setForm(prev => ({...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}));
  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

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
        year:          parseInt(form.year)          || null,
        mileage:       parseInt(form.mileage)       || 0,
        price:         parseFloat(form.price)       || null,
        power_bhp:     parseFloat(form.power_bhp)   || null,
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

  // ── Brand selector handlers ──────────────────────────────────
  const handleBrandInput = (e) => {
    setBrandSearch(e.target.value);
    setShowDropdown(true);
    // Si el texto ya no coincide con la marca seleccionada, limpiar selección
    if (selectedBrand && !selectedBrand.name.toLowerCase().startsWith(e.target.value.toLowerCase())) {
      setForm(prev => ({...prev, brand_id: ''}));
    }
  };

  const handleBrandSelect = (brand) => {
    setForm(prev => ({...prev, brand_id: brand.id}));
    setBrandSearch(brand.name);
    setShowDropdown(false);
    setErrors(prev => ({...prev, brand_id: undefined}));
  };

  // ── Image handlers ───────────────────────────────────────────
  const handleAddImageUrl = () => {
    const url = window.prompt('URL de la imagen:');
    if (!url?.trim()) return;
    setForm(prev => ({...prev, images: [...prev.images, { url: url.trim(), isPrimary: prev.images.length === 0 }]}));
  };

  // Convierte archivo a base64 y lo envía como URL data: (o podrías subir a un CDN)
  const handleFileUpload = (files) => {
    if (!files?.length) return;
    setUploadingImg(true);
    const readers = Array.from(files).map(file => new Promise((resolve) => {
      // Validar tipo
      if (!file.type.startsWith('image/')) { resolve(null); return; }
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} supera 5MB`, 'error'); resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(results => {
      const valid = results.filter(Boolean);
      if (!valid.length) { setUploadingImg(false); return; }
      setForm(prev => {
        const newImages = valid.map((url, i) => ({
          url,
          isPrimary: prev.images.length === 0 && i === 0,
        }));
        return {...prev, images: [...prev.images, ...newImages]};
      });
      setUploadingImg(false);
      showToast(`${valid.length} imagen${valid.length > 1 ? 'es' : ''} agregada${valid.length > 1 ? 's' : ''}`);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSetPrimary = (idx) => {
    setForm(prev => ({...prev, images: prev.images.map((img, i) => ({...img, isPrimary: i === idx}))}));
  };

  const handleRemoveImage = (idx) => {
    setForm(prev => {
      const updated = prev.images.filter((_,i) => i !== idx);
      // Si se elimina la principal y quedan más, poner la primera como principal
      if (prev.images[idx]?.isPrimary && updated.length > 0) {
        updated[0] = {...updated[0], isPrimary: true};
      }
      return {...prev, images: updated};
    });
  };

  if (loading) return (
    <>
      <div className="admin-topbar"><div className="admin-topbar__title">{isEdit?'EDITAR':'NUEVO'} VEHÍCULO</div></div>
      <div className="admin-content"><div className="loading"/></div>
    </>
  );

  const Input = ({label, field, type='text', required, ...rest}) => (
    <div className="form-group">
      <label className="form-label">{label}{required&&' *'}</label>
      <input className="form-input" type={type} value={form[field]||''} onChange={f(field)}
        style={{marginBottom:0,...(errors[field]?{borderColor:'#c62828'}:{})}} {...rest} />
      {errors[field] && <span style={{color:'#c62828',fontSize:10,fontFamily:'Montserrat,sans-serif',letterSpacing:'1px'}}>{errors[field]}</span>}
    </div>
  );

  const Select = ({label, field, options, required}) => (
    <div className="form-group">
      <label className="form-label">{label}{required&&' *'}</label>
      <select className="form-input" value={form[field]||''} onChange={f(field)}
        style={{marginBottom:0,...(errors[field]?{borderColor:'#c62828'}:{})}}>
        <option value="">— Seleccionar —</option>
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[field] && <span style={{color:'#c62828',fontSize:10,fontFamily:'Montserrat,sans-serif'}}>{errors[field]}</span>}
    </div>
  );

  const hasPopular = filteredBrands.popular.length > 0;
  const hasRest    = filteredBrands.rest.length > 0;

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

          {/* ── INFORMACIÓN BÁSICA ── */}
          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">INFORMACIÓN BÁSICA</div>
            <div className="form-grid">

              {/* BRAND SELECTOR CON BÚSQUEDA */}
              <div className="form-group brand-select-wrapper" style={{position:'relative'}}>
                <label className="form-label">Marca *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Buscar marca..."
                  value={brandSearch}
                  onChange={handleBrandInput}
                  onFocus={() => setShowDropdown(true)}
                  autoComplete="off"
                  style={{
                    marginBottom:0,
                    ...(errors.brand_id ? {borderColor:'#c62828'} : {}),
                    ...(form.brand_id   ? {borderColor:'#2e7d32',borderWidth:1.5} : {}),
                  }}
                />
                {form.brand_id && (
                  <span style={{
                    position:'absolute', right:12, top:36,
                    fontSize:9, fontFamily:'Montserrat,sans-serif',
                    letterSpacing:'1px', color:'#2e7d32', fontWeight:600,
                    pointerEvents:'none',
                  }}>✓ SELECCIONADA</span>
                )}
                {errors.brand_id && (
                  <span style={{color:'#c62828',fontSize:10,fontFamily:'Montserrat,sans-serif',letterSpacing:'1px'}}>{errors.brand_id}</span>
                )}

                {/* DROPDOWN */}
                {showDropdown && (hasPopular || hasRest) && (
                  <div style={{
                    position:'absolute', top:'100%', left:0, right:0, zIndex:1000,
                    background:'#fff', border:'1px solid #e0e0e0',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.12)',
                    maxHeight:320, overflowY:'auto',
                  }}>
                    {/* Marcas populares en Chile */}
                    {hasPopular && (
                      <>
                        <div style={{
                          padding:'8px 14px 4px',
                          fontSize:8, fontFamily:'Montserrat,sans-serif',
                          letterSpacing:'2px', textTransform:'uppercase',
                          color:'#999', borderBottom:'1px solid #f0f0f0',
                          position:'sticky', top:0, background:'#fafafa',
                        }}>
                          ⭐ Más vendidas en Chile
                        </div>
                        {filteredBrands.popular.map(b => (
                          <div key={b.id}
                            onMouseDown={() => handleBrandSelect(b)}
                            style={{
                              padding:'10px 14px',
                              cursor:'pointer',
                              fontFamily:'Montserrat,sans-serif',
                              fontSize:11, letterSpacing:'1px',
                              borderBottom:'1px solid #f5f5f5',
                              background: String(b.id) === String(form.brand_id) ? '#f0f7f0' : '#fff',
                              color: String(b.id) === String(form.brand_id) ? '#2e7d32' : '#222',
                              fontWeight: String(b.id) === String(form.brand_id) ? 600 : 400,
                              display:'flex', alignItems:'center', gap:8,
                            }}
                          >
                            {String(b.id) === String(form.brand_id) && <span style={{color:'#2e7d32'}}>✓</span>}
                            {b.name}
                            {b.vehicle_count > 0 && (
                              <span style={{marginLeft:'auto',fontSize:8,color:'#aaa',letterSpacing:'1px'}}>
                                {b.vehicle_count} veh.
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Resto de marcas */}
                    {hasRest && (
                      <>
                        <div style={{
                          padding:'8px 14px 4px',
                          fontSize:8, fontFamily:'Montserrat,sans-serif',
                          letterSpacing:'2px', textTransform:'uppercase',
                          color:'#bbb', borderBottom:'1px solid #f0f0f0',
                          position:'sticky', top: hasPopular ? 33 : 0, background:'#fafafa',
                        }}>
                          Otras marcas
                        </div>
                        {filteredBrands.rest.map(b => (
                          <div key={b.id}
                            onMouseDown={() => handleBrandSelect(b)}
                            style={{
                              padding:'10px 14px',
                              cursor:'pointer',
                              fontFamily:'Montserrat,sans-serif',
                              fontSize:11, letterSpacing:'1px',
                              borderBottom:'1px solid #f5f5f5',
                              background: String(b.id) === String(form.brand_id) ? '#f0f7f0' : '#fff',
                              color: String(b.id) === String(form.brand_id) ? '#2e7d32' : '#555',
                              fontWeight: String(b.id) === String(form.brand_id) ? 600 : 400,
                              display:'flex', alignItems:'center', gap:8,
                            }}
                          >
                            {String(b.id) === String(form.brand_id) && <span style={{color:'#2e7d32'}}>✓</span>}
                            {b.name}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Sin resultados */}
                    {!hasPopular && !hasRest && (
                      <div style={{padding:'16px 14px',fontFamily:'Montserrat,sans-serif',fontSize:10,color:'#aaa',letterSpacing:'1px'}}>
                        Sin resultados para "{brandSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Input  label="Modelo" field="model" required placeholder="Ej: Corolla" />
              <Input  label="Variante" field="variant" placeholder="Ej: 2.0 CVT XEI" />
              <Input  label="Año" field="year" type="number" required min="1950" max="2030" />
            </div>
            <div className="form-grid">
              <Select label="Estado" field="status" options={STATUSES} />
              <Input  label="Precio (CLP)" field="price" type="number" placeholder="Ej: 18000000" />
            </div>
            <div className="form-group" style={{marginTop:8}}>
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontFamily:'Montserrat,sans-serif',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'#999'}}>
                <input type="checkbox" checked={!!form.featured} onChange={f('featured')} style={{width:16,height:16}} />
                VEHÍCULO DESTACADO (aparece en homepage)
              </label>
            </div>
          </div>

          {/* ── CARACTERÍSTICAS ── */}
          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">CARACTERÍSTICAS</div>
            <div className="form-grid">
              <Input  label="Color exterior" field="colour" placeholder="Ej: Blanco Perlado" />
              <Input  label="Color interior" field="interior_colour" placeholder="Ej: Negro" />
              <Select label="Carrocería" field="body_style" options={BODY_STYLES} />
              <Select label="Combustible" field="fuel_type" options={FUEL_TYPES} />
              <Select label="Transmisión" field="transmission" options={TRANSMISSIONS} />
              <Input  label="Motor" field="engine_description" placeholder="Ej: 2.5L 4 cil. DOHC VVT-i" />
              <Input  label="Potencia (BHP)" field="power_bhp" type="number" placeholder="Ej: 178" />
              <Input  label="Kilometraje (km)" field="mileage" type="number" placeholder="Ej: 32000" />
              <Input  label="0-100 km/h (seg)" field="zero_to_sixty" type="number" step="0.01" placeholder="Ej: 8.5" />
              <Input  label="Vel. máxima (mph)" field="top_speed_mph" type="number" placeholder="Ej: 130" />
            </div>
          </div>

          {/* ── DESCRIPCIÓN ── */}
          <div className="admin-form" style={{marginBottom:20}}>
            <div className="form-section-title">DESCRIPCIÓN</div>
            <div className="form-group">
              <textarea className="form-input" rows={6} value={form.description||''} onChange={f('description')}
                placeholder="Descripción detallada del vehículo..." style={{marginBottom:0,height:'auto'}} />
            </div>
          </div>

          {/* ── IMÁGENES ── */}
          <div className="admin-form" style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:'1px solid #e0e0e0'}}>
              <div className="form-section-title" style={{margin:0,padding:0,border:'none'}}>IMÁGENES</div>
              <div style={{display:'flex',gap:8}}>
                <button type="button" className="btn-cancel"
                  style={{padding:'8px 14px',fontSize:8}}
                  onClick={handleAddImageUrl}>
                  + URL
                </button>
                <button type="button" className="btn-submit-admin"
                  style={{padding:'8px 14px',fontSize:8}}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImg}>
                  {uploadingImg ? 'SUBIENDO...' : '📷 SUBIR FOTO'}
                </button>
              </div>
            </div>

            {/* Input file oculto — acepta imágenes, cámara en móvil */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              style={{display:'none'}}
              onChange={e => { handleFileUpload(e.target.files); e.target.value=''; }}
            />

            {/* Zona de drop + instrucciones */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border:'2px dashed #e0e0e0',
                borderRadius:4,
                padding:'24px 20px',
                textAlign:'center',
                cursor:'pointer',
                marginBottom: form.images.length ? 16 : 0,
                background:'#fafafa',
                transition:'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#999'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#e0e0e0'}
            >
              <div style={{fontSize:28,marginBottom:8}}>📷</div>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:9,letterSpacing:'2px',textTransform:'uppercase',color:'#999',lineHeight:1.8}}>
                Toca para elegir fotos o tomar desde la cámara<br/>
                <span style={{color:'#bbb',fontSize:8}}>También puedes arrastrar archivos aquí · Máx. 5 MB por imagen</span>
              </div>
            </div>

            {/* Grid de imágenes */}
            {form.images.length > 0 && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))',gap:12}}>
                {form.images.map((img, i) => (
                  <div key={i} style={{
                    position:'relative',
                    border:`2px solid ${img.isPrimary ? '#222' : '#e0e0e0'}`,
                    borderRadius:2,
                    overflow:'hidden',
                  }}>
                    <img
                      src={img.url}
                      alt=""
                      style={{width:'100%',height:130,objectFit:'cover',display:'block'}}
                      loading="lazy"
                    />
                    {img.isPrimary && (
                      <div style={{
                        position:'absolute',top:6,left:6,
                        background:'#222',color:'#fff',
                        fontSize:7,fontFamily:'Montserrat,sans-serif',
                        letterSpacing:'1.5px',textTransform:'uppercase',
                        padding:'3px 7px',
                      }}>★ Principal</div>
                    )}
                    <div style={{padding:'6px 8px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
                      <button type="button"
                        style={{fontFamily:'Montserrat,sans-serif',fontSize:7,letterSpacing:'1.5px',textTransform:'uppercase',border:'none',background:'none',cursor:'pointer',color:img.isPrimary?'#2e7d32':'#999',padding:0}}
                        onClick={() => handleSetPrimary(i)}
                      >
                        {img.isPrimary ? '✓ Principal' : 'Set principal'}
                      </button>
                      <button type="button"
                        style={{fontFamily:'Montserrat,sans-serif',fontSize:7,letterSpacing:'1px',border:'none',background:'none',cursor:'pointer',color:'#c62828',padding:0}}
                        onClick={() => handleRemoveImage(i)}
                      >✕ Quitar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.images.length === 0 && !uploadingImg && (
              <div style={{marginTop:8,fontFamily:'Montserrat,sans-serif',fontSize:8,letterSpacing:'1.5px',color:'#bbb',textAlign:'center',textTransform:'uppercase'}}>
                Sin imágenes aún
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
