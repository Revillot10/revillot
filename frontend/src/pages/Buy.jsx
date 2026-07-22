import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { leadsApi } from '../services/api';

/* ── Imágenes ─────────────────────────────────────────────── */
const HERO_IMG      = '/images/contactanos.jpg';
const CONTADO_IMG   =  '/images/financiamiento_1.avif';
const CREDITO_IMG   =  '/images/financiamiento_3.webp';
const PARTEPAGO_IMG =  '/images/financiamiento_2.jpg';
const BG_DARK_IMG   = 'https://images.67degreescdn.co.uk/kbF3fxDUR_u_DzyWoD0b6Ji452s=/1600x500/smart/137/6/16957439216512ffb138b3a_dsc03401.jpg';

/* ── Pasos crédito automotriz ─────────────────────────────── */
const CREDITO_STEPS = [
  { n:'01', title:'Elige tu vehículo', desc:'Navega nuestro stock y selecciona el vehículo que más te convenza. Te asesoramos en la elección.' },
  { n:'02', title:'Simulación sin costo', desc:'Calculamos distintos escenarios de financiamiento según tu pie y plazo deseado. Sin compromisos.' },
  { n:'03', title:'Evaluación crediticia', desc:'Gestionamos la evaluación con nuestras instituciones financieras aliadas. Respuesta en 24-48 hrs.' },
  { n:'04', title:'Firma y entrega', desc:'Aprobado el crédito, firmas la documentación y te entregamos tu vehículo listo para rodar.' },
];

/* ── Bancos / instituciones ───────────────────────────────── */
const BANCOS = ['BancoEstado','Santander','BCI','Itaú','Scotiabank','BICE','Security','Coopeuch'];

/* ── Tabla simulación ─────────────────────────────────────── */
function SliderField({ label, value, display, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <label style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#888' }}>
          {label}
        </label>
        <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: '1px', color: '#000' }}>
          {display}
        </span>
      </div>
      <div style={{ position: 'relative', height: 3, background: '#e8e8e8', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: '#000', borderRadius: 2, transition: 'width 0.1s' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', margin: 0, padding: 0,
          }}
        />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: '#000', border: '2px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          pointerEvents: 'none', transition: 'left 0.1s',
        }} />
      </div>
    </div>
  );
}

function SimuladorCredito() {
  const [precio, setPrecio] = useState(15000000);
  const [pie,    setPie]    = useState(20);
  const [plazo,  setPlazo]  = useState(48);
  const [tasa,   setTasa]   = useState(0.99);

  const montoFinanciar = precio * (1 - pie / 100);
  const tasaMensual    = tasa / 100;
  const cuota = tasaMensual > 0
    ? montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1)
    : montoFinanciar / plazo;
  const totalPagar = cuota * plazo;
  const costoTotal = totalPagar - montoFinanciar;

  const fmt  = n => `$${Math.round(n).toLocaleString('es-CL')}`;
  const fmtK = n => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : fmt(n);

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', overflow: 'hidden' }}>

      {/* Header de la tarjeta */}
      <div style={{ padding: '28px 36px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#000', marginBottom: 4 }}>
          Simulador de crédito
        </div>
        <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 12, fontWeight: 300, color: '#aaa', margin: 0 }}>
          Ajusta los valores para estimar tu cuota mensual
        </p>
      </div>

      <div className="simulador-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>

        {/* Columna izquierda — controles */}
        <div className="simulador-col-left" style={{ padding: '32px 36px', borderRight: '1px solid #f0f0f0' }}>
          <SliderField
            label="Precio del vehículo"
            value={precio} min={3000000} max={80000000} step={500000}
            display={fmtK(precio)}
            onChange={setPrecio}
          />
          <SliderField
            label={`Pie — ${pie}%`}
            value={pie} min={20} max={50} step={5}
            display={fmtK(precio * pie / 100)}
            onChange={setPie}
          />
          <SliderField
            label="Plazo"
            value={plazo} min={12} max={72} step={12}
            display={`${plazo} meses`}
            onChange={setPlazo}
          />
          <SliderField
            label="Tasa mensual estimada"
            value={tasa} min={0.5} max={2.5} step={0.1}
            display={`${tasa.toFixed(2)}%`}
            onChange={setTasa}
          />
        </div>

        {/* Columna derecha — resultados */}
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, background: '#fafafa' }}>

          {/* Cuota — protagonista */}
          <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #ececec' }}>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#aaa', marginBottom: 10 }}>
              Cuota mensual estimada
            </div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 38, fontWeight: 300, letterSpacing: '1px', color: '#000', lineHeight: 1 }}>
              {fmt(cuota)}
            </div>
          </div>

          {/* Desglose */}
          {[
            { label: 'Monto a financiar',  value: fmt(montoFinanciar) },
            { label: 'Total a pagar',       value: fmt(totalPagar) },
            { label: 'Costo del crédito',   value: fmt(costoTotal) },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0',
              borderBottom: i < 2 ? '1px solid #ececec' : 'none',
            }}>
              <span style={{ fontFamily: 'Roboto,sans-serif', fontSize: 12, fontWeight: 300, color: '#888' }}>
                {item.label}
              </span>
              <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '0.5px', color: '#000' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '14px 36px', background: '#f7f7f7', borderTop: '1px solid #f0f0f0' }}>
        <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 11, fontWeight: 300, color: '#bbb', margin: 0, textAlign: 'center' }}>
          * Simulación referencial. La cuota final depende de la evaluación crediticia y condiciones de cada institución.
        </p>
      </div>
    </div>
  );
}

