import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HERO_IMG = '/images/hero3.png';

const REASONS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Transparencia total',
    desc: 'Sin letra pequeña ni sorpresas. Cada vehículo se presenta con su historial, estado real y precio claro desde el primer contacto.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
      </svg>
    ),
    title: 'Atención personalizada',
    desc: 'No somos una cadena. Somos un equipo familiar que te conoce por tu nombre y te acompaña en todo el proceso, sin presiones.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    title: 'Vehículos seleccionados',
    desc: 'Cada auto pasa por una revisión técnica antes de entrar a nuestro stock. Solo ofrecemos lo que nosotros mismos compraríamos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Financiamiento flexible',
    desc: 'Trabajamos con las principales instituciones financieras de Chile. Te conseguimos la mejor opción sin que tengas que ir banco por banco.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Respuesta en 24 horas',
    desc: 'Enviamos ofertas de compra y respondemos consultas dentro de las próximas 24 horas hábiles. Tu tiempo tiene valor.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
    title: 'Traspaso garantizado',
    desc: 'Gestionamos toda la documentación legal: revisión técnica, inscripción y traspaso notarial. Tú solo firmas.',
  },
];

const STATS = [
  { n: '100%',  label: 'Transparencia',      desc: 'en cada operación' },
  { n: '24h',   label: 'Respuesta',           desc: 'en ofertas de compra' },
  { n: '$0',    label: 'Costo de gestión',    desc: 'inspección y traspaso incluidos' },
  { n: '1°',    label: 'Confianza',           desc: 'concesionario independiente del Maule' },
];

const CUSTOMER_QUOTES = [
  { text: 'La experiencia de compra fue inmejorable. Transparencia total desde el principio hasta el final.', author: 'Carlos M., Curicó' },
  { text: 'Revillot Garage encontró exactamente el vehículo que buscaba. Profesionalismo y atención de primer nivel.', author: 'Andrea P., Talca' },
  { text: 'Vendí mi camioneta con ellos y el proceso fue rápido, justo y sin complicaciones.', author: 'Roberto S., Rancagua' },
  { text: 'La mejor experiencia de compra de vehículo que he tenido. Sin presiones, mucha información.', author: 'Valentina L., Santiago' },
];

