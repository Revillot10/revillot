import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VehicleCard from '../components/ui/VehicleCard';
import { vehiclesApi, leadsApi } from '../services/api';

const fmtPrice = v => v ? `$${Number(v).toLocaleString('es-CL')}` : 'A consultar';

/* ── Galería con flechas ─────────────────────────────────── */
function Gallery({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomed,  setZoomed]  = useState(false);
  const total = images.length;

  const prev = () => setCurrent(i => (i - 1 + total) % total);
  const next = () => setCurrent(i => (i + 1) % total);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setZoomed(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  if (!images.length) return null;

  return (
    <div>
      {/* ── Imagen principal ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: '#0a0a0a',
        overflow: 'hidden',
        cursor: 'zoom-in',
      }}
        onClick={() => setZoomed(true)}
      >
        <img
          src={images[current]?.url}
          alt=""
          style={{
            width: '100%',
            aspectRatio: '16/10',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.25s ease',
          }}
        />

        {/* Flechas */}
        {total > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              style={arrowStyle('left')}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9 1L1 9l8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={arrowStyle('right')}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M1 1l8 8-8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Contador */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontFamily: 'Montserrat,sans-serif', fontSize: 10,
          fontWeight: 500, letterSpacing: '2px',
          padding: '6px 12px',
        }}>
          {current + 1} / {total}
        </div>

        {/* Ícono zoom */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(0,0,0,0.45)', padding: '7px 8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>

      {/* ── Tira de miniaturas ── */}
      {total > 1 && (
        <div style={{
          display: 'flex',
          gap: 6,
          marginTop: 6,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {images.map((img, i) => (
            <div
              key={img.id ?? i}
              onClick={() => setCurrent(i)}
              style={{
                flexShrink: 0,
                width: 96, height: 64,
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: i === current ? 1 : 0.45,
                border: i === current ? '2px solid #000' : '2px solid transparent',
                transition: 'opacity 0.2s, border-color 0.2s',
                background: '#111',
              }}
            >
              <img src={img.url} alt="" loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox fullscreen ── */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '16px',
          }}
        >
          <img
            src={images[current]?.url} alt=""
            style={{ maxWidth: '95vw', maxHeight: '95vh', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
          />
          {total > 1 && (
            <>
              <button onClick={e=>{e.stopPropagation();prev();}} style={{ ...arrowStyle('left'), top:'50%', transform:'translateY(-50%)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.45)'}
              >
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
              <button onClick={e=>{e.stopPropagation();next();}} style={{ ...arrowStyle('right'), top:'50%', transform:'translateY(-50%)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.45)'}
              >
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M1 1l8 8-8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </>
          )}
          <button onClick={()=>setZoomed(false)} style={{
            position:'fixed', top:20, right:24,
            background:'none', border:'none', cursor:'pointer',
            color:'#fff', fontSize:32, fontWeight:200, lineHeight:1,
          }}>×</button>
        </div>
      )}
    </div>
  );
}

const arrowStyle = side => ({
  position: 'absolute',
  [side]: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.45)',
  border: 'none', cursor: 'pointer',
  width: 44, height: 44,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s',
  zIndex: 2,
});

/* ── Formulario de consulta ──────────────────────────────── */
function EnquiryForm({ vehicleId }) {
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setSending(true);
    try { await leadsApi.create({ ...form, vehicle_id: vehicleId, lead_type: 'enquiry' }); setSent(true); }
    catch {}
    setSending(false);
  };

  if (sent) return (
    <div style={{ textAlign:'center', padding:'32px 0' }}>
      <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'#2e7d32', marginBottom:8 }}>✓ CONSULTA ENVIADA</div>
      <p style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'#666' }}>Te contactaremos a la brevedad.</p>
    </div>
  );

  return (
    <form onSubmit={handle}>
      <div className="enquiry-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <div>
          <label style={lblSt}>Nombre *</label>
          <input className="form-input" required value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} />
        </div>
        <div>
          <label style={lblSt}>Apellido *</label>
          <input className="form-input" required value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} />
        </div>
      </div>
      <div>
        <label style={lblSt}>Email *</label>
        <input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      </div>
      <div>
        <label style={lblSt}>Teléfono</label>
        <input className="form-input" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
      </div>
      <div>
        <label style={lblSt}>Mensaje</label>
        <textarea className="form-input" rows={3} style={{ height:'auto' }}
          placeholder="¿Alguna pregunta sobre este vehículo?"
          value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
      </div>
      <button type="submit" className="btn-primary" disabled={sending} style={{ marginTop:4 }}>
        {sending ? 'ENVIANDO...' : 'ENVIAR CONSULTA'}
      </button>
    </form>
  );
}

