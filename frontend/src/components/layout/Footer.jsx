import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { leadsApi } from '../../services/api';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/revillotgarage/',
  facebook:  'https://www.facebook.com/',
  whatsapp:  'https://wa.me/56934580647',
  youtube:   'https://www.youtube.com/',
};

const BRAND_COLORS = {
  instagram: '#E1306C',
  facebook:  '#1877F2',
  whatsapp:  '#25D366',
  youtube:   '#FF0000',
};

const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const lnkSt = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 11, fontWeight: 400,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)',
  textDecoration: 'none',
  transition: 'color 0.2s',
  display: 'block',
  marginBottom: 7,
};

export default function Footer() {
  const navigate  = useNavigate();
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await leadsApi.create({ first_name: email, last_name: '', email, lead_type: 'other', message: 'Newsletter' });
      setSent(true);
    } catch {}
  };

  const hoverOn  = e => e.currentTarget.style.color = '#fff';
  const hoverOff = e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)';

  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── CUERPO PRINCIPAL — 4 columnas ── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 40px 24px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr', gap: 30 }}>

        {/* Col 1 — Marca + contacto */}
        <div>
          {/* Logo tipográfico */}
          <div
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', marginBottom: 14 }}
          >
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 500, letterSpacing: '7px', textTransform: 'uppercase', color: '#fff', lineHeight: 1, marginBottom: 5 }}>
              REVILLOT
            </div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
              GARAGE
            </div>
          </div>

          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 14, maxWidth: 260 }}>
            Concesionario independiente de vehículos premium y semi-premium en Curicó, Chile.
          </p>

          {/* Contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="tel:+56934580647" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '1px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
              +56 9 3458 0647
            </a>
            <a href="mailto:contacto@revillotgarage.cl" style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              contacto@revillotgarage.cl
            </a>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
              </svg>
              Curicó, Región del Maule
            </div>
          </div>
        </div>

        {/* Col 2 — Vehículos */}
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
            VEHÍCULOS
          </div>
          <a href="/inventory" onClick={e=>{e.preventDefault();navigate('/inventory')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Stock actual</a>
          <a href="/previously-sold" onClick={e=>{e.preventDefault();navigate('/previously-sold')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Previamente vendidos</a>
          <a href="/sell" onClick={e=>{e.preventDefault();navigate('/sell')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Vende tu vehículo</a>
          <a href="/buy" onClick={e=>{e.preventDefault();navigate('/buy')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Compra y financiamiento</a>
        </div>

        {/* Col 3 — Empresa */}
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
            EMPRESA
          </div>
          <a href="/why-choose" onClick={e=>{e.preventDefault();navigate('/why-choose')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>¿Por qué elegirnos?</a>
          <a href="/meet-the-team" onClick={e=>{e.preventDefault();navigate('/meet-the-team')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Nuestro equipo</a>
          <a href="/insights" onClick={e=>{e.preventDefault();navigate('/insights')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Insights</a>
          <a href="/contact" onClick={e=>{e.preventDefault();navigate('/contact')}} style={lnkSt} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Contacto</a>
        </div>

        {/* Col 4 — Newsletter + redes */}
        <div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
            NEWSLETTER
          </div>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 12 }}>
            Sé el primero en conocer nuevo stock y ofertas exclusivas.
          </p>
          {sent ? (
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              ✓ SUSCRITO
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 13, fontWeight: 300,
                  padding: '11px 14px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button type="submit" style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#fff', color: '#000',
                border: 'none', padding: '12px',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                SUSCRIBIRSE
              </button>
            </form>
          )}

          {/* Redes sociales */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {[
              { key:'instagram', href: SOCIAL_LINKS.instagram, icon: <IgIcon />, label:'Instagram' },
              { key:'facebook',  href: SOCIAL_LINKS.facebook,  icon: <FbIcon />, label:'Facebook'  },
              { key:'whatsapp',  href: SOCIAL_LINKS.whatsapp,  icon: <WaIcon />, label:'WhatsApp'  },
              { key:'youtube',   href: SOCIAL_LINKS.youtube,   icon: <YtIcon />, label:'YouTube'   },
            ].map(({ key, href, icon, label }) => (
              <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND_COLORS[key]; e.currentTarget.style.color = BRAND_COLORS[key]; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── BARRA INFERIOR ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 40px' }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3px' }}>
            © {new Date().getFullYear()} Revillot Garage. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              ['/privacy-policy', 'Política de Privacidad'],
              ['/cookie-policy',  'Política de Cookies'],
            ].map(([path, label]) => (
              <a key={path} href={path} onClick={e=>{e.preventDefault();navigate(path)}}
                style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
