import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/* ── Datos ─────────────────────────────────────────────────── */
const PASOS = [
  {
    n: '01',
    icon: '🔍',
    titulo: 'Evaluación inicial',
    producto: null,
    desc: 'Inspeccionamos el tipo de tapiz, el nivel de suciedad y las manchas presentes antes de cualquier aplicación. No todos los tejidos son iguales — el diagnóstico define el tratamiento.',
  },
  {
    n: '02',
    icon: '🌀',
    titulo: 'Aspirado profundo',
    producto: null,
    desc: 'Retiramos polvo, pelo de mascota, migas y partículas secas en profundidad. El aspirado previo es clave: limpiar sin aspirar primero es mover suciedad seca sobre las fibras húmedas.',
  },
  {
    n: '03',
    icon: '🧴',
    titulo: 'Limpieza profunda de fibras',
    producto: 'Extractus Vonixx — VSC1',
    desc: 'Limpiador alcalino ultraconcentrado aplicado con cepillo profesional. Penetra las fibras y disuelve grasa, aceites y suciedad incrustada que el aspirado no puede retirar.',
  },
  {
    n: '04',
    icon: '🦠',
    titulo: 'Tratamiento bactericida',
    producto: 'Bactran Vonixx — VSC2',
    desc: 'Formulado con peróxido de hidrógeno y tensioactivos especiales. Elimina hongos, bacterias, ácaros y olores persistentes. Eficaz contra manchas de sangre, café, orina, moho y tabaco.',
  },
  {
    n: '05',
    icon: '🛡️',
    titulo: 'Sanitización y sellado',
    producto: 'Sanitizante Vonixx — VSC3',
    desc: 'Finalizador con acción desinfectante de efecto residual. Protege el tapiz contra bacterias, virus y hongos por hasta 3 meses. Suaviza las fibras y deja el habitáculo con aroma fresco.',
  },
  {
    n: '06',
    icon: '💨',
    titulo: 'Secado controlado',
    producto: null,
    desc: 'Proceso de secado adecuado para evitar humedad residual. La humedad mal gestionada es la principal causa de mal olor y moho tras una limpieza de tapiz.',
  },
];

const BENEFICIOS = [
  { icon: '🦠', t: 'Elimina el 99.9% de microorganismos', d: 'El sistema VSC está certificado para eliminar virus, bacterias y hongos causantes de enfermedades.' },
  { icon: '🛡️', t: 'Protección residual hasta 3 meses',   d: 'El Sanitizante crea una barrera activa que sigue protegiendo mucho después de la limpieza.' },
  { icon: '👃', t: 'Sin olores persistentes',             d: 'Bactran neutraliza en profundidad los olores de tabaco, mascotas, humedad y comida.' },
  { icon: '🧶', t: 'Fibras restauradas y suavizadas',     d: 'El proceso no solo limpia — las fibras quedan acondicionadas, con tacto y aspecto renovados.' },
  { icon: '🌿', t: 'Habitáculo más saludable',            d: 'Reducimos ácaros, esporas y bacterias que se acumulan en los tapices y afectan la calidad del aire interior.' },
  { icon: '🩸', t: 'Manchas difíciles eliminadas',        d: 'Sangre, café, orina, moho — Bactran actúa donde los limpiadores comunes fallan.' },
];

