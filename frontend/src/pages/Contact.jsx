import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { leadsApi } from '../services/api';

const HORARIO = [
  ['Lunes',     '09:00 – 18:00'],
  ['Martes',    '09:00 – 18:00'],
  ['Miércoles', '09:00 – 18:00'],
  ['Jueves',    '09:00 – 18:00'],
  ['Viernes',   '09:00 – 18:00'],
  ['Sábado',    '09:00 – 14:00'],
  ['Domingo',   'Con cita previa'],
];

const SHOWROOMS = [
  { n: '01', label: 'Showroom 1', addr: 'Av. Circunvalación Paul Harris 01041' },
  { n: '02', label: 'Showroom 2', addr: 'Benjamín Subercaseaux, Pje Juan Mochi 2364' },
  { n: '03', label: 'Showroom 3', addr: 'Ruta J-615, Cumbres de Zapallar, Km 10,6' },
];

const sectionTitle = (text) => (
  <div style={{ marginBottom: 28 }}>
    <h2 style={{
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 22, fontWeight: 300,
      letterSpacing: '8px', textTransform: 'uppercase',
      color: '#000', marginBottom: 12,
    }}>{text}</h2>
    <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)' }} />
  </div>
);


function LeafletMap() {
  const mapRef = React.useRef(null);
  const instanceRef = React.useRef(null);

  React.useEffect(() => {
    if (instanceRef.current) return;

    // Cargar Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Cargar Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([-34.988, -71.185], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map);

      const SHOWROOMS = [
        { lat: -34.97141762270467, lng: -71.2220514014561,  label: 'Showroom 1', addr: 'Av. Circunvalación Paul Harris 01041, Curicó' },
        { lat: -34.96904522552187, lng: -71.2097829774281,  label: 'Showroom 2', addr: 'Benjamín Subercaseaux, Pje Juan Mochi 2364' },
        { lat: -35.03697736957896, lng: -71.13148124922112, label: 'Showroom 3', addr: 'Ruta J-615, Cumbres de Zapallar, Km 10,6' },
      ];

      const svgIcon = (n) => L.divIcon({
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
        html: `<div style="width:36px;height:36px;background:#111;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.35);">
          <span style="transform:rotate(45deg);color:#fff;font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;">${n}</span>
        </div>`,
      });

      SHOWROOMS.forEach(({ lat, lng, label, addr }, i) => {
        L.marker([lat, lng], { icon: svgIcon(i + 1) })
          .addTo(map)
          .bindPopup(`<div style="font-family:Montserrat,sans-serif;min-width:180px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">${label}</div>
            <div style="font-family:Roboto,sans-serif;font-size:13px;font-weight:300;color:#555;line-height:1.5;">${addr}</div>
          </div>`, { maxWidth: 240 });
      });

      instanceRef.current = map;
    };
    document.head.appendChild(script);

    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, []);

  return <div ref={mapRef} style={{ width:'100%', height:460, borderRadius:2 }} />;
}