export default function WhyChooseUs() {
  const navigate = useNavigate();
  useEffect(() => { document.title = '¿Por qué elegirnos? — Revillot Garage'; }, []);

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div style={{ position:'relative', width:'100%', height:500, overflow:'hidden', background:'#111' }}>
        <img src={HERO_IMG} alt="Por qué escogernos"
          style={{ width:'100%', height:'100%', objectFit:'cover', opacity:1, display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 25px' }}>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'6px', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:18 }}>
            REVILLOT GARAGE
          </div>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontSize:42, fontWeight:200, letterSpacing:'10px', textTransform:'uppercase', color:'#fff', marginBottom:20, lineHeight:1.1, textShadow:'0 2px 24px rgba(0,0,0,0.4)' }}>
            ¿POR QUÉ ELEGIRNOS?
          </h1>
          <div style={{ width:50, height:1, background:'rgba(255,255,255,0.5)' }} />
        </div>
      </div>

      {/* ── INTRO ── */}
      <div style={{ maxWidth:760, margin:'0 auto', padding:'70px 25px 60px', textAlign:'center' }} data-reveal>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'#aaa', marginBottom:20 }}>
          NUESTRA DIFERENCIA
        </div>
        <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:34, fontWeight:200, letterSpacing:'6px', textTransform:'uppercase', color:'#000', marginBottom:24, lineHeight:1.2 }}>
          UN CONCESIONARIO DISTINTO
        </h2>
        <div style={{ width:40, height:1, background:'#000', margin:'0 auto 32px' }} />
        <p style={{ fontFamily:'Roboto,sans-serif', fontSize:16, fontWeight:300, color:'rgb(60,60,60)', lineHeight:1.9 }}>
          Somos una empresa familiar independiente especializada en vehículos premium y semi-premium
          en Curicó. No somos una cadena ni un sitio web — somos personas reales que construyen
          relaciones de confianza y acompañan a cada cliente en todo el proceso.
        </p>
      </div>

      {/* ── STATS ── */}
      <div style={{ background:'#000', padding:'0 25px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding:'44px 32px', textAlign:'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:48, fontWeight:200, letterSpacing:'3px', color:'#fff', lineHeight:1, marginBottom:10 }}>
                {s.n}
              </div>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:600, letterSpacing:'4px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:8 }}>
                {s.label}
              </div>
              <div style={{ fontFamily:'Roboto,sans-serif', fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.3)', letterSpacing:'0.5px' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RAZONES: grid 3×2 ── */}
      <div style={{ background:'#fff', padding:'80px 25px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }} data-reveal>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'#aaa', marginBottom:16 }}>
              LO QUE NOS DISTINGUE
            </div>
            <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:32, fontWeight:200, letterSpacing:'7px', textTransform:'uppercase', color:'#000', marginBottom:18 }}>
              6 RAZONES
            </h2>
            <div style={{ width:40, height:1, background:'#000', margin:'0 auto' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'#e8e8e8' }}>
            {REASONS.map((r, i) => (
              <div key={i} style={{
                background:'#fff', padding:'44px 40px',
                transition:'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background='#fff'}
              >
                {/* Ícono */}
                <div style={{ color:'#000', marginBottom:24, opacity:0.85 }}>
                  {r.icon}
                </div>
                {/* Número */}
                <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#ccc', marginBottom:10 }}>
                  0{i + 1}
                </div>
                {/* Título */}
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:14 }}>
                  {r.title}
                </h3>
                {/* Descripción */}
                <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(90,90,90)', lineHeight:1.8 }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIOS ── */}
      <div style={{ background:'#f9f9f9', padding:'80px 25px' }}>
        <div style={{ textAlign:'center', marginBottom:52 }} data-reveal>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'#aaa', marginBottom:16 }}>
            CLIENTES
          </div>
          <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:32, fontWeight:200, letterSpacing:'7px', textTransform:'uppercase', color:'#000', marginBottom:18 }}>
            LO QUE DICEN
          </h2>
          <div style={{ width:40, height:1, background:'#000', margin:'0 auto' }} />
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:24 }}>
          {CUSTOMER_QUOTES.map((q, i) => (
            <div key={i} style={{
              background:'#fff', border:'1px solid #e8e8e8',
              padding:'40px 40px 32px',
              display:'flex', flexDirection:'column',
              boxShadow:'0 2px 16px rgba(0,0,0,0.04)',
              transition:'box-shadow 0.25s ease, transform 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.10)'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              {/* Comilla decorativa */}
              <div style={{ fontFamily:'Georgia,serif', fontSize:72, fontWeight:700, color:'#e8e8e8', lineHeight:0.8, marginBottom:20, userSelect:'none' }}>
                "
              </div>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:16, fontWeight:300, color:'rgb(60,60,60)', lineHeight:1.85, fontStyle:'italic', flex:1, marginBottom:28 }}>
                {q.text}
              </p>
              <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:20, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Montserrat,sans-serif', fontSize:13, fontWeight:600, flexShrink:0 }}>
                  {q.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'#000', marginBottom:2 }}>
                    {q.author.split(',')[0]}
                  </div>
                  <div style={{ fontFamily:'Roboto,sans-serif', fontSize:12, fontWeight:300, color:'#aaa' }}>
                    {q.author.split(',')[1]?.trim()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div style={{
        height: 320,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url(${HERO_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 25px',
      }}>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500, letterSpacing:'5px', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:18 }}>
          ¿LISTO PARA COMENZAR?
        </div>
        <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:32, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:24 }}>
          HABLEMOS
        </h2>
        <div style={{ display:'flex', gap:14 }}>
          <button onClick={() => navigate('/inventory')}
            style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', background:'#fff', color:'#000', border:'none', padding:'14px 32px', cursor:'pointer', transition:'background 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.background='#f0f0f0'}
            onMouseOut={e=>e.currentTarget.style.background='#fff'}
          >VER STOCK</button>
          <button onClick={() => navigate('/contact')}
            style={{ fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', background:'none', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.45)', padding:'14px 32px', cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>{ e.currentTarget.style.borderColor='#fff'; e.currentTarget.style.color='#fff'; }}
            onMouseOut={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.45)'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}
          >CONTÁCTANOS</button>
        </div>
      </div>

      <Footer />
    </>
  );
}
