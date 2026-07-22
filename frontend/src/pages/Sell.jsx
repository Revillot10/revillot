import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { leadsApi } from '../services/api';

/* ── Imágenes ─────────────────────────────────────────────── */
const HERO_IMG        = '/images/contactanos.jpg';
const CTA_BG_IMG      = HERO_IMG; // usa la misma imagen del hero — cámbiala por cualquier ruta o URL
const COMPRA_IMG      = '/images/img2.png';   
const CONSIGN_IMG     =  '/images/consignacion.jpg'; 



const CONTACTO_IMG      = '/images/contacto.jpg';
const INSPEC_IMG      = '/images/img3.png';
const TASACION_IMG    =  '/images/Ford.jpg';
const PAGO_IMG    = '/images/pago.jpg'; 



const FOTOGRAFIA_IMG =  '/images/FOTOGRAFIA.jpg';
const PUBLICACION_IMG = '/images/PUBLICACION.jpg';
const EXHIBICION_IMG  = '/images/EXHIBICION.jpg';
const INTERESADOS_IMG = '/images/contacto.jpg';
const FINANCIAMIENTO_IMG = '/images/finance.jpg';
const TRASPASO_IMG    = '/images/TRASPASO.png';



/* ── Pasos compra directa ─────────────────────────────────── */
const COMPRA_STEPS = [
  {
    num: '01',
    title: 'Contacto inicial',
    desc: 'Nos envías los datos de tu vehículo: marca, modelo, año, kilometraje y estado general. También puedes traerlo directamente a nuestras instalaciones en Curicó.',
    img: CONTACTO_IMG,
  },
  {
    num: '02',
    title: 'Inspección técnica',
    desc: 'Nuestro equipo realiza una revisión técnica completa del vehículo: motor, transmisión, carrocería, historial de mantenciones y estado general. Sin costo para ti.',
    img: INSPEC_IMG ,
  },
  {
    num: '03',
    title: 'Tasación y oferta',
    desc: 'Con base en la inspección y el análisis del mercado actual, te presentamos una oferta clara, justa y sin letra pequeña. Sin compromisos ni presiones.',
    img: TASACION_IMG ,
  },
  {
    num: '04',
    title: 'Pago inmediato',
    desc: 'Aceptas la oferta y en 24 a 48 horas hábiles gestionamos el pago. Transferencia directa a tu cuenta. Sin intermediarios ni demoras innecesarias.',
    img: PAGO_IMG,
  },
];

/* ── Pasos consignación ───────────────────────────────────── */
const CONSIGN_STEPS = [
  {
    icon: '📸',
    title: 'Recepción y fotografía profesional',
    desc: 'Recibimos tu vehículo y realizamos una sesión fotográfica profesional que lo muestre en su mejor versión. Preparación, limpieza y fotografías de alta calidad para destacar cada detalle.',
    img: FOTOGRAFIA_IMG,
  },
  {
    icon: '🌐',
    title: 'Publicación multicanal',
    desc: 'Tu vehículo aparece en nuestro sitio web, portales automotrices líderes y redes sociales con alto tráfico. Alcanzamos compradores calificados a nivel regional y nacional.',
    img: PUBLICACION_IMG,
  },
  {
    icon: '🏢',
    title: 'Exhibición en showroom',
    desc: 'Tu vehículo se exhibe en nuestras instalaciones junto a nuestra selección de vehículos premium. Miles de potenciales compradores pasan por nuestro showroom cada mes.',
    img: EXHIBICION_IMG,
  },
  {
    icon: '👥',
    title: 'Gestión completa de interesados',
    desc: 'Nos encargamos de todas las consultas, llamadas y visitas. Atendemos a cada interesado con profesionalismo, filtramos compradores serios y coordinamos las pruebas de manejo.',
    img: INTERESADOS_IMG,
  },
  {
    icon: '💳',
    title: 'Financiamiento para compradores',
    desc: 'Facilitamos el acceso a crédito automotriz para los compradores de tu vehículo. Más opciones de pago significa más compradores potenciales y mayor precio de venta.',
    img: FINANCIAMIENTO_IMG,
  },
  {
    icon: '📋',
    title: 'Traspaso y documentación',
    desc: 'Gestionamos todo el proceso legal: revisión técnica, inscripción, traspaso notarial y documentación. Tú solo firmas. Nosotros hacemos el resto.',
    img: TRASPASO_IMG,
  },
];

