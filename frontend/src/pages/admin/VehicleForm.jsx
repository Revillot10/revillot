import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehiclesApi, miscApi } from '../../services/api';

const BODY_STYLES   = ['Coupe','Convertible','SUV','Saloon','Estate','Hatchback','Pickup','Supercar'];
const FUEL_TYPES    = ['Gasolina','Diesel','Híbrido','Eléctrico'];
const TRANSMISSIONS = ['Automático','Manual','Semi-automático'];
const STATUSES      = ['available','under_offer','reserved','sold'];

// 30 marcas más vendidas en Chile (para ordenar primero en el dropdown)
const CHILE_TOP_BRANDS = new Set([
  'chevrolet','kia','toyota','hyundai','nissan',
  'suzuki','mitsubishi','mazda','ford','volkswagen',
  'renault','peugeot','citroën','honda','jeep',
  'mg','byd','chery','dfsk','jac',
  'mercedes-benz','bmw','audi','subaru','volvo',
  'land rover','fiat','dodge','ram','great wall',
]);

export default function VehicleForm() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = !!id;
  const fileInputRef  = useRef(null);
  const dropdownRef   = useRef(null);

  const [brands,        setBrands]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState(null);
  const [errors,        setErrors]        = useState({});
  const [brandSearch,   setBrandSearch]   = useState('');
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [addingBrand,   setAddingBrand]   = useState(false);
  const [newBrandName,  setNewBrandName]  = useState('');
  const [uploadingImg,  setUploadingImg]  = useState(false);

  const [form, setForm] = useState({
    brand_id:'', model:'', variant:'', year: new Date().getFullYear(),
    colour:'', interior_colour:'', body_style:'', fuel_type:'Gasolina',
    transmission:'', engine_description:'', power_bhp:'', zero_to_sixty:'',
    top_speed_mph:'', mileage:'', price:'', status:'available',
    featured: false, description:'',
    images: [],
  });

  const selectedBrand = brands.find(b => String(b.id) === String(form.brand_id));

  // Filtrar y ordenar: primero top Chile, luego resto
  const filteredBrands = (() => {
    const q = brandSearch.toLowerCase().trim();
    const all = q ? brands.filter(b => b.name.toLowerCase().includes(q)) : brands;
    const popular = all.filter(b => CHILE_TOP_BRANDS.has(b.name.toLowerCase()));
    const rest    = all.filter(b => !CHILE_TOP_BRANDS.has(b.name.toLowerCase()));
    return { popular, rest };
  })();

  // Cargar todas las marcas (endpoint admin — sin filtro de stock)
  useEffect(() => {
    miscApi.adminGetBrands()
      .then(r => setBrands(r.data))
      .catch(() => miscApi.getBrands().then(r => setBrands(r.data)));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    vehiclesApi.getOne(id)
      .then(r => {
        const v = r.data.vehicle;
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
  }, [id]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const f = k => e => setForm(prev => ({
    ...prev,
    [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }));

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!form.brand_id) e.brand_id = 'Selecciona o crea una marca';
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
        year:          parseInt(form.year)            || null,
        mileage:       parseInt(form.mileage)         || 0,
        price:         parseFloat(form.price)         || null,
        power_bhp:     parseFloat(form.power_bhp)     || null,
        zero_to_sixty: parseFloat(form.zero_to_sixty) || null,
        top_speed_mph: parseInt(form.top_speed_mph)   || null,
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

  // ── Brand handlers ───────────────────────────────────────────
  const handleBrandInput = (e) => {
    setBrandSearch(e.target.value);
    setShowDropdown(true);
    // Si el usuario borra/cambia el texto, limpiar la selección
    if (selectedBrand && selectedBrand.name.toLowerCase() !== e.target.value.toLowerCase()) {
      setForm(prev => ({...prev, brand_id: ''}));
    }
  };

  const handleBrandSelect = (brand) => {
    setForm(prev => ({...prev, brand_id: brand.id}));
    setBrandSearch(brand.name);
    setShowDropdown(false);
    setErrors(prev => ({...prev, brand_id: undefined}));
  };

  const handleCreateBrand = async () => {
    const name = newBrandName.trim();
    if (!name) return;
    setAddingBrand(true);
    try {
      const res = await miscApi.adminCreateBrand(name);
      const created = res.data;
      setBrands(prev => [...prev, { ...created, vehicle_count: 0 }].sort((a,b) => a.name.localeCompare(b.name)));
      handleBrandSelect(created);
      setNewBrandName('');
      showToast(`Marca "${created.name}" creada`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al crear marca', 'error');
    } finally {
      setAddingBrand(false);
    }
  };

  // ── Image handlers ───────────────────────────────────────────
  const handleAddImageUrl = () => {
    const url = window.prompt('URL de la imagen:');
    if (!url?.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: url.trim(), isPrimary: prev.images.length === 0 }],
    }));
  };

  const handleFileUpload = (files) => {
    if (!files?.length) return;
    setUploadingImg(true);
    const readers = Array.from(files).map(file => new Promise((resolve) => {
      if (!file.type.startsWith('image/')) { resolve(null); return; }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} supera 5 MB`, 'error');
        resolve(null); return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length) {
        setForm(prev => {
          const newImgs = valid.map((url, i) => ({
            url,
            isPrimary: prev.images.length === 0 && i === 0,
          }));
          return {...prev, images: [...prev.images, ...newImgs]};
        });
        showToast(`${valid.length} imagen${valid.length > 1 ? 'es' : ''} agregada${valid.length > 1 ? 's' : ''}`);
      }
      setUploadingImg(false);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); };

  const handleSetPrimary = (idx) =>
    setForm(prev => ({...prev, images: prev.images.map((img, i) => ({...img, isPrimary: i === idx}))}));

  const handleRemoveImage = (idx) =>
    setForm(prev => {
      const updated = prev.images.filter((_, i) => i !== idx);
      if (prev.images[idx]?.isPrimary && updated.length > 0) updated[0] = {...updated[0], isPrimary: true};
      return {...prev, images: updated};
    });

  if (loading) return (
    <>
      <div className="admin-topbar"><div className="admin-topbar__title">{isEdit ? 'EDITAR' : 'NUEVO'} VEHÍCULO</div></div>
      <div className="admin-content"><div className="loading" /></div>
    </>
  );

  // ── Sub-components ───────────────────────────────────────────
  const Input = ({ label, field, type = 'text', required, ...rest }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <input
        className="form-input"
        type={type}
        value={form[field] || ''}
        onChange={f(field)}
        style={{ marginBottom: 0, ...(errors[field] ? { borderColor: '#c62828' } : {}) }}
        {...rest}
      />
      {errors[field] && <span style={{ color: '#c62828', fontSize: 10, fontFamily: 'Montserrat,sans-serif', letterSpacing: '1px' }}>{errors[field]}</span>}
    </div>
  );

  // Campo numérico — type="text" con inputMode numérico para evitar flechas
  const NumInput = ({ label, field, required, placeholder, step }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <input
        className="form-input"
        type="text"
        inputMode={step ? 'decimal' : 'numeric'}
        pattern={step ? '[0-9]*[.,]?[0-9]*' : '[0-9]*'}
        value={form[field] || ''}
        onChange={e => {
          const val = e.target.value.replace(',', '.');
          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) f(field)({ target: { value: val } });
        }}
        placeholder={placeholder}
        style={{ marginBottom: 0, ...(errors[field] ? { borderColor: '#c62828' } : {}) }}
      />
      {errors[field] && <span style={{ color: '#c62828', fontSize: 10, fontFamily: 'Montserrat,sans-serif', letterSpacing: '1px' }}>{errors[field]}</span>}
    </div>
  );

  const Select = ({ label, field, options, required }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <select
        className="form-input"
        value={form[field] || ''}
        onChange={f(field)}
        style={{ marginBottom: 0, ...(errors[field] ? { borderColor: '#c62828' } : {}) }}
      >
        <option value="">— Seleccionar —</option>
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[field] && <span style={{ color: '#c62828', fontSize: 10, fontFamily: 'Montserrat,sans-serif' }}>{errors[field]}</span>}
    </div>
  );

  const hasPopular = filteredBrands.popular.length > 0;
  const hasRest    = filteredBrands.rest.length > 0;
  const noResults  = !hasPopular && !hasRest;

  const dropdownItemStyle = (brand) => ({
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'Montserrat,sans-serif',
    fontSize: 11,
    letterSpacing: '1px',
    borderBottom: '1px solid #f5f5f5',
    background: String(brand.id) === String(form.brand_id) ? '#f0f7f0' : '#fff',
    color: String(brand.id) === String(form.brand_id) ? '#2e7d32' : '#222',
    fontWeight: String(brand.id) === String(form.brand_id) ? 600 : 400,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  });

  const sectionLabel = {
    padding: '8px 14px 4px',
    fontSize: 8,
    fontFamily: 'Montserrat,sans-serif',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#aaa',
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
    position: 'sticky',
    top: 0,
  };

  return (
    <>
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <div className="admin-topbar">
        <div className="admin-topbar__title">{isEdit ? 'EDITAR' : 'NUEVO'} VEHÍCULO</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-cancel" onClick={() => navigate('/admin/vehicles')}>CANCELAR</button>
          <button className="btn-submit-admin" onClick={handleSubmit} disabled={saving}>{saving ? 'GUARDANDO...' : 'GUARDAR'}</button>
        </div>
      </div>

      <div className="admin-content">
        <form onSubmit={handleSubmit} className="admin-form-page">

          {/* ── INFORMACIÓN BÁSICA ── */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-section-title">INFORMACIÓN BÁSICA</div>
            <div className="form-grid">

              {/* BRAND SELECTOR */}
              <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
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
                    marginBottom: 0,
                    paddingRight: form.brand_id ? 100 : 12,
                    ...(errors.brand_id ? { borderColor: '#c62828' } : {}),
                    ...(form.brand_id   ? { borderColor: '#2e7d32' } : {}),
                  }}
                />
                {form.brand_id && (
                  <span style={{
                    position: 'absolute', right: 12, top: 37,
                    fontSize: 8, fontFamily: 'Montserrat,sans-serif',
                    letterSpacing: '1px', color: '#2e7d32', fontWeight: 600,
                    pointerEvents: 'none',
                  }}>✓ SELECCIONADA</span>
                )}
                {errors.brand_id && (
                  <span style={{ color: '#c62828', fontSize: 10, fontFamily: 'Montserrat,sans-serif', letterSpacing: '1px' }}>{errors.brand_id}</span>
                )}

                {/* DROPDOWN */}
                {showDropdown && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 1000,
                    background: '#fff', border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    maxHeight: 340, overflowY: 'auto',
                  }}>
                    {/* Sección: más vendidas en Chile */}
                    {hasPopular && (
                      <>
                        <div style={sectionLabel}>⭐ Más vendidas en Chile</div>
                        {filteredBrands.popular.map(b => (
                          <div key={b.id} onMouseDown={() => handleBrandSelect(b)} style={dropdownItemStyle(b)}>
                            {String(b.id) === String(form.brand_id) && <span style={{ color: '#2e7d32' }}>✓</span>}
                            {b.name}
                            {b.vehicle_count > 0 && (
                              <span style={{ marginLeft: 'auto', fontSize: 8, color: '#bbb', letterSpacing: '1px' }}>
                                {b.vehicle_count} veh.
                              </span>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Sección: otras marcas */}
                    {hasRest && (
                      <>
                        <div style={{ ...sectionLabel, top: hasPopular ? undefined : 0 }}>Otras marcas</div>
                        {filteredBrands.rest.map(b => (
                          <div key={b.id} onMouseDown={() => handleBrandSelect(b)} style={{ ...dropdownItemStyle(b), color: String(b.id) === String(form.brand_id) ? '#2e7d32' : '#555' }}>
                            {String(b.id) === String(form.brand_id) && <span style={{ color: '#2e7d32' }}>✓</span>}
                            {b.name}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Sin resultados + opción de crear */}
                    {noResults && (
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, color: '#aaa', letterSpacing: '1px', marginBottom: 10 }}>
                          Sin resultados para "{brandSearch}"
                        </div>
                        <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, color: '#888', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                          ¿Crear marca nueva?
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Nombre de la marca"
                            value={newBrandName}
                            onChange={e => setNewBrandName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateBrand()}
                            style={{ flex: 1, marginBottom: 0, fontSize: 11 }}
                            onMouseDown={e => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="btn-submit-admin"
                            style={{ padding: '8px 12px', fontSize: 8, whiteSpace: 'nowrap' }}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={handleCreateBrand}
                            disabled={addingBrand || !newBrandName.trim()}
                          >
                            {addingBrand ? '...' : '+ CREAR'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Crear marca desde cualquier búsqueda (al fondo del dropdown) */}
                    {!noResults && (
                      <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 14px' }}>
                        <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 8, color: '#bbb', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                          ¿No encuentras la marca?
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Escribe el nombre y crea"
                            value={newBrandName}
                            onChange={e => setNewBrandName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateBrand()}
                            style={{ flex: 1, marginBottom: 0, fontSize: 11 }}
                            onMouseDown={e => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            className="btn-submit-admin"
                            style={{ padding: '8px 12px', fontSize: 8, whiteSpace: 'nowrap' }}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={handleCreateBrand}
                            disabled={addingBrand || !newBrandName.trim()}
                          >
                            {addingBrand ? '...' : '+ CREAR'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Input label="Modelo" field="model" required placeholder="Ej: Corolla" />
              <Input label="Variante" field="variant" placeholder="Ej: 2.0 CVT XEI" />
              <NumInput label="Año *" field="year" required placeholder={String(new Date().getFullYear())} />
            </div>

            <div className="form-grid">
              <Select label="Estado" field="status" options={STATUSES} />
              <NumInput label="Precio (CLP)" field="price" placeholder="Ej: 18000000" />
            </div>

            <div className="form-group" style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>
                <input type="checkbox" checked={!!form.featured} onChange={f('featured')} style={{ width: 16, height: 16 }} />
                VEHÍCULO DESTACADO (aparece en homepage)
              </label>
            </div>
          </div>

          {/* ── CARACTERÍSTICAS ── */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-section-title">CARACTERÍSTICAS</div>
            <div className="form-grid">
              <Input    label="Color exterior"    field="colour"             placeholder="Ej: Blanco Perlado" />
              <Input    label="Color interior"    field="interior_colour"    placeholder="Ej: Negro" />
              <Select   label="Carrocería"        field="body_style"         options={BODY_STYLES} />
              <Select   label="Combustible"       field="fuel_type"          options={FUEL_TYPES} />
              <Select   label="Transmisión"       field="transmission"       options={TRANSMISSIONS} />
              <Input    label="Motor"             field="engine_description" placeholder="Ej: 2.5L 4 cil. DOHC VVT-i" />
              <NumInput label="Potencia (BHP)"    field="power_bhp"          placeholder="Ej: 178" />
              <NumInput label="Kilometraje (km)"  field="mileage"            placeholder="Ej: 32000" />
              <NumInput label="0-100 km/h (seg)"  field="zero_to_sixty"      placeholder="Ej: 8.5" step />
              <NumInput label="Vel. máxima (mph)" field="top_speed_mph"      placeholder="Ej: 130" />
            </div>
          </div>

          {/* ── DESCRIPCIÓN ── */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div className="form-section-title">DESCRIPCIÓN</div>
            <div className="form-group">
              <textarea
                className="form-input"
                rows={6}
                value={form.description || ''}
                onChange={f('description')}
                placeholder="Descripción detallada del vehículo..."
                style={{ marginBottom: 0, height: 'auto' }}
              />
            </div>
          </div>

          {/* ── IMÁGENES ── */}
          <div className="admin-form" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e0e0e0' }}>
              <div className="form-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>IMÁGENES</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-cancel" style={{ padding: '8px 14px', fontSize: 8 }} onClick={handleAddImageUrl}>
                  + URL
                </button>
                <button type="button" className="btn-submit-admin" style={{ padding: '8px 14px', fontSize: 8 }}
                  onClick={() => fileInputRef.current?.click()} disabled={uploadingImg}>
                  {uploadingImg ? 'SUBIENDO...' : '📷 SUBIR FOTO'}
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => { handleFileUpload(e.target.files); e.target.value = ''; }}
            />

            {/* Zona drag & drop */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #e0e0e0', borderRadius: 4, padding: '24px 20px',
                textAlign: 'center', cursor: 'pointer',
                marginBottom: form.images.length ? 16 : 0,
                background: '#fafafa', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#999'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', lineHeight: 1.8 }}>
                Toca para elegir fotos o tomar desde la cámara<br />
                <span style={{ color: '#bbb', fontSize: 8 }}>También puedes arrastrar archivos aquí · Máx. 5 MB por imagen</span>
              </div>
            </div>

            {/* Grid de miniaturas */}
            {form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', border: `2px solid ${img.isPrimary ? '#222' : '#e0e0e0'}`, borderRadius: 2, overflow: 'hidden' }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} loading="lazy" />
                    {img.isPrimary && (
                      <div style={{ position: 'absolute', top: 6, left: 6, background: '#222', color: '#fff', fontSize: 7, fontFamily: 'Montserrat,sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 7px' }}>
                        ★ Principal
                      </div>
                    )}
                    <div style={{ padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                      <button type="button"
                        style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase', border: 'none', background: 'none', cursor: 'pointer', color: img.isPrimary ? '#2e7d32' : '#999', padding: 0 }}
                        onClick={() => handleSetPrimary(i)}>
                        {img.isPrimary ? '✓ Principal' : 'Set principal'}
                      </button>
                      <button type="button"
                        style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 7, letterSpacing: '1px', border: 'none', background: 'none', cursor: 'pointer', color: '#c62828', padding: 0 }}
                        onClick={() => handleRemoveImage(i)}>
                        ✕ Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/vehicles')}>CANCELAR</button>
            <button type="submit" className="btn-submit-admin" disabled={saving}>{saving ? 'GUARDANDO...' : 'GUARDAR VEHÍCULO'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
