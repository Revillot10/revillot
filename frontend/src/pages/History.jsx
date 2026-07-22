import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HERO_IMG = '/images/supra.jpg';

// Hitos de la historia — adaptados a Revillot Garage
const TIMELINE = [
  {
    year: '2010',
    title: 'LOS PRIMEROS PASOS',
    text: 'Carlos Revillot comienza su carrera en el sector automotriz trabajando como vendedor en diferentes concesionarias de la Región del Maule, acumulando experiencia y conocimiento del mercado local.',
    img: 'https://images.67degreescdn.co.uk/zgfgPnbqvLvfGvZwUfDNqGWX_PQ=/350x440/smart/137/6/1695809872651401506d665_job3178w1241-14-.jpg',
  },
  {
    year: '2018',
    title: 'ESPECIALIZACIÓN EN PREMIUM',
    text: 'Tras años en el sector, Carlos identifica una oportunidad única en el mercado de vehículos premium y semi-premium en la zona central de Chile, donde la oferta de calidad era escasa.',
    img: 'https://images.67degreescdn.co.uk/O3cdsfCJYgkH5voEWwa-Mhbz5ik=/350x440/smart/137/6/16957264636512bb7f24df5_918-night-shoot-edited-51-13-.jpg',
  },
  {
    year: '2026',
    title: 'NACE REVILLOT GARAGE',
    text: 'Se funda oficialmente Revillot Garage en Curicó con la misión de ofrecer una selección cuidada de camionetas, hatchbacks y SUV premium, bajo los más altos estándares de preparación y atención.',
    img: 'https://images.67degreescdn.co.uk/IkR2_rlKGAJGpidCcxfU0xIfmmE=/350x440/smart/137/6/16957272856512beb586290_gfw-0946-2.jpg',
  },
  {
    year: '2026',
    title: 'CRECIMIENTO Y RECONOCIMIENTO',
    text: 'En su primer año de operación, Revillot Garage consolida su reputación como concesionario de confianza en la Región del Maule, siendo reconocido por su transparencia y servicio personalizado.',
    img: 'https://images.67degreescdn.co.uk/nVB0mE0kRCDJt1JaG0s6oH5ZVzY=/350x440/smart/137/6/16957277716512bfc3b2d0f_gfw-1043-2.jpg',
  },
];

export default function History() {
  useEffect(() => { document.title = 'Nuestra Historia — Revillot Garage'; }, []);
  return (
    <>
      <Header />

      {/* Hero con imagen oscura y título centrado */}
      <div style={{ position:'relative', width:'100%', height:480, overflow:'hidden', background:'#111' }}>
        <img src={HERO_IMG} alt="Historia de Revillot Garage" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 25px' }}>
          <h1 className="servicio-hero-h1" style={{ fontFamily:'Montserrat,sans-serif', fontSize:56, fontWeight:200, letterSpacing:'8px', textTransform:'uppercase', color:'#fff', marginBottom:16, lineHeight:1.05 }}>
            NUESTRA HISTORIA
          </h1>
          <div style={{ width:60, height:1, background:'rgba(255,255,255,0.6)', marginBottom:24 }} />
          <p style={{ fontFamily:'Roboto,sans-serif', fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.75)', maxWidth:700, lineHeight:1.8 }}>
            Revillot Garage nació de la pasión por los vehículos y del compromiso de ofrecer
            una experiencia de compra y venta diferente en Chile.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'60px 25px 80px' }}>

        {/* Años en el header de la timeline */}
        <div className="history-timeline-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${TIMELINE.length}, 1fr)`, gap:0, marginBottom:0, borderBottom:'1px solid #e0e0e0' }}>
          {TIMELINE.map((item, i) => (
            <div key={i} className="history-timeline-grid__item" style={{ padding:'20px 0', borderRight: i < TIMELINE.length-1 ? '1px solid #e0e0e0' : 'none', paddingLeft: i===0 ? 0 : 20 }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:32, fontWeight:200, letterSpacing:'4px', color:'#000', marginBottom:6 }}>{item.year}</div>
              <div style={{ width:40, height:2, background:'#000' }} />
            </div>
          ))}
        </div>

        {/* Imágenes */}
        <div className="history-timeline-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${TIMELINE.length}, 1fr)`, gap:0 }}>
          {TIMELINE.map((item, i) => (
            <div key={i} className="history-timeline-grid__item" style={{ borderRight: i < TIMELINE.length-1 ? '1px solid #e0e0e0' : 'none' }}>
              <div style={{ height:300, overflow:'hidden', background:'#111' }}>
                <img src={item.img} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s' }} loading="lazy"
                  onMouseOver={e=>e.target.style.transform='scale(1.04)'}
                  onMouseOut={e=>e.target.style.transform='scale(1)'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Textos */}
        <div className="history-timeline-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${TIMELINE.length}, 1fr)`, gap:0 }}>
          {TIMELINE.map((item, i) => (
            <div key={i} className="history-timeline-grid__item" style={{ padding:'24px 20px 40px', paddingLeft: i===0 ? 0 : 20, borderRight: i < TIMELINE.length-1 ? '1px solid #e0e0e0' : 'none' }}>
              <h3 style={{ fontFamily:'Montserrat,sans-serif', fontSize:11, fontWeight:600, letterSpacing:'3px', textTransform:'uppercase', color:'#000', marginBottom:14 }}>
                {item.title}
              </h3>
              <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgb(102,102,102)', lineHeight:1.8 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
}
