import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/* ── Datos ─────────────────────────────────────────────────── */
const CLASICO = {
  id: 'clasico',
  nombre: 'Lavado Clásico',
  tagline: 'El cuidado esencial. Productos de grado profesional y microfibra en todo el proceso.',
  servicio: 'Servicio 01',
  pasos: [
    {
      n: '01',
      icon: '🌀',
      titulo: 'Aspirado interior',
      producto: null,
      desc: 'Retiramos polvo, migas y residuos de alfombras, tapices y rincones antes de aplicar cualquier producto.',
    },
    {
      n: '02',
      icon: '🧹',
      titulo: 'Limpieza interior',
      producto: 'APC Vonixx',
      desc: 'Limpiador multipropósito sobre tableros, consolas, puertas y plásticos. No decolora ni reseca superficies delicadas.',
    },
    {
      n: '03',
      icon: '✨',
      titulo: 'Renovación de plásticos interiores',
      producto: 'Vonixx Flexus',
      desc: 'Hidrata y restaura el color original de los plásticos interiores. Resultado mate-natural, sin efecto aceitoso.',
    },
    {
      n: '04',
      icon: '⚙️',
      titulo: 'Limpieza de llantas',
      producto: 'Vonixx Impact',
      desc: 'Desengrasante alcalino de acción rápida. Disuelve el polvo de freno sin atacar el aluminio ni el acero.',
    },
    {
      n: '05',
      icon: '💧',
      titulo: 'Lavado exterior',
      producto: 'Shampoo pH neutro Vonixx',
      desc: 'Microfibra de alta densidad sobre toda la carrocería. Nunca esponja — cero micro-arañazos.',
    },
  ],
  beneficios: [
    { icon: '🧪', t: 'pH neutro en todo el proceso', d: 'Sin residuo ácido ni alcalino que degrade la pintura o los plásticos.' },
    { icon: '🧽', t: 'Microfibra de alta densidad',  d: 'La pintura queda libre de remolinos y marcas de lavado.' },
    { icon: '✨', t: 'Interior renovado',             d: 'Plásticos y tablero con aspecto de auto nuevo.' },
    { icon: '⚙️', t: 'Llantas limpias en profundidad', d: 'El polvo de freno que los shampoos normales no disuelven, nosotros lo eliminamos.' },
  ],
};

const PREMIUM = {
  id: 'premium',
  nombre: 'Lavado Premium',
  tagline: 'El reset completo. Pintura protegida, plásticos renovados, vidrios impecables.',
  servicio: 'Servicio 02',
  pasos: [
    {
      n: '01',
      icon: '🫧',
      titulo: 'Pre-lavado en espuma',
      producto: 'Citron',
      desc: 'Antes de tocar la pintura, aplicamos espuma activa sobre toda la carrocería. Encapsula y afloja mugre y barro sin fricción.',
    },
    {
      n: '02',
      icon: '💧',
      titulo: 'Lavado exterior con microfibra',
      producto: 'Shampoo pH neutro Vonixx',
      desc: 'Con la suciedad gruesa ya disuelta, el shampoo trabaja solo sobre residuos finos. Resultado: cero arañazos.',
    },
    {
      n: '03',
      icon: '🔬',
      titulo: 'Descontaminación férrica de pintura',
      producto: 'Vonixx Izer',
      desc: 'Elimina partículas de hierro incrustadas en la pintura — invisibles a simple vista, pero que oxidan el barniz desde adentro.',
    },
    {
      n: '04',
      icon: '⚙️',
      titulo: 'Limpieza profunda de llantas',
      producto: 'Vonixx Impact + Izer',
      desc: 'Doble tratamiento: desengrasante para suciedad orgánica y descontaminante férrico para el rin. Resultado visiblemente más profundo.',
    },
    {
      n: '05',
      icon: '🪟',
      titulo: 'Limpieza profunda de vidrios',
      producto: 'Vonixx Glazy',
      desc: 'Elimina grasa, silicona y film aceitoso. Mejora la visibilidad nocturna y bajo lluvia de forma significativa.',
    },
    {
      n: '06',
      icon: '⬛',
      titulo: 'Renovación de plásticos exteriores',
      producto: 'Vonixx Restaurax',
      desc: 'Los plásticos negros del exterior se aclaran con el sol. Recuperamos el negro intenso original con durabilidad de semanas.',
    },
    {
      n: '07',
      icon: '🌀',
      titulo: 'Aspirado + limpieza interior completa',
      producto: 'APC Vonixx + Flexus',
      desc: 'El mismo proceso del Lavado Clásico: aspirado, limpieza de tablero y consola, renovación de plásticos interiores.',
    },
    {
      n: '08',
      icon: '🏆',
      titulo: 'Encerado con cera de carnauba',
      producto: 'Carnauba Wax Paste Blend',
      desc: 'Aplicada a mano, deposita una capa hidrofóbica que hace perlar el agua, protege contra rayos UV y entrega un brillo cálido y profundo.',
    },
  ],
  beneficios: [
    { icon: '💧', t: 'Efecto perla',           d: 'La cera carnauba hace que el agua resbale sin dejar manchas de cal.' },
    { icon: '☀️', t: 'Protección UV',          d: 'La capa de cera filtra los rayos que decoloran y endurecen el barniz.' },
    { icon: '🔬', t: 'Pintura descontaminada', d: 'Eliminamos las partículas de hierro que oxidan la pintura desde dentro.' },
    { icon: '🌙', t: 'Visibilidad mejorada',   d: 'Vidrios sin grasa ni film aceitoso: mejor visión nocturna y bajo lluvia.' },
    { icon: '⬛', t: 'Plásticos como nuevos',  d: 'Negro intenso recuperado en molduras, espejos y guardabarros.' },
    { icon: '🛡️', t: 'Protección 4–8 semanas', d: 'Descontaminación + cera carnauba: la protección más duradera de un lavado.' },
  ],
};