/* ── Componentes ──────────────────────────────────────────── */
function SectionDivider({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20, padding:'0 25px', maxWidth:1200, margin:'0 auto' }}>
      <div style={{ flex:1, height:1, background:'#e0e0e0' }} />
      <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#999', whiteSpace:'nowrap' }}>{label}</span>
      <div style={{ flex:1, height:1, background:'#e0e0e0' }} />
    </div>
  );
}

function SectionHeading({ sup, title, subtitle }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 25px 40px' }}>
      {sup && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'#999', marginBottom:16 }}>{sup}</div>}
      <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:36, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#000', marginBottom:16 }}>{title}</h2>
      <div style={{ width:50, height:1, background:'rgba(0,0,0,0.2)', margin:'0 auto 24px' }} />
      {subtitle && <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.8, maxWidth:680, margin:'0 auto' }}>{subtitle}</p>}
    </div>
  );
}

/* ── Formulario de contacto ───────────────────────────────── */
function ContactForm({ type }) {
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'', message:'', brand:'', model:'', year:'', mileage:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create({
        first_name: form.first_name,
        last_name:  form.last_name,
        email:      form.email,
        phone:      form.phone,
        lead_type:  'sell',
        message:    `[${type === 'compra' ? 'COMPRA DIRECTA' : 'CONSIGNACIÓN'}] ${form.brand} ${form.model} ${form.year} – ${form.mileage} km\n\n${form.message}`,
      });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign:'center', padding:'40px 0' }}>
      <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'#2e7d32', marginBottom:12 }}>✓ SOLICITUD ENVIADA</div>
      <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>Te contactaremos dentro de las próximas 24 horas hábiles.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Datos del vehículo */}
      <div style={{ marginBottom:24 }}>
        <div style={formGroupTitle}>Datos del vehículo</div>
        <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div><label style={labelSt}>Marca *</label><input className="form-input" required placeholder="Ej: Toyota" value={form.brand} onChange={f('brand')} /></div>
          <div><label style={labelSt}>Modelo *</label><input className="form-input" required placeholder="Ej: Hilux" value={form.model} onChange={f('model')} /></div>
          <div><label style={labelSt}>Año *</label><input className="form-input" required type="number" placeholder="Ej: 2020" value={form.year} onChange={f('year')} /></div>
          <div><label style={labelSt}>Kilometraje *</label><input className="form-input" required type="number" placeholder="Ej: 45000" value={form.mileage} onChange={f('mileage')} /></div>
        </div>
      </div>
      {/* Datos de contacto */}
      <div style={{ marginBottom:24 }}>
        <div style={formGroupTitle}>Tus datos</div>
        <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div><label style={labelSt}>Nombre *</label><input className="form-input" required value={form.first_name} onChange={f('first_name')} /></div>
          <div><label style={labelSt}>Apellido *</label><input className="form-input" required value={form.last_name} onChange={f('last_name')} /></div>
          <div><label style={labelSt}>Email *</label><input className="form-input" type="email" required value={form.email} onChange={f('email')} /></div>
          <div><label style={labelSt}>Teléfono</label><input className="form-input" type="tel" value={form.phone} onChange={f('phone')} /></div>
        </div>
      </div>
      <div>
        <label style={labelSt}>Comentarios adicionales</label>
        <textarea className="form-input" rows={3} style={{ height:'auto' }} placeholder="Estado del vehículo, accesorios, historial..." value={form.message} onChange={f('message')} />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:8 }}>
        {loading ? 'ENVIANDO...' : type === 'compra' ? 'SOLICITAR TASACIÓN GRATUITA' : 'SOLICITAR CONSIGNACIÓN'}
      </button>
    </form>
  );
}