const TEJIDOS = [
  { tipo: 'Tela / Textil', desc: 'El más común. Acumula polvo, ácaros y olores con facilidad. Responde muy bien al sistema VSC completo.' },
  { tipo: 'Cuero sintético (PVC / PU)', desc: 'Superficie no porosa pero con costuras y pliegues donde se acumula suciedad. Proceso adaptado sin cepillado agresivo.' },
  { tipo: 'Alcántara', desc: 'Material delicado presente en autos premium. Usamos Extractus Sensitive (pH neutro) para no dañar las fibras.' },
  { tipo: 'Alfombras y cielo interior', desc: 'Incluidas en el servicio. Mismo proceso de tres etapas VSC para una higienización completa del habitáculo.' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
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

/* ══════════════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════════════ */
export default function Tapiz() {
  const procesoRef = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => { document.title = 'Restauración de Tapiz — Revillot Garage'; }, []);

  const scrollTo = (ref) => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div className="servicio-hero-outer" style={{
        position: 'relative', width: '100%', height: 520,
        overflow: 'hidden', background: '#080808',
      }}>
        <img
          src="/images/home.webp"
          alt="Restauración de tapiz Revillot Garage"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
        }} />
        <div className="servicio-hero-content" style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '0 8%',
        }}>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 500,
            letterSpacing: '6px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: 18,
          }}>Estética Automotriz</div>

          <h1 className="servicio-hero-h1" style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 56, fontWeight: 200,
            letterSpacing: '8px', textTransform: 'uppercase', color: '#fff',
            lineHeight: 1.05, marginBottom: 0,
          }}>
            RESTAURACIÓN<br /><span style={{ fontWeight: 600 }}>DE TAPIZ</span>
          </h1>

          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.35)', margin: '26px 0' }} />

          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 16, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)', maxWidth: 500, lineHeight: 1.9, marginBottom: 38,
          }}>
            Higienización profesional con el Sistema VSC de Vonixx.<br />
            Limpieza profunda, eliminación bacteriana y protección residual de hasta 3 meses.
          </p>

          <button
            onClick={() => scrollTo(procesoRef)}
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
          >Ver el proceso</button>
        </div>
      </div>

      {/* ── HEADER DEL SERVICIO ── */}
      <div style={{ background: '#000', padding: '48px 25px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
            letterSpacing: '5px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: 12,
          }}>Sistema VSC — Vonixx Smart Cleaning</div>
          <h2 style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 36, fontWeight: 200,
            letterSpacing: '6px', textTransform: 'uppercase', color: '#fff',
            marginBottom: 14, lineHeight: 1,
          }}>Higienización Profesional</h2>
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.8, margin: '0 0 22px',
          }}>
            El Sistema VSC es un proceso de tres etapas diseñado para limpiar, desinfectar y proteger tapices de forma
            profesional. Más que una limpieza — es una higienización certificada.
          </p>

          {/* Tres productos en badges */}
          <div className="tapiz-vsc-badges" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { n: 'VSC1', nombre: 'Extractus', rol: 'Limpieza profunda' },
              { n: 'VSC2', nombre: 'Bactran',   rol: 'Eliminación bacteriana' },
              { n: 'VSC3', nombre: 'Sanitizante', rol: 'Protección residual' },
            ].map(p => (
              <div key={p.n} style={{
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 700,
                  letterSpacing: '2px', color: 'rgba(255,255,255,0.35)',
                }}>{p.n}</span>
                <span style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
                }}>{p.nombre}</span>
                <span style={{
                  fontFamily: 'Roboto,sans-serif', fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                }}>— {p.rol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROCESO + BENEFICIOS ── */}
      <section ref={procesoRef} style={{ padding: '70px 25px 80px' }}>
        <div className="servicio-proceso-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'start',
        }}>

          {/* Paso a paso */}
          <div>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: 36,
            }}>Paso a paso</div>
            {PASOS.map((paso, i) => (
              <Paso key={i} {...paso} last={i === PASOS.length - 1} />
            ))}
          </div>

          {/* Beneficios */}
          <div className="servicio-beneficios-col" style={{ position: 'sticky', top: 120 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: 12,
            }}>¿Qué obtienes?</div>
            {BENEFICIOS.map((b, i) => (
              <Beneficio key={i} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPOS DE TAPIZ ── */}
      <div style={{ background: '#f9f9f9', padding: '70px 25px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 44 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 14,
            }}>Compatibilidad</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000', marginBottom: 0,
            }}>Qué tapices tratamos</h2>
          </div>

          <div className="tapiz-tejidos-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1,
            background: '#e8e8e8',
          }}>
            {TEJIDOS.map((t, i) => (
              <div key={i} style={{ background: '#fff', padding: '30px 32px' }}>
                <div style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
                  letterSpacing: '2px', textTransform: 'uppercase', color: '#000', marginBottom: 10,
                }}>{t.tipo}</div>
                <div style={{
                  fontFamily: 'Roboto,sans-serif', fontSize: 14, fontWeight: 300,
                  color: 'rgb(102,102,102)', lineHeight: 1.75,
                }}>{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Nota sobre olores */}
          <div style={{
            marginTop: 24, padding: '20px 28px',
            background: '#fff', border: '1px solid #e0e0e0',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{
              fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300,
              color: '#777', lineHeight: 1.75, margin: 0,
            }}>
              Si tu auto tiene <strong style={{ fontWeight: 500, color: '#555' }}>malos olores persistentes, signos de humedad o manchas antiguas</strong>, este es el servicio indicado.
              El Sistema VSC actúa donde los limpiadores convencionales no llegan — en profundidad y con acción residual.
            </p>
          </div>
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
          }}>AGENDA TU SERVICIO</h2>
          <div style={{ width: 40, height: 1, background: '#000', margin: '0 auto 20px' }} />
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgb(102,102,102)', lineHeight: 1.85, marginBottom: 36,
          }}>
            Contáctanos y coordinamos una fecha. Trabajamos en nuestras instalaciones o podemos ir donde tú estás.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/56934580647?text=Hola%2C%20me%20interesa%20la%20restauraci%C3%B3n%20de%20tapiz"
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
