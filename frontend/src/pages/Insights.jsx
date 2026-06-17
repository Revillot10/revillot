// ── INSIGHTS — Revillot Garage ────────────────────────────────
// Layout idéntico a Romans International:
//   1. Hero imagen full-width ~450px alto, sin overlay, sin título sobre imagen
//   2. Título "INSIGHTS" + línea + texto intro (centrado, debajo del hero)
//   3. Carrusel de videos deslizable (muestra 3 a la vez, dots, auto-play suave)
//      + botón "VER TODOS LOS VIDEOS" → abre canal YouTube
//   4. Featured Articles: 1 grande izquierda + 3 pequeños derecha
//      + botón "VER TODOS LOS ARTÍCULOS"
//   5. Footer

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { videosApi, articlesApi } from '../services/api';



const HERO_IMG = '/images/insight.jpg';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@RomansInternational';

// Imagen del hero de Contáctanos — reutilizada como fondo del
// placeholder "Próximamente" mientras no haya videos reales.
const VIDEOS_PLACEHOLDER_IMG = '/images/contactanos.jpg';

// ── Fallbacks ──────────────────────────────────────────────────
const FALLBACK_ARTICLES = [
  {
    id: 'a1',
    title: 'El mercado de vehículos premium en Chile: tendencias 2026',
    slug: 'mercado-premium-chile-2026',
    excerpt: 'Analizamos cómo está evolucionando el mercado automotriz premium en Chile, qué marcas lideran y qué esperar para los próximos meses.',
    cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  },
  {
    id: 'a2',
    title: 'Guía completa: cómo comprar un auto usado premium sin arriesgar tu inversión',
    slug: 'guia-comprar-auto-usado-premium',
    excerpt: 'Todo lo que debes revisar, preguntar y considerar antes de comprar un vehículo premium de segunda mano en Chile.',
    cover_image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  },
  {
    id: 'a3',
    title: 'Electromovilidad en Chile: ¿es el momento de dar el salto?',
    slug: 'electromovilidad-chile-oportunidad',
    excerpt: 'Los vehículos eléctricos e híbridos premium están llegando al mercado chileno con fuerza. Analizamos si vale la pena dar el paso hoy.',
    cover_image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  },
];

// ── Play Icon SVG ──────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.55)" />
      <path d="M21 17l16 9-16 9V17z" fill="#fff" />
    </svg>
  );
}