const TABLA = [
  { item: 'Aspirado interior',                    c: true,  p: true  },
  { item: 'Limpieza interior',                    c: true,  p: true  },
  { item: 'Renovación de plásticos interiores',   c: true,  p: true  },
  { item: 'Limpieza de llantas',                  c: true,  p: true  },
  { item: 'Lavado exterior shampoo pH neutro',    c: true,  p: true  },
  { item: 'Microfibra en todo el proceso',        c: true,  p: true  },
  { item: 'Pre-lavado en espuma',                 c: false, p: true  },
  { item: 'Descontaminación férrica de pintura',  c: false, p: true  },
  { item: 'Limpieza profunda de llantas',         c: false, p: true  },
  { item: 'Limpieza profunda de vidrios',         c: false, p: true  },
  { item: 'Renovación de plásticos exteriores',   c: false, p: true  },
  { item: 'Encerado con cera de carnauba',        c: false, p: true  },
];

/* ── Sub-componentes ─────────────────────────────────────────── */
function Paso({ n, icon, titulo, producto, desc, last }) {
  return (
    <div style={{
      display: 'flex', gap: 24,
      paddingBottom: last ? 0 : 32, marginBottom: last ? 0 : 32,
      borderBottom: last ? 'none' : '1px solid #f0f0f0',
    }}>
      <div style={{
        fontFamily: 'Montserrat,sans-serif', fontSize: 40, fontWeight: 200,
        color: '#ebebeb', lineHeight: 1, flexShrink: 0, width: 52, textAlign: 'right',
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
        }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          <span style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase', color: '#000',
          }}>{titulo}</span>
        </div>
        {producto && (
          <div style={{
            display: 'inline-block', fontFamily: 'Roboto,sans-serif', fontSize: 11,
            fontWeight: 400, color: '#666', background: '#f5f5f5',
            border: '1px solid #e8e8e8', padding: '3px 10px', marginBottom: 10,
            letterSpacing: '0.5px',
          }}>{producto}</div>
        )}
        <p style={{
          fontFamily: 'Roboto,sans-serif', fontSize: 14, fontWeight: 300,
          color: 'rgb(102,102,102)', lineHeight: 1.8, margin: 0,
        }}>{desc}</p>
      </div>
    </div>
  );
}

function Beneficio({ icon, t, d }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
          letterSpacing: '2px', textTransform: 'uppercase', color: '#000', marginBottom: 5,
        }}>{t}</div>
        <div style={{
          fontFamily: 'Roboto,sans-serif', fontSize: 14, fontWeight: 300,
          color: 'rgb(102,102,102)', lineHeight: 1.7,
        }}>{d}</div>
      </div>
    </div>
  );
}

