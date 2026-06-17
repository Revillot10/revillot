import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VehicleCard from '../components/ui/VehicleCard';
import { vehiclesApi, miscApi } from '../services/api';

// Imagen hero del inventario (igual que el slider del sitio real)
const HERO_IMG =  '/images/stock.png';

const BODY_STYLES = ['Coupe','Convertible','SUV','Saloon','Estate','Hatchback'];

const ORDER_OPTIONS = [
  { value: 'newest',     label: 'Más recientes' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'price_asc',  label: 'Precio: Menor a Mayor' },
  { value: 'year_desc',  label: 'Año: Nuevo a Antiguo' },
  { value: 'mileage_asc','label': 'Kilometraje: Menor a Mayor' },
];

const PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function Inventory() {
  useEffect(() => { document.title = 'Stock Actual — Revillot Garage'; }, []);
  const [vehicles,      setVehicles]      = useState([]);
  const [brands,        setBrands]        = useState([]);
  const [pagination,    setPagination]    = useState({});
  const [loading,       setLoading]       = useState(true);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [viewMode,      setViewMode]      = useState('grid'); // 'grid' | 'list'
  const [params,        setParams]        = useSearchParams();
  const navigate = useNavigate();
  const page      = Number(params.get('page'))     || 1;
  const brand     = params.get('brand')            || '';
  const bodyStyle = params.get('body_style')       || '';
  const sort      = params.get('sort')             || 'newest';
  const limit     = Number(params.get('limit'))    || 12;

  // Cargar marcas
  useEffect(() => {
    miscApi.getBrands()
      .then(r => setBrands(r.data))
      .catch(() => {});
  }, []);

  // Cargar vehículos
  useEffect(() => {
    setLoading(true);
    const q = { status: 'available', page, limit, sort };
    if (brand)     q.brand      = brand;
    if (bodyStyle) q.body_style = bodyStyle.toLowerCase();
    vehiclesApi.getAll(q)
      .then(r => {
        setVehicles(r.data.vehicles);
        setPagination(r.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, brand, bodyStyle, sort, limit]);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(params);
    if (key !== 'page') next.delete('page');   // reset page only when NOT navigating
    if (val !== '' && val !== null && val !== undefined) next.set(key, String(val));
    else next.delete(key);
    setParams(next);
  };

  const activeBrand = brands.find(b => b.slug === brand);

  return (
    <>
      <Header />

      <div style={{ display:'flex', minHeight:'calc(100vh - 113px)' }}>

        {/* ════════════════════════════════════════════
            SIDEBAR — idéntico a Romans International
            Real: position=fixed, top=114px, width=370px,
            bg=white, padding=50px 25px 30px,
            box-shadow=rgba(0,0,0,0.2) 4px 4px 10px
        ════════════════════════════════════════════ */}
        {sidebarOpen && (
          <aside style={{
            width: 370,
            flexShrink: 0,
            background: '#fff',
            position: 'sticky',
            top: 113,
            height: 'calc(100vh - 113px)',
            overflowY: 'auto',
            boxShadow: 'rgba(0,0,0,0.2) 4px 4px 10px 0px',
            padding: '50px 25px 30px',
            zIndex: 10,
          }}>

            {/* ── × Cerrar — Real: position=fixed, top=135px, right=14px, fontSize=30px ── */}
            <a
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'absolute', top: 21, right: 14,
                fontSize: 30, fontWeight: 400, lineHeight: 1,
                color: '#000', cursor: 'pointer', textDecoration: 'none',
                display: 'block', width: 23,
              }}
            >×</a>

            {/* ── VIEW FULL STOCK LIST — Real: bg=white, border=1px solid black,
                color=black, fontSize=14px/500/2px/uppercase, padding=12px 14px,
                display=flex, justifyContent=center, width=305px ── */}
            <a
              href="#"
              onClick={e => { e.preventDefault(); setParams({}); }}
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '100%',
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 14, fontWeight: 500,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: '#000', background: '#fff',
                border: '1px solid #000',
                padding: '12px 14px',
                textDecoration: 'none',
                marginBottom: 30,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#000'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#000'; }}
            >VER TODO EL STOCK</a>

            {/* ── BUSCAR POR MARCA — Real: header fontSize=18px/500/1px/uppercase,
                marginBottom=15px; UL display=flex, flexWrap=wrap;
                LI width=152.5px (50%), height=27px;
                A fontFamily=Roboto, fontSize=14px/400, color=rgb(102,102,102) ── */}
            <div style={{ marginBottom: 30 }}>
              <div style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 18, fontWeight: 500,
                letterSpacing: '1px', textTransform: 'uppercase',
                color: '#000', marginBottom: 15,
              }}>Buscar por Marca</div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexWrap: 'wrap',
              }}>
                {brands.map(b => (
                  <li key={b.id} style={{ width: '50%', height: 27 }}>
                    <a
                      href="#"
                      onClick={e => { e.preventDefault(); setFilter('brand', b.slug === brand ? '' : b.slug); }}
                      style={{
                        display: 'block',
                        fontFamily: 'Roboto,sans-serif',
                        fontSize: 14, fontWeight: b.slug === brand ? 700 : 400,
                        color: b.slug === brand ? '#000' : 'rgb(102,102,102)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        lineHeight: '27px',
                      }}
                      onMouseEnter={e => { if (b.slug !== brand) e.currentTarget.style.color='#000'; }}
                      onMouseLeave={e => { if (b.slug !== brand) e.currentTarget.style.color='rgb(102,102,102)'; }}
                    >{b.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── BUSCAR POR CARROCERÍA ── */}
            <div style={{ marginBottom: 30 }}>
              <div style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 18, fontWeight: 500,
                letterSpacing: '1px', textTransform: 'uppercase',
                color: '#000', marginBottom: 15,
              }}>Buscar por Carrocería</div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexWrap: 'wrap',
              }}>
                {BODY_STYLES.map(s => (
                  <li key={s} style={{ width: '50%', height: 27 }}>
                    <a
                      href="#"
                      onClick={e => { e.preventDefault(); setFilter('body_style', bodyStyle === s ? '' : s); }}
                      style={{
                        display: 'block',
                        fontFamily: 'Roboto,sans-serif',
                        fontSize: 14, fontWeight: bodyStyle === s ? 700 : 400,
                        color: bodyStyle === s ? '#000' : 'rgb(102,102,102)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        lineHeight: '27px',
                      }}
                      onMouseEnter={e => { if (bodyStyle !== s) e.currentTarget.style.color='#000'; }}
                      onMouseLeave={e => { if (bodyStyle !== s) e.currentTarget.style.color='rgb(102,102,102)'; }}
                    >{s}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── ÚLTIMAS INCORPORACIONES — slider ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 18, fontWeight: 500,
                letterSpacing: '1px', textTransform: 'uppercase',
                color: '#000', marginBottom: 15,
              }}>Últimas Incorporaciones</div>
              <SidebarSlider
                vehicles={vehicles.slice(0, 8)}
                onVehicleClick={(id) => navigate(`/vehicles/${id}`)}
              />
            </div>

            {/* ── PREVIAMENTE VENDIDOS — Real: display=flex, justifyContent=center,
                height=50px, borderTop=1px solid black, margin=0 0 15px ── */}
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate('/previously-sold'); }}
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '100%', height: 50,
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 14, fontWeight: 500,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: '#000', background: '#fff',
                borderTop: '1px solid #000',
                textDecoration: 'none',
                marginBottom: 15,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#000'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#000'; }}
            >Vehículos Vendidos</a>

            {/* ── VENDE TU VEHÍCULO — Real: display=flex, padding=12px 14px,
                borderTop=1px solid black ── */}
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate('/sell'); }}
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '100%', height: 50,
                fontFamily: 'Montserrat,sans-serif',
                fontSize: 14, fontWeight: 500,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: '#000', background: '#fff',
                borderTop: '1px solid #000',
                textDecoration: 'none',
                marginBottom: 20,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#000'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#000'; }}
            >Vende Tu Vehículo</a>

            {/* ── REDES SOCIALES — Real: display=flex, flex-direction=row ── */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
              {[
                { href: 'https://www.instagram.com/', label: 'Instagram',
                  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { href: 'https://www.facebook.com/', label: 'Facebook',
                  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { href: 'https://wa.me/56912345678', label: 'WhatsApp',
                  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                { href: 'https://www.youtube.com/', label: 'YouTube',
                  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  style={{
                    color: 'rgb(102,102,102)',
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='#000'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgb(102,102,102)'; }}
                >{icon}</a>
              ))}
            </div>

          </aside>
        )}

        {/* Botón para reabrir sidebar — ícono hamburguesa igual al original */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            title="Abrir filtros"
            style={{
              position:'fixed', left:0, top:'50%', transform:'translateY(-50%)',
              background:'#000', color:'#fff', border:'none', cursor:'pointer',
              width:36, height:36, zIndex:100,
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:5,
              padding:0,
            }}
          >
            <span style={{ display:'block', width:18, height:2, background:'#fff' }} />
            <span style={{ display:'block', width:18, height:2, background:'#fff' }} />
            <span style={{ display:'block', width:18, height:2, background:'#fff' }} />
          </button>
        )}

        {/* ════════════════════════════════════════════
            ÁREA PRINCIPAL
        ════════════════════════════════════════════ */}
        <main style={{ flex:1, minWidth:0 }}>

          {/* ── HERO con imagen y título superpuesto ── */}
          <div style={{ width:'100%', height:380, overflow:'hidden', background:'#111', position:'relative' }}>
            <img
              src={HERO_IMG}
              alt="Vehículos en Stock"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            />
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)',
            }} />
            <div style={{
              position:'absolute', inset:0,
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              textAlign:'center', padding:'0 25px',
            }}>
              <h1 style={{
                fontFamily:'Montserrat,sans-serif',
                fontSize:42, fontWeight:200,
                letterSpacing:'10px', textTransform:'uppercase',
                color:'#fff', margin:'0 0 20px', lineHeight:1.1,
                textShadow:'0 2px 24px rgba(0,0,0,0.6)',
              }}>
                {activeBrand ? activeBrand.name.toUpperCase()+' EN VENTA' : 'EN VENTA ACTUALMENTE'}
              </h1>
              <div style={{ width:40, height:1, background:'rgba(255,255,255,0.5)', marginBottom:28 }} />
              <button
                onClick={() => navigate('/contact')}
                style={{
                  fontFamily:'Montserrat,sans-serif',
                  fontSize:10, fontWeight:500,
                  letterSpacing:'3px', textTransform:'uppercase',
                  background:'#fff', color:'#000',
                  border:'none', padding:'13px 32px', cursor:'pointer',
                  transition:'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.88)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}
              >
                CONTÁCTANOS
              </button>
            </div>
          </div>

          {/* ── Controles: ORDER BY + PER PAGE + vistas ── */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'flex-end',
            padding:'12px 30px', gap:16,
            borderBottom:'1px solid #e0e0e0',
          }}>
            {/* ORDER BY */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={controlLabelStyle}>ORDER BY</span>
              <select
                value={sort}
                onChange={e => setFilter('sort', e.target.value)}
                style={selectStyle}
              >
                {ORDER_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* PER PAGE */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={controlLabelStyle}>PER PAGE</span>
              <select
                value={limit}
                onChange={e => setFilter('limit', e.target.value)}
                style={selectStyle}
              >
                {PER_PAGE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* ── Íconos vista lista / grilla ── */}
            <div style={{ display:'flex', gap:4, marginLeft:8 }}>
              {/* Vista lista (1 columna) */}
              <button
                onClick={() => setViewMode('list')}
                title="Vista lista"
                style={{
                  width:34, height:34, border:'1px solid',
                  borderColor: viewMode==='list' ? '#000' : '#e0e0e0',
                  background:  viewMode==='list' ? '#000' : '#fff',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                }}
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill={viewMode==='list'?'#fff':'#666'}>
                  <rect x="0" y="0"  width="16" height="2"/>
                  <rect x="0" y="6"  width="16" height="2"/>
                  <rect x="0" y="12" width="16" height="2"/>
                </svg>
              </button>
              {/* Vista grilla (multi columna) */}
              <button
                onClick={() => setViewMode('grid')}
                title="Vista cuadrícula"
                style={{
                  width:34, height:34, border:'1px solid',
                  borderColor: viewMode==='grid' ? '#000' : '#e0e0e0',
                  background:  viewMode==='grid' ? '#000' : '#fff',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill={viewMode==='grid'?'#fff':'#666'}>
                  <rect x="0" y="0" width="6" height="6"/>
                  <rect x="8" y="0" width="6" height="6"/>
                  <rect x="0" y="8" width="6" height="6"/>
                  <rect x="8" y="8" width="6" height="6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Grid de vehículos ── */}
          <div style={{ padding:'0 25px 40px' }}>
            {loading ? (
              <div className="loading" />
            ) : vehicles.length ? (
              viewMode === 'list' ? (
                /* Vista lista — items con margin-bottom=80px (medido del real) */
                <div style={{ paddingTop:30 }}>
                  {vehicles.map(v => (
                    <VehicleCardList key={v.id} vehicle={v} onClick={() => navigate(`/vehicles/${v.id}`)} />
                  ))}
                </div>
              ) : (
                /* Vista grilla — max-width centrado igual que el real */
                <div className="inventory-grid-view" style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(3, 1fr)',
                  gap:'30px',
                  paddingTop:30,
                }}>
                  {vehicles.map(v => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </div>
              )
            ) : (
              <div style={{
                padding:'80px 0', textAlign:'center',
                fontFamily:'Montserrat,sans-serif', fontSize:11,
                letterSpacing:'3px', textTransform:'uppercase', color:'#999',
              }}>No se encontraron vehículos</div>
            )}

            {/* ── Paginación ── */}
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={p === page ? 'active' : ''}
                    onClick={() => { setFilter('page', p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >{p}</button>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
}

/* ── Componente: Slider de Últimas Incorporaciones ── */
/* Replica exactamente el Slick Slider del sitio real:
   - 1 slide visible a la vez
   - Autoplay cada 3000ms
   - Transición fade con CSS
   - Dots de navegación abajo
   - Infinite loop                                    */
function SidebarSlider({ vehicles, onVehicleClick }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = vehicles.length;

  // Autoplay cada 3000ms (igual al real: autoplaySpeed=3000)
  useEffect(() => {
    if (total < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const handleDot = (i) => {
    clearInterval(timerRef.current);
    setCurrent(i);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 3000);
  };

  if (!vehicles.length) return null;
  const v = vehicles[current];
  const img = v.images?.find(i => i.isPrimary || i.is_primary) || v.images?.[0];
  const price = v.price ? `$${Number(v.price).toLocaleString('es-CL')}` : 'A CONSULTAR';

  return (
    // Real: padding=0 0 60px en el listing__list, sin padding lateral
    <div style={{ position:'relative', paddingBottom:60 }}>

      {/* Slide — Real: .vehicle--featured, padding=0 0 75px, width=305px */}
      <div
        key={current}
        onClick={() => onVehicleClick(v.id)}
        style={{
          cursor:'pointer',
          paddingBottom:75,   /* Real: padding=0px 0px 75px */
          position:'relative',
          animation:'sbFade 0.4s ease',
        }}
      >
        {/* Título — Real: 14px/500/2px, height=46px (2 líneas reservadas) */}
        <div style={{
          fontFamily:'Montserrat,sans-serif',
          fontSize:11, fontWeight:500,
          letterSpacing:'2px', textTransform:'uppercase', color:'#000',
          lineHeight:'23px', height:46, overflow:'hidden',
          padding:'10px 0 0',
        }}>
          {v.brand_name} {v.model}
          {v.variant && <div style={{ fontSize:11 }}>{v.variant}</div>}
        </div>

        {/* Imagen — Real: width=305px, height=214px */}
        <div style={{ width:'100%', height:214, overflow:'hidden', background:'#0a0a0a' }}>
          {img
            ? <img src={img.url} alt={`${v.brand_name} ${v.model}`}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                loading="lazy" />
            : <div style={{ width:'100%', height:'100%', background:'#1a1a1a' }} />
          }
        </div>

        {/* Details — Real: padding=13px 0 28px */}
        <div style={{ padding:'13px 0 28px' }}>

          {/* Precio — Real: padding=5px, fontSize=14px/500/2.5px */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            padding:'5px 0', marginBottom:4,
          }}>
            <div style={{
              fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500,
              letterSpacing:'2.5px', textTransform:'uppercase', color:'#000',
            }}>{price}</div>
          </div>

          {/* Specs — Real: label width=98px, fontSize=14px/500 | value 14px/300 */}
          {[
            ['AÑO',   v.year],
            ['COLOR', v.colour],
            ['KM',    v.mileage != null ? Number(v.mileage).toLocaleString('es-CL') : null],
          ].filter(([, val]) => val).map(([label, val]) => (
            <div key={label} style={{ display:'flex', alignItems:'baseline', height:22 }}>
              <span style={{
                fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500,
                letterSpacing:'2px', textTransform:'uppercase', color:'#000',
                width:98, flexShrink:0,   /* Real: width=98px exactos */
                display:'inline-block',
              }}>{label}</span>
              <span style={{
                fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300,
                color:'rgb(102,102,102)',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Botón — Real: borderTop=1px solid #000, padding=25px 10px 10px
            btn: width=220px, height=50px, display=flex, justifyContent=center */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          borderTop:'1px solid #000',
          padding:'25px 10px 10px',
          display:'flex', justifyContent:'center',
        }}>
          <button style={{
            width:220, height:50,
            fontFamily:'Montserrat,sans-serif', fontSize:14, fontWeight:500,
            letterSpacing:'2.5px', textTransform:'uppercase',
            background:'#000', color:'#fff', border:'none', cursor:'pointer',
            display:'flex', justifyContent:'center', alignItems:'center',
            transition:'background 0.2s',
          }}>VER VEHÍCULO</button>
        </div>
      </div>

      {/* Dots — Real: display=flex, bottom=40px, centrados */}
      {total > 1 && (
        <div style={{
          position:'absolute', bottom:20, left:0, right:0,
          display:'flex', justifyContent:'center', gap:8,
        }}>
          {vehicles.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); handleDot(i); }}
              style={{
                width:8, height:8, borderRadius:'50%', padding:0, border:'none',
                background: i === current ? '#000' : '#ccc',
                cursor:'pointer', transition:'background 0.3s',
                flexShrink:0,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes sbFade {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>
    </div>
  );
}

/* ── Componente: Título de sección del sidebar ── */
function SidebarTitle({ children }) {
  return (
    <div style={{
      fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:500,
      letterSpacing:'3px', textTransform:'uppercase', color:'#000',
      padding:'14px 16px 8px',
      borderTop:'1px solid #e0e0e0',
      marginTop:4,
    }}>{children}</div>
  );
}

/* ── Componente: Botón de navegación del sidebar ── */
function SidebarNavBtn({ to, label, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => navigate(to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', width: '100%',
        fontFamily: 'Montserrat, sans-serif', fontSize: 9, fontWeight: 500,
        letterSpacing: '3px', textTransform: 'uppercase',
        background: hovered ? '#000' : '#fff',
        color:      hovered ? '#fff' : '#000',
        border: '1px solid #000',
        padding: '11px 14px', cursor: 'pointer',
        textAlign: 'left', transition: 'background 0.2s, color 0.2s',
      }}
    >
      → {label}
    </button>
  );
}

/* ── Componente: Mini tarjeta de vehículo en sidebar ── */
function SidebarVehicleCard({ vehicle, onClick }) {
  const img = vehicle.images?.find(i => i.isPrimary || i.is_primary) || vehicle.images?.[0];
  const name = `${vehicle.brand_name || ''} ${vehicle.model || ''}`.trim();
  return (
    <div
      onClick={onClick}
      style={{
        display:'flex', gap:0, cursor:'pointer', borderBottom:'1px solid #f0f0f0',
        transition:'background 0.15s',
      }}
      onMouseOver={e => e.currentTarget.style.background='#fafafa'}
      onMouseOut={e => e.currentTarget.style.background='transparent'}
    >
      <div style={{ width:80, height:55, flexShrink:0, overflow:'hidden', background:'#eee' }}>
        {img && <img src={img.url} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />}
      </div>
      <div style={{ padding:'8px 12px', flex:1 }}>
        <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'1.5px', textTransform:'uppercase', color:'#000', marginBottom:3, lineHeight:1.3 }}>{name}</div>
        <div style={{ fontFamily:'Roboto,sans-serif', fontSize:11, fontWeight:300, color:'#999' }}>
          {vehicle.year} · {vehicle.mileage?.toLocaleString('es-CL')} km
        </div>
      </div>
    </div>
  );
}

/* ── Componente: Tarjeta de vehículo en vista LISTA ── */
/* Real: .vehicle--teaser, display=flex, padding=0 0 30px
   .listing__list-item: padding=0 25px, margin=0 0 80px
   Imagen: 419px × 283px
   Título: 18px/500/3.14px, borderBottom=1px solid #999
   Labels: 16px/500/2.28px, width=112px
   Values: 16px/300
   Botón negro: 220×50px                                 */
function VehicleCardList({ vehicle, onClick }) {
  const img   = vehicle.images?.find(i => i.isPrimary || i.is_primary) || vehicle.images?.[0];
  const name  = `${vehicle.brand_name || ''} ${vehicle.model || ''}`.trim();
  const price = vehicle.price
    ? `$${Number(vehicle.price).toLocaleString('es-CL')}`
    : 'A CONSULTAR';

  return (
    /* Real: listing__list-item → padding=0 25px, margin=0 0 80px */
    <div style={{ padding:'0', marginBottom:80, cursor:'pointer' }} onClick={onClick}>

      {/* Real: vehicle--teaser → display=flex, padding=0 0 30px,
          border=1px solid #ddd */}
      <div
        className="vehicle-list-item"
        style={{
          display:'flex', flexDirection:'row',
          padding:'0 0 30px',
          border:'1px solid #ddd',
          background:'#fff',
          transition:'background 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.background='#fafafa'}
        onMouseOut={e => e.currentTarget.style.background='#fff'}
      >
        {/* Imagen — Real: 419×283px */}
        <div className="vehicle-list-item__img" style={{ width:419, flexShrink:0, overflow:'hidden', background:'#0a0a0a' }}>
          {img
            ? <img src={img.url} alt={name}
                style={{ width:'100%', height:283, objectFit:'cover', display:'block', transition:'transform 0.5s' }}
                loading="lazy" />
            : <div style={{ width:'100%', height:283, background:'#1a1a1a' }} />
          }
        </div>

        {/* Detalles — Real: flex-direction=column, padding=0 */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'0 0 0 5px' }}>

          {/* Header: título + status — Real: borderBottom=1px solid #999, padding=10px 0 0 */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-start',
            borderBottom:'1px solid #999',
            padding:'10px 20px 10px 10px',
          }}>
            <h2 style={{
              fontFamily:'Montserrat,sans-serif',
              fontSize:18, fontWeight:500,
              letterSpacing:'3.14px', textTransform:'uppercase', color:'#000',
              margin:0,
            }}>
              {name}
              {vehicle.variant && (
                <div style={{ fontSize:14, letterSpacing:'2px', marginTop:2 }}>{vehicle.variant}</div>
              )}
            </h2>
            <div style={{
              fontFamily:'Montserrat,sans-serif',
              fontSize:16, fontWeight:500,
              letterSpacing:'2px', textTransform:'uppercase', color:'#000',
              flexShrink:0, marginLeft:20,
            }}>{price}</div>
          </div>

          {/* Specs — Real: display=flex, flex-direction=column, label width=112px, 16px */}
          <div style={{ flex:1, padding:'0 10px', display:'flex', flexDirection:'column', gap:0 }}>
            {[
              ['AÑO',          vehicle.year],
              ['COLOR',        vehicle.colour],
              ['KILOMETRAJE',  vehicle.mileage != null ? `${Number(vehicle.mileage).toLocaleString('es-CL')} km` : null],
              ['MOTOR',        vehicle.engine_description],
            ].filter(([, val]) => val).map(([label, val]) => (
              <div key={label} style={{ display:'flex', alignItems:'baseline', height:29 }}>
                <span style={{
                  fontFamily:'Montserrat,sans-serif',
                  fontSize:16, fontWeight:500,
                  letterSpacing:'2.28px', textTransform:'uppercase', color:'#000',
                  width:112, flexShrink:0, display:'inline-block',
                }}>{label}:</span>
                <span style={{
                  fontFamily:'Roboto,sans-serif',
                  fontSize:16, fontWeight:300,
                  color:'rgb(102,102,102)',
                }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Botón VER VEHÍCULO — Real: 220×50px, negro */}
          <div style={{ padding:'0 10px 0', display:'flex', justifyContent:'flex-end' }}>
            <button
              style={{
                width:220, height:50,
                fontFamily:'Montserrat,sans-serif',
                fontSize:14, fontWeight:500,
                letterSpacing:'2.5px', textTransform:'uppercase',
                background:'#000', color:'#fff', border:'none',
                cursor:'pointer', display:'flex',
                justifyContent:'center', alignItems:'center',
                transition:'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background='#333'}
              onMouseOut={e => e.currentTarget.style.background='#000'}
            >VER VEHÍCULO</button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Estilos compartidos ── */
const controlLabelStyle = {
  fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500,
  letterSpacing:'2.5px', textTransform:'uppercase', color:'#000',
  whiteSpace:'nowrap',
};

const selectStyle = {
  fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:400,
  letterSpacing:'1px', color:'#333',
  border:'1px solid #e0e0e0', padding:'8px 32px 8px 12px',
  background:'#fff', cursor:'pointer', outline:'none',
  appearance:'none', minWidth:160,
  backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M5 6L0 0h10L5 6z\' fill=\'%23333\'/%3E%3C/svg%3E")',
  backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center',
};