export default function Contact() {
  useEffect(() => { document.title = 'Contacto — Revillot Garage'; }, []);
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create({ ...form, lead_type: 'other' });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div style={{ position:'relative', width:'100%', height:320, overflow:'hidden', background:'rgb(38,38,38)' }}>
        <img
          src="/images/contactanos.jpg"  
          alt="Revillot Garage"
          style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.40, display:'block' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.60) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
          <h1 style={{ fontFamily:'Montserrat, sans-serif', fontSize:36, fontWeight:200, letterSpacing:'10px', textTransform:'uppercase', color:'#fff', marginBottom:14, textShadow:'0 2px 20px rgba(0,0,0,0.4)' }}>CONTÁCTANOS</h1>
          <div style={{ width:50, height:1, background:'rgba(255,255,255,0.6)' }} />
        </div>
      </div>

      {/* ── FORMULARIO ── */}
      <div style={{ background:'#fff', padding:'0 25px 48px' }}>
        <div data-reveal style={{
          maxWidth:780, margin:'0 auto', background:'#fff',
          border:'1px solid #e0e0e0', padding:'48px 60px',
          marginTop:-60, position:'relative', zIndex:2,
        }}>
          {sectionTitle('PONTE EN CONTACTO')}
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0', fontFamily:'Montserrat, sans-serif', fontSize:11, letterSpacing:'3px', textTransform:'uppercase', color:'#2e7d32' }}>
              ✓ MENSAJE ENVIADO
              <div style={{ fontSize:9, color:'#666', marginTop:10, letterSpacing:'2px' }}>Te responderemos a la brevedad</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div><label style={labelStyle}>Nombre *</label><input className="form-input" required value={form.first_name} onChange={f('first_name')} /></div>
                <div><label style={labelStyle}>Apellido *</label><input className="form-input" required value={form.last_name} onChange={f('last_name')} /></div>
              </div>
              <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div><label style={labelStyle}>Email *</label><input className="form-input" type="email" required value={form.email} onChange={f('email')} /></div>
                <div><label style={labelStyle}>Teléfono</label><input className="form-input" type="tel" value={form.phone} onChange={f('phone')} /></div>
              </div>
              <div>
                <label style={labelStyle}>Mensaje</label>
                <textarea className="form-input" rows={5} value={form.message} onChange={f('message')} style={{ height:'auto' }} />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:8 }}>
                {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── DIRECCIÓN + HORARIO ── */}
      <div style={{ background:'#fff', padding:'40px 25px 50px' }}>
        <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60 }} data-reveal>

          {/* ── DIRECCIÓN ── */}
          <div>
            {sectionTitle('DIRECCIÓN')}

            {/* Nombre empresa */}
            <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:14, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:18 }}>
              Revillot Garage — Curicó
            </div>

            {/* Showrooms */}
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {SHOWROOMS.map(({ n, label, addr }) => (
                <div key={n} style={{ display:'flex', gap:18, padding:'10px 0', borderBottom:'1px solid #f0f0f0', alignItems:'flex-start' }}>
                  <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:10, fontWeight:700, letterSpacing:'1px', color:'#ccc', paddingTop:3, flexShrink:0, minWidth:20 }}>{n}</div>
                  <div>
                    <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:'#000', marginBottom:5 }}>{label}</div>
                    <div style={{ fontFamily:'Roboto, sans-serif', fontSize:14, fontWeight:300, color:'rgb(80,80,80)', lineHeight:1.6 }}>{addr}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contacto directo */}
            <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:10 }}>
              <a href="tel:+56934580647" style={{ display:'flex', alignItems:'center', gap:14, textDecoration:'none', transition:'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.65'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:9, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:'#aaa', marginBottom:2 }}>Teléfono</div>
                  <div style={{ fontFamily:'Roboto, sans-serif', fontSize:15, fontWeight:400, color:'#000' }}>+56 9 3458 0647</div>
                </div>
              </a>

              <a href="mailto:turzuarevillot@gmail.com" style={{ display:'flex', alignItems:'center', gap:14, textDecoration:'none', transition:'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.65'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#f5f5f5', border:'1px solid #e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:9, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:'#aaa', marginBottom:2 }}>Email</div>
                  <div style={{ fontFamily:'Roboto, sans-serif', fontSize:15, fontWeight:400, color:'#000' }}>turzuarevillot@gmail.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── HORARIO ── */}
          <div>
            {sectionTitle('HORARIO DE ATENCIÓN')}
            <div style={{ fontFamily:'Montserrat, sans-serif', fontSize:14, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:18 }}>
              Lunes a Domingo
            </div>
            <div>
              {HORARIO.map(([dia, hora]) => {
                const isToday = new Date().toLocaleDateString('es-CL', { weekday:'long' })
                  .toLowerCase().startsWith(dia.toLowerCase().slice(0,3));
                return (
                  <div key={dia} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'9px 0',
                    borderBottom:'1px solid #f0f0f0',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {isToday && <div style={{ width:5, height:5, borderRadius:'50%', background:'#000', flexShrink:0 }} />}
                      <span style={{
                        fontFamily:'Roboto, sans-serif', fontSize:14,
                        fontWeight: isToday ? 500 : 300,
                        color: isToday ? '#000' : 'rgb(100,100,100)',
                        letterSpacing:'0.3px',
                        marginLeft: isToday ? 0 : 15,
                      }}>{dia}</span>
                    </div>
                    <span style={{
                      fontFamily:'Montserrat, sans-serif', fontSize:12,
                      fontWeight: isToday ? 600 : 400,
                      letterSpacing:'1px',
                      color: isToday ? '#000' : 'rgb(130,130,130)',
                    }}>{hora}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── REDES SOCIALES ── */}
      <div style={{ background:'rgb(38,38,38)', padding:'44px 25px' }}>
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
          <div data-reveal style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Montserrat, sans-serif', fontSize:22, fontWeight:300, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:12 }}>SÍGUENOS</h2>
            <div style={{ width:40, height:1, background:'rgba(255,255,255,0.35)', margin:'0 auto' }} />
          </div>
          <p style={{ fontFamily:'Roboto, sans-serif', fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.6)', marginBottom:32, lineHeight:1.7 }}>
            Mantente al día con nuestro stock, novedades y contenido exclusivo.
          </p>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:40, flexWrap:'nowrap' }}>
            {[
              { href:'https://www.instagram.com/revillotgarage/', accent:'#E1306C', label:'Instagram', icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
              { href:'https://www.facebook.com/', accent:'#1877F2', label:'Facebook', icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { href:'https://wa.me/56934580647', accent:'#25D366', label:'WhatsApp', icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              { href:'https://www.youtube.com/', accent:'#FF0000', label:'YouTube', icon:<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
            ].map(({ href, accent, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, textDecoration:'none', cursor:'pointer' }}
                onMouseEnter={e => { const c=e.currentTarget.querySelector('.soc-circle'); const l=e.currentTarget.querySelector('.soc-label'); if(c){c.style.background=accent;c.style.transform='translateY(-4px)';}if(l){l.style.color='#fff';} }}
                onMouseLeave={e => { const c=e.currentTarget.querySelector('.soc-circle'); const l=e.currentTarget.querySelector('.soc-label'); if(c){c.style.background='rgba(255,255,255,0.08)';c.style.transform='translateY(0)';}if(l){l.style.color='rgba(255,255,255,0.5)';} }}
              >
                <div className="soc-circle" style={{ width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'background 0.25s ease, transform 0.25s ease' }}>{icon}</div>
                <span className="soc-label" style={{ fontFamily:'Montserrat, sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', transition:'color 0.25s ease' }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAPA LEAFLET ── */}
      <div style={{ background:'#fff', padding:'44px 25px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ padding:'0 0 28px' }}>{sectionTitle('ENCUÉNTRANOS')}</div>
          <LeafletMap />
        </div>
      </div>

      <Footer />
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 9, fontWeight: 500,
  letterSpacing: '2px', textTransform: 'uppercase',
  color: '#999', marginBottom: 6,
};