const labelSt = { display:'block', fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', marginBottom:6 };
const formGroupTitle = { fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:14, paddingBottom:10, borderBottom:'1px solid #e0e0e0' };

/* ── Página principal ─────────────────────────────────────── */
export default function Sell() {
  useEffect(() => { document.title = 'Vende tu Vehículo — Revillot Garage'; }, []);
  const [activeTab, setActiveTab] = useState('consign');
  const navigate = useNavigate();
  return (
    <>
      <Header />

      {/* ════ HERO ════════════════════════════════════════════ */}
      <div style={{ position:'relative', width:'100%', height:560, overflow:'hidden', background:'#0a0a0a' }}>
        <img
          src={HERO_IMG}
          alt="Vende tu vehículo con Revillot Garage"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 25px' }}>
          <h1 className="servicio-hero-h1" style={{ fontFamily:'Montserrat,sans-serif', fontSize:56, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:0, lineHeight:1.05 }}>
            VENDE TU<br />VEHÍCULO
          </h1>
          <div style={{ width:60, height:1, background:'rgba(255,255,255,0.5)', marginBottom:24 }} />
          <p style={{ fontFamily:'Roboto,sans-serif', fontSize:16, fontWeight:300, color:'rgba(255,255,255,0.75)', maxWidth:580, lineHeight:1.85 }}>
            Dos formas de vender tu vehículo con total transparencia,
            seguridad y el mejor precio del mercado.
          </p>
          {/* Botones de acción */}
          <div style={{ display:'flex', gap:16, marginTop:40 }}>
            <button
              onClick={() => { setActiveTab('compra'); document.getElementById('opciones')?.scrollIntoView({ behavior:'smooth' }); }}
              style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', background:'#fff', color:'#000', border:'none', padding:'16px 36px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.background='#f0f0f0'}
              onMouseOut={e=>e.currentTarget.style.background='#fff'}
            >COMPRA DIRECTA</button>
            <button
              onClick={() => { setActiveTab('consign'); document.getElementById('opciones')?.scrollIntoView({ behavior:'smooth' }); }}
              style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', background:'none', color:'#fff', border:'1px solid rgba(255,255,255,0.6)', padding:'16px 36px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.borderColor='#fff'}
              onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.6)'}
            >CONSIGNACIÓN</button>
          </div>
        </div>
      </div>

      {/* ════ INTRO — 3 promesas clave ═══════════════════════ */}
      <div style={{ background:'rgb(38,38,38)', padding:'50px 25px' }}>
        <div className="promises-grid" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {[
            { n:'100%', label:'Transparencia', desc:'Sin letra pequeña. Precios justos y condiciones claras desde el primer contacto.' },
            { n:'24h',  label:'Respuesta rápida', desc:'Oferta de compra en 24 horas hábiles. Sabemos que tu tiempo tiene valor.' },
            { n:'0$',   label:'Sin costo para ti', desc:'Inspección técnica, publicación y gestión de ventas completamente gratuitas.' },
          ].map((item, i) => (
            <div key={i} className="promises-grid__item" style={{ textAlign:'center', padding:'30px 40px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:42, fontWeight:200, letterSpacing:'4px', color:'#fff', marginBottom:8 }}>{item.n}</div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:14 }}>{item.label}</div>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════ TABS — COMPRA DIRECTA / CONSIGNACIÓN ═══════════ */}
      <div id="opciones">

        {/* Tab selector */}
        <div style={{ background:'#f9f9f9', borderBottom:'1px solid #e0e0e0' }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex' }}>
            {[
              { id:'consign', label:'CONSIGNACIÓN' },
              { id:'compra',  label:'COMPRA DIRECTA' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex:1, padding:'22px 0',
                  fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500,
                  letterSpacing:'4px', textTransform:'uppercase',
                  background: activeTab===tab.id ? '#fff' : 'transparent',
                  color:      activeTab===tab.id ? '#000' : '#999',
                  border:'none',
                  borderBottom: activeTab===tab.id ? '2px solid #000' : '2px solid transparent',
                  cursor:'pointer', transition:'all 0.2s',
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* ── TAB: COMPRA DIRECTA ────────────────────────── */}
        {activeTab === 'compra' && (
          <div>
            <SectionHeading
              sup="Opción 1"
              title="Compra Directa"
              subtitle="Te compramos tu vehículo de forma inmediata. Sin esperas, sin intermediarios. Tú defines cuándo y nosotros hacemos el resto."
            />

            {/* Imagen + texto intro */}
            <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'0 25px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
              <div style={{
                position:'relative', overflow:'hidden', aspectRatio:'16/9',
                borderRadius:4,
                boxShadow:'0 12px 40px rgba(0,0,0,0.18)',
              }}>
                <img src={COMPRA_IMG} alt="Compra directa" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}
                  onMouseOver={e=>e.target.style.transform='scale(1.05)'}
                  onMouseOut={e=>e.target.style.transform='scale(1)'}
                />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)', pointerEvents:'none' }} />
              </div>
              <div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:20 }}>¿Para quién es esta opción?</h3>
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.85, marginBottom:16 }}>
                  Si buscas vender tu vehículo de forma rápida y sin complicaciones, la compra directa es la opción ideal. En pocos días tienes el dinero en tu cuenta.
                </p>
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.85, marginBottom:32 }}>
                  Esta modalidad es perfecta si necesitas liquidez inmediata, estás cambiando de vehículo, o simplemente quieres evitar el desgaste de publicar y gestionar la venta por tu cuenta.
                </p>
                {[
                  'Sin costo de inspección ni tasación',
                  'Oferta en 24 horas hábiles',
                  'Pago seguro y directo',
                  'Nos encargamos del traspaso',
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ width:6, height:6, background:'#000', flexShrink:0 }} />
                    <span style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceso paso a paso */}
            <div style={{ background:'#f9f9f9', padding:'60px 0' }}>
              <SectionHeading sup="El proceso" title="4 pasos simples" />
              <div className="steps-grid-4" style={{ maxWidth:1300, margin:'0 auto', padding:'0 25px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
                {COMPRA_STEPS.map((step, i) => (
                  <div key={i} style={{ borderRight: i < 3 ? '1px solid #e0e0e0' : 'none', padding:'0 30px' }}>
                    {/* Imagen */}
                    <div style={{ aspectRatio:'16/9', overflow:'hidden', background:'rgb(38,38,38)', marginBottom:24, borderRadius:3, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', position:'relative' }}>
                      <img src={step.img} alt={step.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s' }}
                        onMouseOver={e=>e.target.style.transform='scale(1.05)'}
                        onMouseOut={e=>e.target.style.transform='scale(1)'}
                        loading="lazy"
                      />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)', pointerEvents:'none' }} />
                    </div>
                    {/* Número */}
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:40, fontWeight:200, letterSpacing:'2px', color:'#e0e0e0', lineHeight:1, marginBottom:12 }}>{step.num}</div>
                    {/* Título */}
                    <h4 style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>{step.title}</h4>
                    {/* Descripción */}
                    <p style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.75 }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div style={{ maxWidth:780, margin:'0 auto', padding:'60px 25px 80px' }}>
              <SectionHeading sup="¿Listo para vender?" title="Solicita tu tasación" subtitle="Completa el formulario y te contactamos dentro de las próximas 24 horas hábiles con una oferta concreta." />
              <div style={{ background:'#fff', border:'1px solid #e0e0e0', padding:'40px 48px' }}>
                <ContactForm type="compra" />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CONSIGNACIÓN ─────────────────────────── */}
        {activeTab === 'consign' && (
          <div>
            <SectionHeading
              sup="Opción 2"
              title="Consignación"
              subtitle="Ponemos tu vehículo en venta con todo el respaldo de Revillot Garage. Tú sigues usando tu auto mientras nosotros lo vendemos al mejor precio."
            />

            {/* Imagen + texto intro */}
            <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'0 25px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
              <div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:20 }}>¿Por qué elegir la consignación?</h3>
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.85, marginBottom:16 }}>
                  La consignación te permite obtener el mejor precio de mercado para tu vehículo, con toda la infraestructura de un concesionario profesional trabajando para ti.
                </p>
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.85, marginBottom:32 }}>
                  Nosotros gestionamos todo: fotografía profesional, publicación, atención de interesados, financiamiento para compradores y todo el proceso legal del traspaso.
                </p>
                {[
                  'Precio de venta superior al mercado informal',
                  'Fotografía y presentación profesional',
                  'Gestión completa sin que debas involucrarte',
                  'Financiamiento disponible para compradores',
                  'Traspaso y documentación gestionados por nosotros',
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ width:6, height:6, background:'#000', flexShrink:0 }} />
                    <span style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{
                position:'relative', overflow:'hidden', aspectRatio:'16/9',
                borderRadius:4,
                boxShadow:'0 12px 40px rgba(0,0,0,0.18)',
              }}>
                <img src={CONSIGN_IMG} alt="Consignación" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}
                  onMouseOver={e=>e.target.style.transform='scale(1.05)'}
                  onMouseOut={e=>e.target.style.transform='scale(1)'}
                />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)', pointerEvents:'none' }} />
              </div>
            </div>

            {/* Proceso de consignación — 6 tarjetas */}
            <div style={{ background:'#f9f9f9', padding:'60px 0' }}>
              <SectionHeading sup="El proceso" title="Cómo funciona" subtitle="Desde que nos entregas tu vehículo hasta que recibes el pago, nos encargamos de cada detalle." />
              <div className="steps-grid-3" style={{ maxWidth:1300, margin:'0 auto', padding:'0 25px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:30 }}>
                {CONSIGN_STEPS.map((step, i) => (
                  <div key={i} style={{ background:'#fff', border:'1px solid #e0e0e0', overflow:'hidden', transition:'box-shadow 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.08)'}
                    onMouseOut={e=>e.currentTarget.style.boxShadow='none'}
                  >
                    {/* Imagen */}
                    <div style={{ aspectRatio:'16/9', overflow:'hidden', background:'rgb(38,38,38)', position:'relative' }}>
                      <img src={step.img} alt={step.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s' }}
                        onMouseOver={e=>e.target.style.transform='scale(1.05)'}
                        onMouseOut={e=>e.target.style.transform='scale(1)'}
                        loading="lazy"
                      />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)', pointerEvents:'none' }} />
                    </div>
                    {/* Contenido */}
                    <div style={{ padding:'28px 28px 32px' }}>
                      <div style={{ fontSize:24, marginBottom:12 }}>{step.icon}</div>
                      <h4 style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>{step.title}</h4>
                      <p style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.75 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparativa */}
            <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 25px 20px' }}>
              <SectionHeading sup="¿Cuál elegir?" title="Compara las opciones" />
            <div className="compare-grid-3-wrap">
              <div className="compare-grid-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', border:'1px solid #e0e0e0', overflow:'hidden' }}>
                {/* Header */}
                <div style={{ background:'#f9f9f9', padding:'16px 20px', borderRight:'1px solid #e0e0e0', borderBottom:'1px solid #e0e0e0' }} />
                {['COMPRA\nDIRECTA','CONSIG-\nNACIÓN'].map((h,i) => (
                  <div key={i} style={{ background:'#000', padding:'16px 20px', textAlign:'center', borderRight: i===0 ? '1px solid #333' : 'none', borderBottom:'1px solid #e0e0e0' }}>
                    <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', whiteSpace:'pre-line' }}>{h}</span>
                  </div>
                ))}
                {/* Filas */}
                {[
                  ['Velocidad de venta',     '24-48 hrs','2-6 semanas'],
                  ['Precio obtenido',         'Mercado',  'Máximo'],
                  ['Gestión requerida',       'Ninguna',  'Ninguna'],
                  ['Fotografía profesional',  '—',        '✓'],
                  ['Publicación en portales', '—',        '✓'],
                  ['Financiamiento comprador','—',        '✓'],
                  ['Traspaso incluido',       '✓',        '✓'],
                ].map(([label, a, b], i) => (
                  <>
                    <div key={`l${i}`} style={{ padding:'14px 20px', borderRight:'1px solid #e0e0e0', borderBottom:'1px solid #e0e0e0', background: i%2===0 ? '#fff' : '#fafafa' }}>
                      <span style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', color:'#000' }}>{label}</span>
                    </div>
                    {[a, b].map((val, j) => (
                      <div key={`v${i}${j}`} style={{ padding:'14px 20px', textAlign:'center', borderRight: j===0 ? '1px solid #e0e0e0' : 'none', borderBottom:'1px solid #e0e0e0', background: i%2===0 ? '#fff' : '#fafafa' }}>
                        <span style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)' }}>{val}</span>
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
            </div>

            {/* Formulario */}
            <div style={{ maxWidth:780, margin:'0 auto', padding:'40px 25px 80px' }}>
              <SectionHeading sup="¿Listo para consignar?" title="Comienza el proceso" subtitle="Cuéntanos sobre tu vehículo y te contactamos para coordinar la recepción y evaluación sin costo." />
              <div style={{ background:'#fff', border:'1px solid #e0e0e0', padding:'40px 48px' }}>
                <ContactForm type="consign" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ CTA FINAL ════════════════════════════════════════ */}
      <div style={{
        height: 360,
        background: 'rgb(38,38,38)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 25px',
      }}>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:18 }}>¿TIENES DUDAS?</div>
        <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:36, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:16 }}>HABLEMOS</h2>
        <div style={{ width:40, height:1, background:'rgba(255,255,255,0.35)', marginBottom:22 }} />
        <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.7)', maxWidth:480, margin:'0 auto 36px', lineHeight:1.8 }}>
          Nuestro equipo está disponible para resolver todas tus dudas sobre el proceso de venta.
        </p>
        <button onClick={() => navigate('/contact')}
          style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', background:'#fff', color:'#000', border:'none', padding:'16px 40px', cursor:'pointer', transition:'background 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.background='#f0f0f0'}
          onMouseOut={e=>e.currentTarget.style.background='#fff'}
        >CONTÁCTANOS</button>
      </div>
      <Footer />
    </>
  );
}
