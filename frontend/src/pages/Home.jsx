import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VehicleCard from '../components/ui/VehicleCard';
import { vehiclesApi } from '../services/api';

// ── Imágenes exactas extraídas del DOM del sitio real ──────────
// Hero: imagen desktop 3840px (la que usa el sitio en pantallas grandes)


   
const HERO_IMG = '/images/contactanos.jpg';

// Insight (greyscale image del lado izquierdo)
const INSIGHT_IMG = 'https://images.67degreescdn.co.uk/ydyiHXDqolkGpRvaLuxGAtQRNxg=/137/6/1695044275650852b31703e_insights-greyscale.png';

// ── Bloques-1 (Quick Links) — imágenes exactas del sitio real ──
const QUICK_LINKS = [
  {
    title: 'STOCK ACTUAL',
    href: '/inventory',
    img: '/images/imag5.webp',
  },
  {
    title: 'VENDE TU VEHÍCULO',
    href: '/sell',
    img: 'https://images.67degreescdn.co.uk/CnxOnoKfze_pnsgDV5Liq5_0zbQ=/370x600/smart/137/6/16950737596508c5dfe1628_dsc02833-enhanced-nr.jpg',
  },
  {
    title: 'FINANCIAMIENTO',
    href: '/buy',
    img: '/images/finance.jpg',
  },
  {
    title: 'VENDIDOS',
    href: '/previously-sold',
    img: 'https://images.67degreescdn.co.uk/eXYiCx4AFo1x6vhPajTk-P5_UFs=/370x600/smart/137/6/1680710816642d9ca0a8ba1_news-events.jpg',
  },
];

// ── Bloques-2 (About) — 3 bloques, 504×263px en el real ────────
const ABOUT_LINKS = [
  {
    title: '¿POR QUÉ ESCOGERNOS?',
    href: '/why-choose',
    img: '/images/mazda.png',
  },
  {
    title: 'CONOCE AL EQUIPO',
    href: '/meet-the-team',
    img: 'https://images.67degreescdn.co.uk/Z_gaQpL-MK7HyvGsrun-adEMXCQ=/503x263/smart/137/6/169581980065142818e9c46_dji-20230926225609-0047-d-edit-2.jpg',
  },
];