/* ── Formulario de contacto genérico ─────────────────────── */
function ContactForm({ tipo }) {
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm({...form, [k]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create({ ...form, lead_type: tipo === 'partepago' ? 'sell' : 'other',
        message: `[${tipo.toUpperCase()}] ${form.message}` });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign:'center', padding:'32px 0' }}>
      <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'#2e7d32', marginBottom:10 }}>✓ CONSULTA ENVIADA</div>
      <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'#666' }}>Te contactaremos dentro de las próximas 24 horas hábiles.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div><label style={labelSt}>Nombre *</label><input className="form-input" required value={form.first_name} onChange={f('first_name')} /></div>
        <div><label style={labelSt}>Apellido *</label><input className="form-input" required value={form.last_name} onChange={f('last_name')} /></div>
        <div><label style={labelSt}>Email *</label><input className="form-input" type="email" required value={form.email} onChange={f('email')} /></div>
        <div><label style={labelSt}>Teléfono</label><input className="form-input" type="tel" value={form.phone} onChange={f('phone')} /></div>
      </div>
      <div style={{ marginTop:0 }}>
        <label style={labelSt}>Mensaje</label>
        <textarea className="form-input" rows={3} style={{ height:'auto' }} value={form.message} onChange={f('message')}
          placeholder={tipo==='contado' ? 'Vehículo de interés, fecha estimada de compra...' : tipo==='credito' ? 'Vehículo de interés, monto estimado, plazo deseado...' : 'Marca, modelo, año y kilometraje de tu vehículo...'}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:8 }}>
        {loading ? 'ENVIANDO...' :
         tipo==='contado'   ? 'SOLICITAR INFORMACIÓN' :
         tipo==='credito'   ? 'SOLICITAR PRE-APROBACIÓN' :
         'SOLICITAR TASACIÓN DE MI VEHÍCULO'}
      </button>
    </form>
  );
}