const lblSt = { display:'block', fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', marginBottom:5 };

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function VehicleDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    vehiclesApi.getOne(id)
      .then(r => {
        setData(r.data);
        const v = r.data.vehicle;
        const title = `${v.brand_name} ${v.model}${v.variant ? ' ' + v.variant : ''} — Revillot Garage`;
        const desc  = `${v.brand_name} ${v.model} ${v.year}${v.mileage ? ', ' + Number(v.mileage).toLocaleString('es-CL') + ' km' : ''}${v.colour ? ', ' + v.colour : ''}. Disponible en Revillot Garage, Curicó.`;
        const img   = r.data.vehicle.images?.find(i => i.isPrimary)?.url || r.data.vehicle.images?.[0]?.url || '';
        const url   = `https://www.revillotgarage.cl/vehicles/${r.data.vehicle.id}`;

        document.title = title;

        // Open Graph dinámico
        const setMeta = (prop, val, attr = 'property') => {
          let el = document.querySelector(`meta[${attr}="${prop}"]`);
          if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
          el.setAttribute('content', val);
        };
        setMeta('og:title',       title);
        setMeta('og:description', desc);
        setMeta('og:image',       img);
        setMeta('og:url',         url);
        setMeta('og:type',        'product');
        setMeta('twitter:title',       title,  'name');
        setMeta('twitter:description', desc,   'name');
        setMeta('twitter:image',       img,    'name');
      })
      .catch(() => navigate('/inventory'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Header /><div className="loading" style={{ minHeight:'60vh' }} /></>;
  if (!data) return null;

  const { vehicle, related } = data;

  const specs = [
    ['Precio',       fmtPrice(vehicle.price)],
    ['Color',        vehicle.colour],
    ['Interior',     vehicle.interior_colour],
    ['Año',          vehicle.year],
    ['Kilómetros',   vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('es-CL')} km` : null],
    ['Motor',        vehicle.engine_description],
    ['Transmisión',  vehicle.transmission],
    ['Carrocería',   vehicle.body_style],
    ['Combustible',  vehicle.fuel_type],
    ['Potencia',     vehicle.power_bhp    ? `${vehicle.power_bhp} BHP`        : null],
    ['0–100 km/h',   vehicle.zero_to_sixty ? `${vehicle.zero_to_sixty} seg`   : null],
    ['Vel. máxima',  vehicle.top_speed_mph ? `${vehicle.top_speed_mph} mph`   : null],
  ].filter(([, v]) => v);

  const images = vehicle.images ?? [];

  return (
    <>
      <Header />

      {/* Wrapper con overflow hidden para prevenir scroll horizontal */}
      <div style={{ overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>

      {/* ── Breadcrumb ── */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        fontFamily: 'Montserrat,sans-serif', fontSize: 10,
        fontWeight: 400, letterSpacing: '1px', color: '#999',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ cursor:'pointer', transition:'color 0.2s' }}
          onClick={() => navigate('/')}
          onMouseEnter={e=>e.target.style.color='#000'}
          onMouseLeave={e=>e.target.style.color='#999'}
        >INICIO</span>
        <span style={{ color:'#ddd' }}>›</span>
        <span style={{ cursor:'pointer', transition:'color 0.2s' }}
          onClick={() => navigate('/inventory')}
          onMouseEnter={e=>e.target.style.color='#000'}
          onMouseLeave={e=>e.target.style.color='#999'}
        >STOCK</span>
        <span style={{ color:'#ddd' }}>›</span>
        <span style={{ color:'#000' }}>{vehicle.brand_name} {vehicle.model}</span>
      </div>

      {/* ── Layout principal ── */}
      <div className="vd-main-layout" style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 30px)',
        display: 'grid',
        alignItems: 'start',
      }}>

        {/* ════ COLUMNA IZQUIERDA ════════════════════════════ */}
        <div>

          {/* Galería */}
          <Gallery images={images} />

          {/* Título + precio — debajo de galería en móvil, pero lo ponemos arriba en desktop */}
          <div style={{ marginTop: 40 }}>

            {/* KEY INFORMATION */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 13,
                fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase',
                color: '#000', marginBottom: 20, paddingBottom: 14,
                borderBottom: '1px solid #e8e8e8',
              }}>
                INFORMACIÓN CLAVE
              </h2>
              <div className="specs-grid-detail" style={{ display: 'grid', gap: 0 }}>
                {specs.map(([label, val], i) => (
                  <div key={label} className={i % 2 === 0 ? 'spec-row spec-row--left' : 'spec-row spec-row--right'} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: '1px solid #f2f2f2',
                    minWidth: 0,
                  }}>
                    <span style={{
                      fontFamily: 'Montserrat,sans-serif', fontSize: 11,
                      fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
                      color: '#000', flexShrink: 0,
                    }}>{label}</span>
                    <span style={{
                      fontFamily: 'Montserrat,sans-serif', fontSize: 15,
                      fontWeight: 400, letterSpacing: '0.5px', color: '#000',
                      textAlign: 'right', wordBreak: 'break-word',
                    }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Descripción */}
            {vehicle.description && (
              <div>
                <h2 style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 13,
                  fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase',
                  color: '#000', marginBottom: 20, paddingBottom: 14,
                  borderBottom: '1px solid #e8e8e8',
                }}>
                  DESCRIPCIÓN
                </h2>
                <div style={{
                  fontFamily: 'Roboto,sans-serif', fontSize: 15,
                  fontWeight: 300, color: 'rgb(90,90,90)', lineHeight: 1.9,
                  wordBreak: 'break-word', overflowWrap: 'break-word',
                }}>
                  {vehicle.description.split('\n\n').map((p, i) => (
                    <p key={i} style={{ marginBottom: 16 }}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════ COLUMNA DERECHA — sticky ═════════════════════ */}
        <div className="vd-right-col" style={{ position: 'sticky', top: 130 }}>

          {/* Nombre + precio */}
          <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e8e8e8' }}>
            {vehicle.status && vehicle.status !== 'available' && (
              <div style={{
                display: 'inline-block', marginBottom: 12,
                fontFamily: 'Montserrat,sans-serif', fontSize: 9,
                fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
                padding: '5px 12px',
                background: vehicle.status === 'sold' ? '#000' : '#f5f0e8',
                color:      vehicle.status === 'sold' ? '#fff' : '#8a6d2f',
              }}>
                {vehicle.status === 'under_offer' ? 'BAJO OFERTA' :
                 vehicle.status === 'reserved'    ? 'RESERVADO'   :
                 vehicle.status === 'sold'        ? 'VENDIDO'     : ''}
              </div>
            )}
            <h1 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 26,
              fontWeight: 300, letterSpacing: '4px', textTransform: 'uppercase',
              color: '#000', lineHeight: 1.2, marginBottom: 6,
            }}>
              {vehicle.brand_name} {vehicle.model}
            </h1>
            {vehicle.variant && (
              <div style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 13,
                fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
                color: '#555', marginBottom: 16,
              }}>
                {vehicle.variant}
              </div>
            )}
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 28,
              fontWeight: 300, letterSpacing: '2px', color: '#000',
            }}>
              {fmtPrice(vehicle.price)}
            </div>
          </div>

          {/* Specs rápidas */}
          <div style={{ marginBottom: 28 }}>
            {[
              ['Año',         vehicle.year],
              ['Color',       vehicle.colour],
              ['Kilómetros',  vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('es-CL')} km` : null],
              ['Combustible', vehicle.fuel_type],
              ['Transmisión', vehicle.transmission],
            ].filter(([,v])=>v).map(([label, val]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                gap: 12, padding: '10px 0', borderBottom: '1px solid #f2f2f2', minWidth: 0,
              }}>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', flexShrink:0 }}>{label}</span>
                <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:15, fontWeight:400, color:'#000', textAlign:'right', wordBreak:'break-word' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* CTA Consultar */}
          <div style={{
            background: '#f9f9f9', border: '1px solid #e8e8e8',
            padding: '28px 24px', marginBottom: 16,
          }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 11,
              fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
              color: '#000', marginBottom: 20,
            }}>
              CONSULTAR ESTE VEHÍCULO
            </div>
            <EnquiryForm vehicleId={id} />
          </div>

          {/* Teléfono */}
          <div style={{
            border: '1px solid #e8e8e8', padding: '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#aaa', marginBottom:4 }}>
                O llámanos
              </div>
              <a href="tel:+56934580647" style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 18,
                fontWeight: 400, letterSpacing: '2px', color: '#000',
                textDecoration: 'none',
              }}>+56 9 3458 0647</a>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.41 2 2 0 013.6 1.23h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006 6l.92-.92a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>

          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/56934580647?text=Hola, me interesa el ${vehicle.brand_name} ${vehicle.model} ${vehicle.year}`}
            target="_blank" rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '14px',
              background: '#25D366', color: '#fff',
              fontFamily: 'Montserrat,sans-serif', fontSize: 10,
              fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            CONSULTAR POR WHATSAPP
          </a>
        </div>

      </div>

      {/* ── Vehículos relacionados ── */}
      {related?.length > 0 && (
        <div style={{ background: '#f9f9f9', padding: '60px 0' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 30px' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <h2 style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 13,
                fontWeight: 600, letterSpacing: '6px', textTransform: 'uppercase',
                color: '#000', marginBottom: 16,
              }}>TAMBIÉN TE PUEDE INTERESAR</h2>
              <div style={{ width:40, height:1, background:'#000', margin:'0 auto' }} />
            </div>
            <div className="related-vehicles-grid" style={{ display:'grid', gap:30 }}>
              {related.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </div>
        </div>
      )}

      </div>{/* end overflow wrapper */}

      <Footer />
    </>
  );
}