// ── Fallback vehicles mientras carga BD ────────────────────────
export default function Home() {
  useEffect(() => { document.title = 'Revillot Garage — Vehículos Premium en Curicó'; }, []);
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    vehiclesApi.getAll({ status: 'available', limit: 4, sort: 'newest' })
      .then(res => setVehicles(res.data.vehicles))
      .catch(() => {});
  }, []);

  const displayVehicles = vehicles;

  // Carrusel de "Últimas Incorporaciones" en móvil — desplaza una tarjeta
  // a la vez al usar las flechas, igual que el comportamiento de Romans.
  const carouselRef = useRef(null);
  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector('.vehicle-card');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      {/* ══════════════════════════════════════════════════════
          0. HERO
          Header es fixed en homepage → la imagen empieza en top:0
          El sitio real: imagen width:100%, height:auto (proporción natural)
          Imagen 3840×2560 → ratio ~1.5:1 → a 1920px ancho → 1280px alto
          En pantallas pequeñas usamos min-height para evitar que sea muy baja
      ══════════════════════════════════════════════════════ */}
      <div className="hero">
        <img
          src={HERO_IMG}
          alt="Bienvenidos a Revillot Garage"
          loading="eager"
        />
        {/* Overlay idéntico al de Sell/Buy — sutil arriba, más denso abajo */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)',
          zIndex: 1,
        }} />

        {/* Slogan centrado con más impacto */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 60,
          textAlign: 'center',
        }}>
          {/* Línea decorativa */}
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.5)', marginBottom: 20 }} />

          {/* Tagline principal */}
          <h2 className="hero-title servicio-hero-h1" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 56, fontWeight: 200,
            letterSpacing: '8px', textTransform: 'uppercase',
            color: '#fff', margin: '0 0 14px', lineHeight: 1.05,
          }}>
            COMPROMISO EN CADA DETALLE
          </h2>

          {/* Subtexto */}
          <p className="hero-subtitle" style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: 14, fontWeight: 300,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 28px',
          }}>
            Vehículos premium & semi-premium en Curicó
          </p>

          {/* Botón CTA */}
          <div className="hero-cta" style={{ display: 'flex', gap: 14 }}>
            <a
              href="/inventory"
              onClick={e => { e.preventDefault(); navigate('/inventory'); }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10, fontWeight: 500,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#fff', color: '#000',
                padding: '14px 36px', textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}
            >
              VER STOCK
            </a>
            <a
              href="/contact"
              onClick={e => { e.preventDefault(); navigate('/contact'); }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10, fontWeight: 500,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: 'none', color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.5)',
                padding: '14px 36px', textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#fff'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}
            >
              CONTÁCTANOS
            </a>
          </div>

          {/* Línea decorativa final */}
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)', marginTop: 28 }} />
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          3. PAGE CONTENT (Welcome)
          Real: padding=50px 25px, max-width=1024px, centrado
          H1: 20px/400/6px/uppercase, centrado
          P: 15px/400/line-height=27px
      ══════════════════════════════════════════════════════ */}
      {/* ── SECCIÓN BIENVENIDA ── */}
      <div style={{
        padding: '80px 25px 70px',
        maxWidth: 860,
        margin: '0 auto',
        textAlign: 'center',
      }} data-reveal>

        {/* Supertítulo tenue */}
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11, fontWeight: 500,
          letterSpacing: '7px', textTransform: 'uppercase',
          color: '#555', marginBottom: 20,
        }}>
          BIENVENIDOS A
        </div>

        {/* Nombre principal — gran jerarquía */}
        <h1 className="servicio-hero-h1" style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 56, fontWeight: 200,
          letterSpacing: '8px', textTransform: 'uppercase',
          color: '#000', lineHeight: 1.1,
          margin: '0 0 24px',
        }}>
          REVILLOT GARAGE
        </h1>

        {/* Línea decorativa */}
        <div style={{
          width: 40, height: 1,
          background: 'rgba(0,0,0,0.2)',
          margin: '0 auto 36px',
        }} />

        {/* Texto introductorio — máx 2 párrafos, tipografía ligera */}
        <p style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: 16, fontWeight: 300,
          color: 'rgb(50,50,50)', lineHeight: 1.9,
          marginBottom: 18,
        }}>
          Somos una empresa familiar, concesionario independiente de vehículos premium
          y semi-premium en Curicó. Cada auto de nuestro stock es elegido con criterio:
          calidad, equipamiento y estado impecable.
        </p>
        <p style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: 16, fontWeight: 300,
          color: 'rgb(50,50,50)', lineHeight: 1.9,
          marginBottom: 0,
        }}>
          Nos enorgullece acompañar a cada cliente en todo el proceso — compra, venta
          o financiamiento — con transparencia, agilidad y el respaldo de un equipo
          comprometido con tu satisfacción.
        </p>

      </div>



      {/* ══════════════════════════════════════════════════════
          1. BLOQUES-1 (Quick Links)
          Real: listing__list padding=0px 0px 60px
          4 bloques × 370×600px, sin gap entre ellos
      ══════════════════════════════════════════════════════ */}
      <div className="blocks-outer">
        <div className="blocks-listing">
          {QUICK_LINKS.map((link, i) => (
            <div
              key={link.title}
              data-reveal={i===0?'':i===1?'delay-1':i===2?'delay-2':'delay-3'}
              className="block-item"
              onClick={() => navigate(link.href)}
            >
              <div className="block-item__images">
                <img src={link.img} alt={link.title} loading="lazy" />
              </div>
              <div className="block-item__details">
                <div className="block-item__title">{link.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. FEATURED VEHICLES
          Real: heading CENTRADO, fontSize=30px, letterSpacing=6px
          Línea decorativa de 40px centrada debajo del heading
          4 vehículos en fila con gap=30px
      ══════════════════════════════════════════════════════ */}
      <div className="featured-vehicles">
        <div className="featured-vehicles__inner">
          <div className="listing-title" data-reveal>
            <h2 className="listing-heading">ÚLTIMAS INCORPORACIONES</h2>
            {/* Línea decorativa exacta del sitio real */}
            <div className="listing-heading__deco" />
          </div>
          {displayVehicles.length > 0 ? (
            <div className="vehicles-carousel-wrap">
              <button
                type="button"
                className="vehicles-carousel-arrow vehicles-carousel-arrow--left"
                aria-label="Anterior"
                onClick={() => scrollCarousel(-1)}
              >‹</button>
              <div className="vehicles-grid" ref={carouselRef}>
                {displayVehicles.map(v => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
              <button
                type="button"
                className="vehicles-carousel-arrow vehicles-carousel-arrow--right"
                aria-label="Siguiente"
                onClick={() => scrollCarousel(1)}
              >›</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0 60px', fontFamily: 'Montserrat,sans-serif', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>
              Próximamente nuevas incorporaciones
            </div>
          )}
        </div>
      </div>

      

      {/* ══════════════════════════════════════════════════════
    4. BLOQUES-2 (About Us)
══════════════════════════════════════════════════════ */}
        <div className="blocks-outer">

          {/* Heading "SOBRE NOSOTROS" — mismo estilo que ÚLTIMAS INCORPORACIONES */}
          <div className="listing-title" style={{ paddingTop: 40 }} data-reveal>
            <h2 className="listing-heading">SOBRE NOSOTROS</h2>
            <div className="listing-heading__deco" />
          </div>

          <div className="blocks-listing blocks-listing--about">
            {ABOUT_LINKS.map((link, i) => (
              <div
                key={link.title}
                data-reveal={i===0?'':i===1?'delay-2':'delay-4'}
                className="block-item block-item--about"
                onClick={() => navigate(link.href)}
              >
                <div className="block-item__images block-item__images--about">
                  <img src={link.img} alt={link.title} loading="lazy" />
                </div>
                <div className="block-item__details block-item__details--about">
                  <div className="block-item__title">{link.title}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      {/* ══════════════════════════════════════════════════════
          5. INSIGHT + VIDEO
          Real: left=517px (float left), right=1033px (float right, padding-top=75px)
          Insight title: 28px/400/4px/uppercase
          Video: thumbnail con botón play estilo YouTube
      ══════════════════════════════════════════════════════ */}
      <div className="insight-video">
        <div className="insight-video__inner">

          {/* Insights izquierda */}
          <div className="insights-left" data-reveal="left">
            <h2 className="insights-left__title">INSIGHTS</h2>
            <img
              className="insights-left__img"
              src={INSIGHT_IMG}
              alt="Revillot Insights"
              loading="lazy"
            />
            <p className="insights-left__desc">
              Como concesionario especializado en vehículos premium y semi-premium en Chile,
              ofrecemos asesoría experta sobre el mercado automotriz, tendencias de valor
              y los mejores vehículos disponibles para cada presupuesto.
            </p>
            <a
              className="btn-insights"
              href="/insights"
              onClick={e => { e.preventDefault(); navigate('/insights'); }}
            >
              VER INSIGHTS
            </a>
          </div>

          {/* Video derecha — placeholder "Próximamente": el video real
              aún no ha sido grabado/subido. Se mantiene la misma
              estructura y proporciones para no romper el layout, solo
              se reemplaza el contenido por un aviso profesional sobre
              la misma imagen del hero de Home. */}
          <div className="video-right" data-reveal="right">
            <div
              className="video-right__thumb video-right__thumb--placeholder"
              style={{ backgroundImage: `url(${HERO_IMG})` }}
            >
              <div className="video-right__placeholder-overlay" />
              <span className="material-icons video-right__placeholder-icon">videocam</span>
              <div className="video-right__placeholder-text">Próximamente</div>
              <div className="video-right__placeholder-subtext">Estamos preparando contenido en video para ti</div>
            </div>
            <div className="video-right__info">
              <div className="video-right__label">Video Destacado:</div>
              <div className="video-right__title">
                Nuevo video muy pronto
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