/* ── Helpers de estilo ─────────────────────────────────────── */
const labelSt   = { display:'block', fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', marginBottom:6 };
const simValueSt = { fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:500, letterSpacing:'1px', color:'#000' };

function SectionHeading({ sup, title, subtitle, light=false }) {
  return (
    <div style={{ textAlign:'center', padding:'70px 25px 44px' }}>
      {sup && <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color: light ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', marginBottom:18 }}>{sup}</div>}
      <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:38, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color: light ? '#fff' : '#000', marginBottom:18, lineHeight:1.1 }}>{title}</h2>
      <div style={{ width:50, height:1, background: light ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)', margin:'0 auto 22px' }} />
      {subtitle && <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color: light ? 'rgba(255,255,255,0.6)' : 'rgb(102,102,102)', lineHeight:1.85, maxWidth:640, margin:'0 auto' }}>{subtitle}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function Buy() {
  useEffect(() => { document.title = 'Compra y Financiamiento — Revillot Garage'; }, []);
  const [activeSection, setActiveSection] = useState('contado');
  const navigate = useNavigate();
  const scrollTo = (id) => {
    setActiveSection(id);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
  };

  return (
    <>
      <Header />

      {/* ══════ HERO ══════════════════════════════════════════ */}
      <div className="hero-standard" style={{ position:'relative', width:'100%', height:560, overflow:'hidden', background:'#050505' }}>
        <img src={HERO_IMG} alt="Compra y Financiamiento Revillot Garage"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)' }} />

        <div className="buy-hero-content" style={{ position:'absolute', top:'50%', left:0, right:0, transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 10%' }}>
          <h1 className="buy-hero-title servicio-hero-h1" style={{ fontFamily:'Montserrat,sans-serif', fontSize:56, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:0, lineHeight:1.05 }}>
            COMPRA<br /><span style={{ fontWeight:500 }}>& FINANCIAMIENTO</span>
          </h1>
          <div style={{ width:70, height:1, background:'rgba(255,255,255,0.5)', margin:'28px 0' }} />
          <p style={{ fontFamily:'Roboto,sans-serif', fontSize:16, fontWeight:300, color:'rgba(255,255,255,0.65)', maxWidth:480, lineHeight:1.9, marginBottom:44 }}>
            Tres formas de hacer tuyo el vehículo que buscas.
            Transparencia, agilidad y el respaldo de un concesionario de confianza.
          </p>

          {/* Botones de navegación rápida */}
          <div className="buy-nav-btns" style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            {[
              { id:'contado',   label:'Pago al Contado' },
              { id:'credito',   label:'Crédito Automotriz' },
              { id:'partepago', label:'Tu Vehículo en Parte de Pago' },
            ].map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{
                  fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500,
                  letterSpacing:'3px', textTransform:'uppercase',
                  background: activeSection===item.id ? '#fff' : 'none',
                  color:      activeSection===item.id ? '#000' : 'rgba(255,255,255,0.75)',
                  border:`1px solid ${activeSection===item.id ? '#fff' : 'rgba(255,255,255,0.35)'}`,
                  padding:'13px 28px', cursor:'pointer', transition:'all 0.25s',
                }}
                onMouseOver={e=>{ if(activeSection!==item.id){ e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'; e.currentTarget.style.color='#fff'; }}}
                onMouseOut={e=>{ if(activeSection!==item.id){ e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; e.currentTarget.style.color='rgba(255,255,255,0.75)'; }}}
              >{item.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ BARRA DE VALOR ════════════════════════════════ */}
      <div style={{ background:'#fff', padding:'0 25px', borderBottom:'1px solid #e8e8e8' }}>
        <div className="value-bar-grid" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            { icon:'🔒', label:'Compra segura',       desc:'Documentación verificada y proceso legal garantizado.' },
            { icon:'⚡', label:'Entrega rápida',       desc:'Tu vehículo listo en el menor tiempo posible.' },
            { icon:'💳', label:'Múltiples formas de pago', desc:'Contado, crédito o parte de pago. Tú decides.' },
            { icon:'🤝', label:'Asesoría personalizada', desc:'Te acompañamos en cada etapa de la compra.' },
          ].map((item, i) => (
            <div key={i} className="value-bar-grid__item" style={{ padding:'32px 28px', borderRight: i<3 ? '1px solid #e8e8e8' : 'none', display:'flex', gap:16, alignItems:'flex-start' }}>
              <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:8 }}>{item.label}</div>
                <div style={{ fontFamily:'Roboto,sans-serif', fontSize:12, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          SECCIÓN 1: PAGO AL CONTADO
      ══════════════════════════════════════════════════════ */}
      <div id="contado" data-reveal style={{ scrollMarginTop:113 }}>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src={BG_DARK_IMG} alt="" style={{ width:'100%', height:420, objectFit:'cover', display:'block', opacity:0.3 }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 25px' }}>
            <SectionHeading sup="Modalidad 01" title="Pago al Contado" light
              subtitle="La forma más rápida y directa de comprar tu vehículo. Sin intereses, sin trámites bancarios, sin esperas." />
          </div>
        </div>

        {/* Imagen + texto */}
        <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 25px 50px', display:'grid', gridTemplateColumns:'55% 1fr', gap:70, alignItems:'center' }}>
          <div style={{ position:'relative', overflow:'hidden', aspectRatio:'16/9', borderRadius:4, boxShadow:'0 12px 40px rgba(0,0,0,0.18)' }}>
            <img src={CONTADO_IMG} alt="Pago al contado"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}
              onMouseOver={e=>e.target.style.transform='scale(1.05)'}
              onMouseOut={e=>e.target.style.transform='scale(1)'}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)', pointerEvents:'none' }} />
            {/* Badge superpuesto */}
            <div style={{ position:'absolute', bottom:24, left:24, background:'#000', padding:'14px 22px' }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:4 }}>ventaja principal</div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:400, letterSpacing:'2px', textTransform:'uppercase', color:'#fff' }}>Sin intereses · Precio final</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:24 }}>¿Por qué elegir pago al contado?</h3>
            <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.9, marginBottom:24 }}>
              Al comprar al contado puedes negociar el mejor precio, evitar el costo financiero y cerrar la operación en el mínimo de tiempo posible. Es la opción más económica y directa.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { t:'Precio final sin recargos',         d:'Lo que ves es lo que pagas. Sin costos de crédito ni seguros obligatorios.' },
                { t:'Proceso simplificado',              d:'Sin evaluación crediticia ni documentación bancaria. Todo más rápido.' },
                { t:'Mayor poder de negociación',        d:'Los compradores al contado tienen ventajas reales en la negociación del precio.' },
                { t:'Entrega en el día',                 d:'Una vez confirmado el pago, coordinamos la entrega inmediata del vehículo.' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', gap:16, padding:'16px 0', borderBottom:'1px solid #f0f0f0' }}>
                  <div style={{ width:6, height:6, background:'#000', flexShrink:0, marginTop:7 }} />
                  <div>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'#000', marginBottom:4 }}>{item.t}</div>
                    <div style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.6 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background:'#f9f9f9', padding:'60px 25px' }}>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>¿Te interesa algún vehículo?</h3>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>Cuéntanos y te asesoramos sin compromiso.</p>
            </div>
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', padding:'36px 40px' }}>
              <ContactForm tipo="contado" />
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          SECCIÓN 2: CRÉDITO AUTOMOTRIZ
      ══════════════════════════════════════════════════════ */}
      <div id="credito" data-reveal style={{ scrollMarginTop:113, background:'#fff' }}>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src={BG_DARK_IMG} alt="" style={{ width:'100%', height:420, objectFit:'cover', display:'block', opacity:0.3 }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 25px' }}>
            <SectionHeading sup="Modalidad 02" title="Crédito Automotriz" light
              subtitle="Accede al vehículo que quieres hoy, con cuotas cómodas adaptadas a tu presupuesto. Trabajamos con las principales instituciones financieras de Chile." />
          </div>
        </div>

        {/* Imagen + texto */}
        <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 25px 50px', display:'grid', gridTemplateColumns:'1fr 55%', gap:70, alignItems:'center' }}>
          <div>
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:24 }}>Financiamiento flexible para cada situación</h3>
            <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.9, marginBottom:28 }}>
              Gestionamos el crédito automotriz por ti. No tienes que ir a múltiples bancos ni perder tiempo en trámites. Presentamos tu solicitud a las instituciones con las que trabajamos y te traemos la mejor opción.
            </p>

            {/* Bancos */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:16 }}>Instituciones aliadas</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {BANCOS.map(b => (
                  <span key={b} style={{ fontFamily:'Roboto,sans-serif', fontSize:12, fontWeight:300, color:'rgb(102,102,102)', background:'#f5f5f5', padding:'6px 14px', border:'1px solid #e0e0e0' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Características */}
            <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { label:'Plazo',         value:'12 a 72 meses' },
                { label:'Pie mínimo',    value:'Desde 20%' },
                { label:'Respuesta',     value:'24 a 48 hrs hábiles' },
                { label:'Seguros',       value:'Opcionales' },
              ].map((item, i) => (
                <div key={i} style={{ background:'#f9f9f9', border:'1px solid #e0e0e0', padding:'16px 20px' }}>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:15, fontWeight:400, letterSpacing:'1px', color:'#000' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:'relative', overflow:'hidden', aspectRatio:'16/9', borderRadius:4, boxShadow:'0 12px 40px rgba(0,0,0,0.18)' }}>
            <img src={CREDITO_IMG} alt="Crédito automotriz"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}
              onMouseOver={e=>e.target.style.transform='scale(1.05)'}
              onMouseOut={e=>e.target.style.transform='scale(1)'}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)', pointerEvents:'none' }} />
          </div>
        </div>

        {/* Pasos del proceso */}
        <div style={{ background:'#f9f9f9', padding:'60px 25px' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'#000', marginBottom:14 }}>El proceso en 4 pasos</h3>
            <div style={{ width:40, height:1, background:'rgba(0,0,0,0.2)', margin:'0 auto' }} />
          </div>
          <div className="steps-grid-4-bordered" style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
            {CREDITO_STEPS.map((s, i) => (
              <div key={i} className="steps-grid-4-bordered__item" style={{ padding:'0 30px', borderRight: i<3 ? '1px solid #e0e0e0' : 'none', textAlign:'center' }}>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:56, fontWeight:200, letterSpacing:'2px', color:'#e8e8e8', lineHeight:1, marginBottom:16 }}>{s.n}</div>
                <h4 style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>{s.title}</h4>
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Simulador */}
        <div style={{ maxWidth:860, margin:'0 auto', padding:'60px 25px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>Calcula tu cuota</h3>
            <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>Ajusta los parámetros y obtén una estimación de tu financiamiento.</p>
          </div>
          <SimuladorCredito />
        </div>

        {/* Formulario pre-aprobación */}
        <div style={{ background:'#f9f9f9', padding:'20px 25px 60px' }}>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>Solicita tu pre-aprobación</h3>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>Sin costo y sin compromiso. Te informamos tu capacidad de crédito.</p>
            </div>
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', padding:'36px 40px' }}>
              <ContactForm tipo="credito" />
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          SECCIÓN 3: PARTE DE PAGO
      ══════════════════════════════════════════════════════ */}
      <div id="partepago" data-reveal style={{ scrollMarginTop:113 }}>

        {/* Fondo oscuro con imagen */}
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img src={BG_DARK_IMG} alt="" style={{ width:'100%', height:420, objectFit:'cover', display:'block', opacity:0.3 }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 25px' }}>
            <SectionHeading sup="Modalidad 03" title="Tu Vehículo en Parte de Pago" light
              subtitle="¿Tienes un vehículo y quieres cambiarlo? Recibimos tu auto, camioneta o SUV como parte del pago de tu próxima compra." />
          </div>
        </div>

        {/* Contenido */}
        <div className="split-feature-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 25px 50px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:70, alignItems:'start' }}>
          <div>
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:24 }}>Cómo funciona la parte de pago</h3>
            <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.9, marginBottom:32 }}>
              Evaluamos tu vehículo actual y lo descontamos del precio del vehículo que quieres comprar. Es la forma más cómoda de renovar tu auto sin necesidad de venderlo previamente.
            </p>

            {/* Proceso */}
            {[
              { n:'1', title:'Tráenos tu vehículo',       desc:'Visítanos en Curicó con tu vehículo o envíanos fotos y datos para hacer una evaluación preliminar.' },
              { n:'2', title:'Tasación gratuita',         desc:'Nuestro equipo evalúa el estado técnico y de mercado de tu vehículo. Te damos una oferta en el acto.' },
              { n:'3', title:'Eliges tu nuevo vehículo',  desc:'Con la tasación en mano, seleccionas el vehículo de nuestro stock que mejor se ajuste a lo que buscas.' },
              { n:'4', title:'Diferencia y cierre',       desc:'Pagas solo la diferencia entre el valor de tu vehículo y el nuevo. Si hay diferencia, podemos financiarla.' },
            ].map((step, i) => (
              <div key={i} style={{ display:'flex', gap:20, marginBottom:24, paddingBottom:24, borderBottom: i<3 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ width:36, height:36, background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:500 }}>{step.n}</div>
                <div>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:6 }}>{step.title}</div>
                  <div style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.7 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {/* Imagen */}
            <div style={{ position:'relative', overflow:'hidden', marginBottom:32, aspectRatio:'16/9', borderRadius:4, boxShadow:'0 12px 40px rgba(0,0,0,0.18)' }}>
              <img src={PARTEPAGO_IMG} alt="Parte de pago"
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.6s ease' }}
                onMouseOver={e=>e.target.style.transform='scale(1.05)'}
                onMouseOut={e=>e.target.style.transform='scale(1)'}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)', pointerEvents:'none' }} />
            </div>

            {/* Caja de ventajas — diseño moderno */}
            <div style={{ border: '1px solid #e8e8e8', overflow: 'hidden' }}>

              {/* Header */}
              <div style={{ background: '#000', padding: '22px 28px' }}>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                  ¿Por qué entregarnos tu vehículo en parte de pago?
                </div>
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 200, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                  Ventajas de la parte de pago
                </div>
              </div>

              {/* Items */}
              {[
                { icon: '✓', title: 'Sin gestión de venta',      desc: 'Evitas publicar, negociar y esperar compradores por tu cuenta.' },
                { icon: '✓', title: 'Todo en un solo lugar',     desc: 'Parte de pago, compra y traspaso se resuelven en nuestra tienda.' },
                { icon: '✓', title: 'Tasación justa',            desc: 'Usamos valores de mercado actuales para darte una oferta real.' },
                { icon: '✓', title: 'Diferencia financiable',    desc: 'Si hay diferencia de precio, podemos financiarla con crédito.' },
                { icon: '✓', title: 'Traspaso gestionado',       desc: 'Nos encargamos de toda la documentación de ambos vehículos.' },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    padding: '16px 28px',
                    borderBottom: i < arr.length - 1 ? '1px solid #f2f2f2' : 'none',
                    background: '#fff',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {/* Check badge */}
                  <div style={{
                    width: 24, height: 24, background: '#000', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                    fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#000', marginBottom: 3 }}>
                      {item.title}
                    </div>
                    <div style={{ fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300, color: 'rgb(120,120,120)', lineHeight: 1.6 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background:'#f9f9f9', padding:'40px 25px 70px' }}>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500, letterSpacing:'4px', textTransform:'uppercase', color:'#000', marginBottom:12 }}>¿Quieres dar tu vehículo en parte de pago?</h3>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)' }}>Cuéntanos sobre tu vehículo y te hacemos una evaluación preliminar.</p>
            </div>
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', padding:'36px 40px' }}>
              <ContactForm tipo="partepago" />
            </div>
          </div>
        </div>
      </div>


      {/* ══════ CTA FINAL ════════════════════════════════════ */}
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
        <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:36, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:16 }}>HABLEMOS HOY</h2>
        <div style={{ width:40, height:1, background:'rgba(255,255,255,0.3)', marginBottom:22 }} />
        <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.65)', maxWidth:480, margin:'0 auto 36px', lineHeight:1.8 }}>
          Nuestro equipo está listo para resolver todas tus consultas sobre formas de pago y financiamiento.
        </p>
        <div style={{ display:'flex', gap:14 }}>
          <button onClick={() => navigate('/contact')}
            style={{ fontFamily:'Montser