// ── Video Card ─────────────────────────────────────────────────
function VideoCard({ video, visibleCards }) {
  const [hovered, setHovered] = useState(false);
  const open = () => window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`, '_blank');
  const gaps = visibleCards - 1;

  return (
    <div
      style={{
        flexShrink: 0,
        width: `calc((100% - ${gaps * 24}px) / ${visibleCards})`,
        cursor: 'pointer',
        position: 'relative',
        background: '#111',
        overflow: 'hidden',
      }}
      onClick={open}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', background: '#000' }}>
        <img
          src={video.thumbnail_url}
          alt={video.title}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Overlay oscuro sutil */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)',
          transition: 'background 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            transform: hovered ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}>
            <PlayIcon />
          </div>
        </div>
        {/* Título sobre imagen (esquina superior izquierda) — igual que Romans */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '14px 16px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11, fontWeight: 600,
            letterSpacing: '1px', textTransform: 'uppercase',
            color: '#fff', margin: 0, lineHeight: 1.4,
          }}>
            {video.title}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Article Card (pequeño — columna derecha) ───────────────────
function ArticleCardSmall({ article, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex', gap: 16, cursor: 'pointer',
        paddingBottom: 24, marginBottom: 24,
        borderBottom: '1px solid #e8e8e8',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail cuadrado 130×90 */}
      <div style={{
        flexShrink: 0, width: 130, height: 90,
        overflow: 'hidden', background: '#eee',
      }}>
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#ccc' }} />
        )}
      </div>
      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11, fontWeight: 600,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          color: hovered ? '#333' : '#000',
          margin: '0 0 8px', lineHeight: 1.5,
          transition: 'color 0.2s',
        }}>
          {article.title}
        </h3>
        <p style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: 13, fontWeight: 300,
          color: 'rgb(102,102,102)', lineHeight: 1.7,
          margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.excerpt}
        </p>
      </div>
    </div>
  );
}

// ── Main Insights Page ─────────────────────────────────────────
export default function Insights() {
  useEffect(() => { document.title = 'Insights — Revillot Garage'; }, []);
  const navigate = useNavigate();  const [videos,   setVideos]   = useState([]);
  const [articles, setArticles] = useState([]);

  // Carrusel state
  const [currentDot, setCurrentDot]   = useState(0);
  const trackRef                        = useRef(null);
  const autoRef                         = useRef(null);

  // Cuántas tarjetas se ven a la vez: 1 en móvil, 3 en escritorio/tablet.
  // Se recalcula si el usuario rota el celular o cambia el tamaño de ventana.
  const [visibleCards, setVisibleCards] = useState(
    () => (typeof window !== 'undefined' && window.innerWidth <= 768) ? 1 : 3
  );
  useEffect(() => {
    const onResize = () => setVisibleCards(window.innerWidth <= 768 ? 1 : 3);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    videosApi.getAll()
      .then(r => setVideos(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
    articlesApi.getAll({ limit: 4 })
      .then(r => setArticles(r.data?.articles || []))
      .catch(() => {});
  }, []);

  const displayVideos   = videos;
  const displayArticles = articles.length >= 1 ? articles : FALLBACK_ARTICLES;

  // ── Carrusel de videos ──────────────────────────────────────
  // Se muestran "visibleCards" tarjetas a la vez (3 en escritorio, 1 en móvil).
  // Cada "slide" avanza de 1 en 1.
  // Total de slides = max(0, total - (visibleCards - 1))
  const totalSlides = Math.max(0, displayVideos.length - (visibleCards - 1));

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, totalSlides - 1));
    setCurrentDot(clamped);
    if (trackRef.current) {
      // Cada tarjeta ocupa 1/visibleCards del contenedor + gap 24px
      const containerW = trackRef.current.parentElement?.clientWidth || 0;
      const gaps = visibleCards - 1;
      const cardW = (containerW - gaps * 24) / visibleCards;
      trackRef.current.style.transform = `translateX(-${clamped * (cardW + 24)}px)`;
    }
  }, [totalSlides, visibleCards]);

  // Auto-advance cada 4s
  useEffect(() => {
    if (totalSlides <= 1) return;
    autoRef.current = setInterval(() => {
      setCurrentDot(prev => {
        const next = prev >= totalSlides - 1 ? 0 : prev + 1;
        if (trackRef.current) {
          const containerW = trackRef.current.parentElement?.clientWidth || 0;
          const gaps = visibleCards - 1;
          const cardW = (containerW - gaps * 24) / visibleCards;
          trackRef.current.style.transform = `translateX(-${next * (cardW + 24)}px)`;
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, [totalSlides, visibleCards]);

  // ── Artículos ───────────────────────────────────────────────
  const featuredArticle = displayArticles[0] || null;
  const sideArticles    = displayArticles.slice(1, 4);

  return (
    <>
      <Header />

      {/* ══ 1. HERO ══════════════════════════════════════════
          Romans: imagen full-width, ~450px alto, sin overlay de texto.
          La imagen se extiende BAJO el header (que es sticky en páginas internas).
      ══════════════════════════════════════════════════════ */}
      <div style={{ width: '100%', height: 520, overflow: 'hidden', position: 'relative', background: '#000' }}>
        <img
          src={HERO_IMG}
          alt="Revillot Insights"
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.45, filter: 'blur(2px)', transform: 'scale(1.05)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 40px',
        }}>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 42, fontWeight: 300,
            letterSpacing: '12px', textTransform: 'uppercase',
            color: '#fff', margin: '0 0 18px',
          }}>
            INSIGHTS
          </h1>
          <div style={{ width: 40, height: '0.5px', background: 'rgba(255,255,255,0.6)', margin: '0 auto 28px' }} />
          <p style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.82)', lineHeight: 1.85,
            maxWidth: 680, margin: '0 auto 12px',
          }}>
            En Revillot Garage compartimos nuestra visión del mercado automotriz premium en Chile.
            Analizamos tendencias, vehículos destacados y todo lo que necesitas saber para tomar
            la mejor decisión en tu próxima compra.
          </p>
          <p style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
            maxWidth: 600, margin: '0 auto',
          }}>
            Hemos dedicado nuestro canal de YouTube y artículos especializados a entregar
            información valiosa para que puedas tomar decisiones más informadas.
          </p>
        </div>
      </div>


      {/* ══ SEPARADOR VIDEOS ══════════════════════════════════ */}
      <div style={{ textAlign: 'center', padding: '60px 40px 40px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '4px', textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>
          Canal YouTube
        </div>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 200, letterSpacing: '5px', textTransform: 'uppercase', color: '#000', marginBottom: 20 }}>
          NUESTROS VIDEOS
        </h2>
        <div style={{ width: 30, height: '0.5px', background: '#000', margin: '0 auto 24px' }} />
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgb(120,120,120)', lineHeight: 1.85, maxWidth: 640, margin: '0 auto' }}>
          Recorridos en profundidad, comparativas y análisis de los vehículos más interesantes del mercado. Suscríbete para no perderte ningún estreno.
        </p>
      </div>

      {/* ══ 3. CARRUSEL DE VIDEOS ════════════════════════════
          Romans: 3 videos visibles a la vez (el 4.° asoma a la derecha).
          Títulos en la esquina superior izquierda de cada thumbnail.
          Dots de navegación debajo.
          Botón "SEE ALL VIDEOS" con borde fino → link YouTube.
      ══════════════════════════════════════════════════════ */}
      <div className="insights-section-wrap" style={{ maxWidth: 1600, margin: '0 auto', padding: '0 0 20px' }}>

        {displayVideos.length > 0 ? (
          <>
            {/* Track contenedor */}
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <div
                ref={trackRef}
                style={{
                  display: 'flex',
                  gap: 24,
                  transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  willChange: 'transform',
                  padding: '0 0 8px',
                }}
              >
                {displayVideos.map(v => (
                  <VideoCard key={v.id} video={v} visibleCards={visibleCards} />
                ))}
              </div>
            </div>

            {/* Dots */}
            {totalSlides > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 10, padding: '20px 0 0',
              }}>
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === currentDot ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: i === currentDot ? '#000' : '#ccc',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Botón VER TODOS */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 60px' }}>
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 40px',
                  border: '1px solid #000',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: '3px', textTransform: 'uppercase',
                  color: '#000', textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
              >
                VER TODOS LOS VIDEOS
              </a>
            </div>
          </>
        ) : (
          /* Placeholder "Próximamente" — aún no se ha subido ningún
             video propio al canal. Usa la misma imagen del hero de
             Contáctanos como fondo. */
          <div
            className="insights-video-empty"
            style={{ backgroundImage: `url(${VIDEOS_PLACEHOLDER_IMG})` }}
          >
            <div className="insights-video-empty__overlay" />
            <span className="material-icons insights-video-empty__icon">videocam</span>
            <div className="insights-video-empty__title">Próximamente</div>
            <div className="insights-video-empty__subtitle">
              Estamos preparando nuestro primer contenido en video. Vuelve pronto.
            </div>
          </div>
        )}
      </div>

      {/* ══ 4. FEATURED ARTICLES ═════════════════════════════
          Romans layout:
          - Título "FEATURED ARTICLES" centrado + línea
          - Columna izquierda (50%): 1 artículo GRANDE con imagen prominente, título + excerpt abajo
          - Columna derecha (50%): 3 artículos PEQUEÑOS apilados (thumbnail 130px + texto)
          - Botón "SEE ALL ARTICLES" centrado
      ══════════════════════════════════════════════════════ */}
      <div className="insights-section-wrap" style={{ maxWidth: 1600, margin: '0 auto', padding: '0 0 80px' }}>

        {/* Título sección */}
        <div style={{ textAlign: 'center', padding: '0 0 50px' }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 28, fontWeight: 400,
            letterSpacing: '6px', textTransform: 'uppercase',
            color: '#000', margin: '0 0 16px',
          }}>
            ARTÍCULOS DESTACADOS
          </h2>
          <div style={{ width: 40, height: 2, background: '#000', margin: '0 auto 24px' }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgb(120,120,120)', lineHeight: 1.85, maxWidth: 580, margin: '0 auto' }}>
            Análisis, guías de compra y tendencias del mercado automotriz premium en Chile, escritos por el equipo de Revillot Garage.
          </p>
        </div>

        {/* Grid artículos */}
        {featuredArticle && (
          <div className="insights-featured-grid" style={{ display: 'flex', gap: 50, alignItems: 'flex-start' }}>

            {/* ── Artículo grande (izquierda) ── */}
            <div
              className="insights-featured-grid__main"
              style={{ flex: '0 0 calc(50% - 25px)', cursor: 'pointer' }}
              onClick={() => navigate(`/insights/${featuredArticle.slug}`)}
            >
              {/* Imagen grande */}
              <div style={{
                width: '100%', height: 380,
                overflow: 'hidden', background: '#eee', marginBottom: 24,
              }}>
                {featuredArticle.cover_image ? (
                  <img
                    src={featuredArticle.cover_image}
                    alt={featuredArticle.title}
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#ccc' }} />
                )}
              </div>
              {/* Título */}
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14, fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: '#000', margin: '0 0 12px', lineHeight: 1.5,
              }}>
                {featuredArticle.title}
              </h2>
              {/* Excerpt */}
              <p style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: 14, fontWeight: 300,
                color: 'rgb(102,102,102)', lineHeight: 1.8, margin: 0,
              }}>
                {featuredArticle.excerpt} ...
              </p>
            </div>

            {/* ── Artículos pequeños (derecha) ── */}
            <div className="insights-featured-grid__side" style={{ flex: '0 0 calc(50% - 25px)' }}>
              {sideArticles.map(a => (
                <ArticleCardSmall
                  key={a.id}
                  article={a}
                  onClick={() => navigate(`/insights/${a.slug}`)}
                />
              ))}
            </div>

          </div>
        )}

        {/* Botón VER TODOS LOS ARTÍCULOS */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48 }}>
          <button
            onClick={() => navigate('/insights/articles')}
            style={{
              padding: '14px 40px',
              border: '1px solid #000', background: 'transparent',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11, fontWeight: 500,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: '#000', cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            VER TODOS LOS ARTÍCULOS
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}
