import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


/* ── URLs redes sociales ── cámbialas por las tuyas */
const SOCIAL = {
  instagram: 'https://www.instagram.com/revillotgarage/',
  facebook:  'https://www.facebook.com/',
  whatsapp:  'https://wa.me/+56934580647',
};

function linkStyle(color, isActive) {
  return {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '0 11px', height: '113px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px', fontWeight: 500,
    letterSpacing: '2px', textTransform: 'uppercase',
    color, textDecoration: 'none',
    whiteSpace: 'nowrap', cursor: 'pointer',
    background: 'none', border: 'none', position: 'relative',
    transition: 'color 0.2s',
    borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
    boxSizing: 'border-box',
  };
}

/* ── Íconos SVG ── */
const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 10 6" width="10" height="6" style={{ fill: 'currentColor', flexShrink: 0 }}>
    <path d="M5 6L0 0h10L5 6z"/>
  </svg>
);

function SocialIcon({ href, icon, label }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
      aria-label={label} title={label}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, color:'inherit', textDecoration:'none', transition:'opacity 0.2s', opacity:0.65 }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
    >{icon}</a>
  );
}

/* ── Dropdown genérico ── */
function NavDropdown({ label, items, color, isOpen, onEnter, onLeave }) {
  return (
    <div style={{ position: 'relative' }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button style={{ ...linkStyle(color, false), cursor: 'pointer' }}>
        {label}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display:'flex' }}>
          <ChevronDown />
        </span>
      </button>
      {isOpen && (
        <ul style={{
          position: 'absolute', top: '100%', right: 0,
          background: '#fff', border: '1px solid #ececec',
          minWidth: '220px', zIndex: 200, listStyle: 'none',
          padding: 0, margin: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        }}>
          {items.map(([to, label]) => (
            <li key={to} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <NavLink to={to} onClick={onLeave}
                style={({ isActive }) => ({
                  display: 'block', padding: '12px 20px',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '11px',
                  fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase',
                  color: isActive ? '#000' : '#333', textDecoration: 'none',
                  background: isActive ? '#f5f5f5' : 'transparent', transition: 'background 0.15s',
                })}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >{label}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const [dropdownOpen,        setDropdownOpen]        = useState(false);
  const [dropdownEsteticaOpen, setDropdownEsteticaOpen] = useState(false);
  const [scrolled,            setScrolled]            = useState(false);
  const [mobileOpen,          setMobileOpen]          = useState(false);
  const [mobileAboutOpen,     setMobileAboutOpen]     = useState(false);
  const [mobileEsteticaOpen,  setMobileEsteticaOpen]  = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) { setScrolled(false); return; }
    const check = () => setScrolled(window.scrollY > 80);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
    setMobileEsteticaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const transparent = isHome && !scrolled && !mobileOpen;
  const color = transparent ? 'rgba(255,255,255,0.9)' : '#000';

  return (
    <header style={{
      position: isHome ? 'fixed' : 'sticky',
      top: 0, left: 0, right: 0,
      zIndex: 9998, height: '113px', width: '100%',
      background: transparent ? 'transparent' : '#fff',
      boxShadow: transparent ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
      transition: 'background 0.35s ease, box-shadow 0.35s ease',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', height: '113px',
        maxWidth: '1600px', width: '100%',
        margin: '0 auto', padding: '0 25px', position: 'relative',
      }}>

        {/* ── NAV IZQUIERDA ── */}
        <nav className="header-nav-desktop" style={{ display:'flex', alignItems:'center', flex:1 }}>
          <NavLink to="/"         end style={({ isActive }) => linkStyle(color, isActive)}>HOME</NavLink>
          <NavLink to="/inventory"    style={({ isActive }) => linkStyle(color, isActive)}>STOCK</NavLink>
          <NavLink to="/sell"         style={({ isActive }) => linkStyle(color, isActive)}>VENDE TU VEHÍCULO</NavLink>
          <NavLink to="/buy"          style={({ isActive }) => linkStyle(color, isActive)}>COMPRA</NavLink>

          <NavLink to="/inspeccion" style={({ isActive }) => linkStyle(color, isActive)}>INSPECCIÓN</NavLink>

          {/* Dropdown Estética Automotriz */}
          <NavDropdown
            label="ESTÉTICA"
            color={color}
            isOpen={dropdownEsteticaOpen}
            onEnter={() => setDropdownEsteticaOpen(true)}
            onLeave={() => setDropdownEsteticaOpen(false)}
            items={[
              ['/lavado', 'Lavado Automotriz'],
              ['/tapiz',  'Restauración de Tapiz'],
            ]}
          />
        </nav>

        {/* ── LOGO CENTRADO ── */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', top:0, height:'113px', display:'flex', alignItems:'center', zIndex:1 }}>
          <NavLink to="/" style={{ display:'block', textDecoration:'none', textAlign:'center' }}>
            <div className="header-logo-text" style={{ fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:400, letterSpacing:'4px', textTransform:'uppercase', color: transparent ? '#fff' : '#000', lineHeight:1, marginBottom:7, transition:'color 0.35s ease', whiteSpace:'nowrap' }}>
              REVILLOT
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <div style={{ height:'0.5px', width:22, background: transparent ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)', transition:'background 0.35s ease' }} />
              <div style={{ fontFamily:"'Montserrat', sans-serif", fontSize:7, fontWeight:400, letterSpacing:'5px', textTransform:'uppercase', color: transparent ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', lineHeight:1, transition:'color 0.35s ease', whiteSpace:'nowrap' }}>GARAGE</div>
              <div style={{ height:'0.5px', width:22, background: transparent ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)', transition:'background 0.35s ease' }} />
            </div>
          </NavLink>
        </div>

        {/* ── NAV DERECHA ── */}
        <nav className="header-nav-desktop" style={{ display:'flex', alignItems:'center', flex:1, justifyContent:'flex-end' }}>

          <NavLink to="/insights" style={({ isActive }) => linkStyle(color, isActive)}>INSIGHTS</NavLink>

          {/* Dropdown Sobre Nosotros */}
          <NavDropdown
            label="SOBRE NOSOTROS"
            color={color}
            isOpen={dropdownOpen}
            onEnter={() => setDropdownOpen(true)}
            onLeave={() => setDropdownOpen(false)}
            items={[
              ['/why-choose',      '¿Por qué escogernos?'],
              ['/meet-the-team',   'Conoce al Equipo'],
              ['/previously-sold', 'Vendidos'],
              ['/buy',             'Financiamiento'],
            ]}
          />

          <NavLink to="/contact" style={({ isActive }) => linkStyle(color, isActive)}>CONTÁCTANOS</NavLink>

          <div style={{ width:1, height:22, background: transparent ? 'rgba(255,255,255,0.25)' : '#e0e0e0', margin:'0 4px 0 8px', flexShrink:0 }} />

          <div style={{ display:'flex', alignItems:'center', gap:2, color }}>
            <SocialIcon href={SOCIAL.instagram} icon={<IgIcon />} label="Instagram" />
            <SocialIcon href={SOCIAL.facebook}  icon={<FbIcon />} label="Facebook" />
            <SocialIcon href={SOCIAL.whatsapp}  icon={<WaIcon />} label="WhatsApp" />
          </div>

          <NavLink to="/admin" aria-label="Panel de administración"
            style={{ display:'flex', alignItems:'center', padding:'0 6px', height:'113px', color, textDecoration:'none', opacity:0.4, transition:'opacity 0.2s', flexShrink:0 }}
            onMouseEnter={e => { e.currentTarget.style.opacity='1'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity='0.4'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
          </NavLink>

          <div style={{ width:1, height:22, background: transparent ? 'rgba(255,255,255,0.25)' : '#e0e0e0', margin:'0 4px', flexShrink:0 }} />

          <a href="tel:+56934580647" aria-label="Teléfono"
            style={{ display:'flex', alignItems:'center', padding:'0 8px', height:'113px', color, textDecoration:'none', transition:'opacity 0.2s', flexShrink:0 }}
            onMouseEnter={e => { e.currentTarget.style.opacity='0.6'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}
          >
            <PhoneIcon />
          </a>
        </nav>
      </div>

      {/* ── BOTÓN HAMBURGUESA (solo móvil) ── */}
      <button className="header-burger" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(o => !o)}
        style={{ position:'absolute', top:'50%', right:'20px', transform:'translateY(-50%)', width:30, height:22, background:'none', border:'none', padding:0, zIndex:10001, display:'none', flexDirection:'column', justifyContent:'space-between' }}
      >
        <span style={{ display:'block', height:2, width:'100%', background: mobileOpen ? '#000' : color, transition:'transform 0.25s ease, background 0.25s ease, opacity 0.25s ease', transform: mobileOpen ? 'translateY(9.5px) rotate(45deg)' : 'none' }} />
        <span style={{ display:'block', height:2, width:'100%', background: mobileOpen ? '#000' : color, transition:'opacity 0.2s ease, background 0.25s ease', opacity: mobileOpen ? 0 : 1 }} />
        <span style={{ display:'block', height:2, width:'100%', background: mobileOpen ? '#000' : color, transition:'transform 0.25s ease, background 0.25s ease', transform: mobileOpen ? 'translateY(-9.5px) rotate(-45deg)' : 'none' }} />
      </button>

      {/* ── OVERLAY MÓVIL ── */}
      <div className="header-mobile-overlay" onClick={() => setMobileOpen(false)}
        style={{ position:'fixed', inset:0, top:'113px', background:'rgba(0,0,0,0.4)', opacity: mobileOpen ? 1 : 0, visibility: mobileOpen ? 'visible' : 'hidden', transition:'opacity 0.25s ease, visibility 0.25s ease', zIndex:9999 }}
      />

      {/* ── PANEL MÓVIL ── */}
      <nav className="header-mobile-panel"
        style={{ position:'fixed', top:'113px', right:0, bottom:0, width:'82%', maxWidth:'340px', background:'#fff', boxShadow:'-4px 0 24px rgba(0,0,0,0.15)', transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.3s ease', zIndex:10000, overflowY:'auto', overflowX:'hidden', display:'flex', flexDirection:'column', visibility: mobileOpen ? 'visible' : 'hidden' }}
      >
        {[['/', 'HOME', true], ['/inventory', 'STOCK'], ['/sell', 'VENDE TU VEHÍCULO'], ['/buy', 'COMPRA'], ['/inspeccion', 'INSPECCIÓN'], ['/insights', 'INSIGHTS']].map(([to, label, end]) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({ display:'block', padding:'16px 24px', fontFamily:"'Montserrat', sans-serif", fontSize:'12px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color: isActive ? '#000' : '#444', background: isActive ? '#f7f7f7' : 'transparent', borderBottom:'1px solid #eee', textDecoration:'none' })}
          >{label}</NavLink>
        ))}

        {/* Estética Automotriz (acordeón móvil) */}
        <button onClick={() => setMobileEsteticaOpen(o => !o)}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', width:'100%', textAlign:'left', fontFamily:"'Montserrat', sans-serif", fontSize:'12px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#444', background:'transparent', border:'none', borderBottom:'1px solid #eee' }}
        >
          ESTÉTICA AUTOMOTRIZ
          <svg viewBox="0 0 10 6" width="10" height="6" style={{ fill:'currentColor', flexShrink:0, transform: mobileEsteticaOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}><path d="M5 6L0 0h10L5 6z"/></svg>
        </button>
        {mobileEsteticaOpen && [
          ['/lavado', 'Lavado Automotriz'],
          ['/tapiz',  'Restauración de Tapiz'],
        ].map(([to, label]) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({ display:'block', padding:'14px 24px 14px 40px', fontFamily:"'Montserrat', sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', color: isActive ? '#000' : '#777', background: isActive ? '#f7f7f7' : '#fafafa', borderBottom:'1px solid #eee', textDecoration:'none' })}
          >{label}</NavLink>
        ))}

        {/* Sobre Nosotros (acordeón móvil) */}
        <button onClick={() => setMobileAboutOpen(o => !o)}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', width:'100%', textAlign:'left', fontFamily:"'Montserrat', sans-serif", fontSize:'12px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#444', background:'transparent', border:'none', borderBottom:'1px solid #eee' }}
        >
          SOBRE NOSOTROS
          <svg viewBox="0 0 10 6" width="10" height="6" style={{ fill:'currentColor', flexShrink:0, transform: mobileAboutOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}><path d="M5 6L0 0h10L5 6z"/></svg>
        </button>
        {mobileAboutOpen && [
          ['/why-choose',      '¿Por qué escogernos?'],
          ['/meet-the-team',   'Conoce al Equipo'],
          ['/previously-sold', 'Vendidos'],
          ['/buy',             'Financiamiento'],
        ].map(([to, label]) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({ display:'block', padding:'14px 24px 14px 40px', fontFamily:"'Montserrat', sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', color: isActive ? '#000' : '#777', background: isActive ? '#f7f7f7' : '#fafafa', borderBottom:'1px solid #eee', textDecoration:'none' })}
          >{label}</NavLink>
        ))}

        <NavLink to="/contact"
          style={({ isActive }) => ({ display:'block', padding:'16px 24px', fontFamily:"'Montserrat', sans-serif", fontSize:'12px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color: isActive ? '#000' : '#444', background: isActive ? '#f7f7f7' : 'transparent', borderBottom:'1px solid #eee', textDecoration:'none' })}
        >CONTÁCTANOS</NavLink>

        <NavLink to="/admin"
          style={{ display:'block', padding:'16px 24px', fontFamily:"'Montserrat', sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', borderBottom:'1px solid #eee', textDecoration:'none' }}
        >ADMIN</NavLink>

        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'20px 24px' }}>
          <SocialIcon href={SOCIAL.instagram} icon={<IgIcon />} label="Instagram" />
          <SocialIcon href={SOCIAL.facebook}  icon={<FbIcon />} label="Facebook" />
          <SocialIcon href={SOCIAL.whatsapp}  icon={<WaIcon />} label="WhatsApp" />
        </div>
        <a href="tel:+56934580647"
          style={{ display:'flex', alignItems:'center', gap:10, padding:'0 24px 24px', fontFamily:"'Montserrat', sans-serif", fontSize:'13px', fontWeight:500, color:'#000', textDecoration:'none' }}
        ><PhoneIcon /> +56 9 3458 0647</a>
      </nav>
    </header>
  );
}