function ServicioSection({ data, refEl }) {
  return (
    <section ref={refEl} style={{ padding: '0 0 80px' }}>
      {/* Header del servicio */}
      <div className="servicio-header-black" style={{ background: 'rgb(38,38,38)', padding: '48px 25px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
            letterSpacing: '5px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: 12,
          }}>{data.servicio}</div>
          <h2 className="servicio-header-h2" style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 36, fontWeight: 200,
            letterSpacing: '6px', textTransform: 'uppercase', color: '#fff',
            marginBottom: 14, lineHeight: 1,
          }}>{data.nombre}</h2>
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.8, margin: 0,
          }}>{data.tagline}</p>
          {data.id === 'premium' && (
            <div style={{
              marginTop: 22, display: 'inline-block',
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>✓ Incluye todo el Lavado Clásico + 6 etapas adicionales</span>
            </div>
          )}
        </div>
      </div>

      {/* Proceso + Beneficios */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 25px 0' }}>
        <div className="servicio-proceso-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
        }}>
          {/* Proceso */}
          <div>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: 36,
            }}>Paso a paso</div>
            {data.pasos.map((paso, i) => (
              <Paso key={i} {...paso} last={i === data.pasos.length - 1} />
            ))}
          </div>

          {/* Beneficios */}
          <div className="servicio-beneficios-col" style={{ position: 'sticky', top: 120 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: 12,
            }}>¿Qué obtienes?</div>
            {data.beneficios.map((b, i) => (
              <Beneficio key={i} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════════════ */
export default function Lavado() {
  const clasicoRef = useRef(null);
  const premiumRef = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => { document.title = 'Lavado Profesional — Revillot Garage'; }, []);

  const scrollTo = (ref) => {
    if (!ref.current) return;
    const offset = 80; // altura del header
    const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div className="servicio-hero-outer" style={{
        position: 'relative', width: '100%', height: 560,
        overflow: 'hidden', background: '#080808',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/images/contactanos.jpg"
          alt="Lavado profesional Revillot Garage"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.40 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 100%)',
        }} />
        <div className="servicio-hero-content" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center', padding: '0 10%', width: '100%',
        }}>
          <h1 className="servicio-hero-h1" style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 56, fontWeight: 200,
            letterSpacing: '8px', textTransform: 'uppercase', color: '#fff',
            lineHeight: 1.05, marginBottom: 0,
          }}>
            LAVADO<br /><span style={{ fontWeight: 600 }}>PROFESIONAL</span>
          </h1>

          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.35)', margin: '26px 0' }} />

          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 16, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)', maxWidth: 460, lineHeight: 1.9, marginBottom: 38,
          }}>
            Productos de grado profesional y cuidado extremo en todo el proceso.<br />
            Dos servicios según lo que tu auto necesita.
          </p>

          <div className="lavado-hero-btns" style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Lavado Clásico',  ref: clasicoRef },
              { label: 'Lavado Premium',  ref: premiumRef },
            ].map(({ label, ref }) => (
              <button key={label} onClick={() => scrollTo(ref)}
                style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 500,
                  letterSpacing: '3px', textTransform: 'uppercase',
                  background: 'none', color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  padding: '14px 28px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.borderColor = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICIOS ── */}
      <ServicioSection data={CLASICO} refEl={clasicoRef} />

      {/* Divisor */}
      <div style={{ borderTop: '1px solid #e8e8e8', maxWidth: 1100, margin: '0 auto' }} />

      <ServicioSection data={PREMIUM} refEl={premiumRef} />

      {/* ── TABLA COMPARATIVA ── */}
      <div style={{ background: '#f9f9f9', padding: '80px 25px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 14,
            }}>Comparativa</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 34, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000', marginBottom: 16,
            }}>Clásico vs Premium</h2>
            <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', margin: '0 auto' }} />
          </div>

          {/* Cabecera */}
          <div className="lavado-tabla-header" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', background: '#000' }}>
            <div style={{ padding: '16px 24px' }} />
            <div style={{
              padding: '16px 12px', textAlign: 'center',
              fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}>Clásico</div>
            <div style={{
              padding: '16px 12px', textAlign: 'center',
              fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase', color: '#fff',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}>Premium</div>
          </div>

          {/* Filas */}
          {TABLA.map((row, i) => (
            <div key={i} className="lavado-tabla-row" style={{
              display: 'grid', gridTemplateColumns: '1fr 130px 130px',
              borderBottom: '1px solid #ebebeb',
              background: i % 2 === 0 ? '#fff' : '#fafafa',
            }}>
              <div className="lavado-tabla-label" style={{
                padding: '14px 24px',
                fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300, color: '#555',
              }}>{row.item}</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid #ebebeb',
              }}>
                {row.c
                  ? <span style={{ color: '#000', fontSize: 16 }}>✓</span>
                  : <span style={{ color: '#ddd', fontSize: 18 }}>–</span>}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid #ebebeb',
              }}>
                {row.p
                  ? <span style={{ color: '#000', fontSize: 16, fontWeight: 700 }}>✓</span>
                  : <span style={{ color: '#ddd', fontSize: 18 }}>–</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#fff', padding: '80px 25px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
            letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 16,
          }}>¿Te interesa?</div>
          <h2 style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
            letterSpacing: '6px', textTransform: 'uppercase', color: '#000', marginBottom: 16,
          }}>AGENDA TU LAVADO</h2>
          <div style={{ width: 40, height: 1, background: '#000', margin: '0 auto 20px' }} />
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgb(102,102,102)', lineHeight: 1.85, marginBottom: 36,
          }}>
            Contáctanos y coordinamos una fecha. Trabajamos en nuestras instalaciones o podemos ir donde tú estás.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/56934580647?text=Hola%2C%20me%20interesa%20un%20lavado%20profesional"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#000', color: '#fff',
                padding: '16px 32px', textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#000'}
            >Solicitar por WhatsApp</a>
            <button
              onClick={() => navigate('/contact')}
              style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: 'none', color: '#000', border: '1px solid #000',
                padding: '16px 32px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
            >Formulario de contacto</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
