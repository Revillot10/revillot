import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/* ── Datos ─────────────────────────────────────────────────── */
const POR_QUE = [
  {
    icon: '🧑‍🔧',
    titulo: 'Especialistas en vehículos usados',
    desc: 'Técnico con experiencia en evaluación de autos usados. Sabemos dónde buscar los problemas que el vendedor no va a mostrar.',
  },
  {
    icon: '📸',
    titulo: 'Transparencia garantizada',
    desc: 'Recibes un informe completo con fotografías y observaciones técnicas de cada punto revisado. Sin tecnicismos innecesarios.',
  },
  {
    icon: '⚡',
    titulo: 'Resultado en menos de 1 hora',
    desc: 'El informe llega a tu WhatsApp y correo el mismo día de la inspección. Decidir rápido no significa decidir mal.',
  },
  {
    icon: '🤝',
    titulo: 'Opinión 100% imparcial',
    desc: 'No somos el vendedor. No tenemos interés en que compres ni en que no compres. Solo te decimos la verdad.',
  },
];

const COMO_FUNCIONA = [
  {
    n: '01',
    icon: '📅',
    titulo: 'Reserva fácilmente',
    desc: 'Contáctanos por WhatsApp o formulario. Indícanos el auto, la dirección donde está y cuándo te conviene. Coordinamos todo.',
  },
  {
    n: '02',
    icon: '🔍',
    titulo: 'Inspección profesional en terreno',
    desc: 'Nos desplazamos donde esté el vehículo — automotora o domicilio del vendedor. No necesitas estar presente. Usamos escaner profesional y hacemos prueba de ruta.',
  },
  {
    n: '03',
    icon: '📄',
    titulo: 'Recibe tu informe detallado',
    desc: 'En menos de 1 hora recibes el informe con fotos, estado técnico de cada sistema, estimado de reparaciones y una recomendación clara: comprar, negociar o descartar.',
  },
];

const INCLUYE = [
  { icon: '🔧', categoria: 'Motor y transmisión',    items: ['Estado visual del motor', 'Fugas de aceite o refrigerante', 'Niveles y calidad de fluidos', 'Funcionamiento de la transmisión'] },
  { icon: '🛞', categoria: 'Frenos y suspensión',    items: ['Pastillas y discos de freno', 'Amortiguadores', 'Rótulas y dirección', 'Estado de neumáticos'] },
  { icon: '⚡', categoria: 'Sistema eléctrico',      items: ['Lectura de códigos OBD2', 'Batería y alternador', 'Luces y climatización', 'Vidrios y cierre central'] },
  { icon: '🚗', categoria: 'Carrocería y estructura', items: ['Alineación de paneles', 'Signos de choque o reparación', 'Estado de pintura', 'Parabrisas y sellados'] },
  { icon: '🪑', categoria: 'Interior',               items: ['Tapices y alfombras', 'Tablero e instrumentos', 'Airbag y cinturones', 'Ruidos o humedad en cabina'] },
  { icon: '📋', categoria: 'Documentación',          items: ['Verificación de VIN', 'Revisión técnica al día', 'Permiso de circulación', 'Cargas o prendas'] },
];

const FAQ = [
  {
    q: '¿En qué lugar realizan la inspección?',
    a: 'Donde más te acomode — el domicilio del vendedor, una automotora o cualquier lugar coordinado previamente. Solo necesitamos espacio suficiente para trabajar.',
  },
  {
    q: '¿Cuánto dura la inspección?',
    a: 'Entre 40 y 60 minutos, dependiendo del estado del vehículo. El informe llega en menos de 1 hora después de terminar.',
  },
  {
    q: '¿Necesito estar presente?',
    a: 'No. El servicio está diseñado para que no tengas que estar. Coordinamos con el vendedor directamente. Si tienes dudas sobre el informe, te las resolvemos.',
  },
  {
    q: '¿Hacen prueba de manejo?',
    a: 'Sí, incluimos prueba de ruta para verificar el desempeño en condiciones reales: ruidos, vibraciones, comportamiento del motor y frenos.',
  },
  {
    q: '¿Inspeccionan cualquier marca y modelo?',
    a: 'Sí. Trabajamos con autos de todas las marcas: japoneses, europeos, coreanos, americanos y chinos. Si tienes dudas sobre un modelo específico, consúltanos.',
  },
];

/* ── Sub-componentes ─────────────────────────────────────────── */
function FaqItem({ q, a }) {
  return (
    <div style={{ borderBottom: '1px solid #ebebeb', padding: '22px 0' }}>
      <div style={{
        fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 600,
        letterSpacing: '1px', color: '#000', marginBottom: 10,
      }}>{q}</div>
      <div style={{
        fontFamily: 'Roboto,sans-serif', fontSize: 14, fontWeight: 300,
        color: 'rgb(102,102,102)', lineHeight: 1.8,
      }}>{a}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════════════ */
export default function InspeccionPreCompra() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'Inspección Pre-Compra — Revillot Garage'; }, []);

  const WA_LINK = "https://wa.me/56934580647?text=Hola%2C%20me%20interesa%20una%20inspecci%C3%B3n%20pre-compra";

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <div className="servicio-hero-outer" style={{
        position: 'relative', width: '100%', height: 560,
        overflow: 'hidden', background: '#080808',
      }}>
        <img
          src="/images/contactanos.jpg"
          alt="Inspección pre-compra Revillot Garage"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)',
        }} />
        <div className="servicio-hero-content" style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center', padding: '0 10%',
        }}>
          <h1 className="servicio-hero-h1" style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 56, fontWeight: 200,
            letterSpacing: '8px', textTransform: 'uppercase', color: '#fff',
            lineHeight: 1.05, marginBottom: 0,
          }}>
            INSPECCIÓN<br /><span style={{ fontWeight: 600 }}>PRE-COMPRA</span>
          </h1>

          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.35)', margin: '26px 0' }} />

          {/* 3 pilares */}
          <div className="insp-hero-pillars" style={{ display: 'flex', gap: 32, marginBottom: 36, flexWrap: 'wrap' }}>
            {['Servicio a domicilio', 'Informe en menos de 1 hora', 'Sin necesidad de estar presente'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 500,
                  letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
                }}>{p}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#fff', color: '#000',
                padding: '15px 30px', textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e0e0e0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >Agendar inspección</a>
            <button
              onClick={() => { document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: 'none', color: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '15px 30px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >Cómo funciona</button>
          </div>
        </div>
      </div>

      {/* ── STAT DESTACADA ── */}
      <div style={{ background: '#f0f0f0', padding: '70px 25px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="insp-stat-num" style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 80, fontWeight: 200,
            letterSpacing: '4px', color: '#000', lineHeight: 1, marginBottom: 20,
          }}>60%</div>
          <h2 style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase', color: '#000', marginBottom: 16,
          }}>de los autos usados en venta tienen problemas ocultos</h2>
          <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', margin: '0 auto 20px' }} />
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgb(102,102,102)', lineHeight: 1.85, marginBottom: 0,
          }}>
            Conocer el estado real del vehículo antes de comprar te permite negociar el precio con fundamento,
            evitar reparaciones inesperadas y tomar la decisión correcta — sin depender de la palabra del vendedor.
          </p>
        </div>
      </div>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <div style={{ padding: '80px 25px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 14,
            }}>Nuestra diferencia</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000',
            }}>¿Por qué nuestra inspección?</h2>
          </div>

          <div className="insp-por-que-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#e8e8e8' }}>
            {POR_QUE.map((p, i) => (
              <div key={i} style={{ background: '#fff', padding: '36px 28px' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 16 }}>{p.icon}</span>
                <div style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                  letterSpacing: '2px', textTransform: 'uppercase', color: '#000', marginBottom: 12,
                }}>{p.titulo}</div>
                <div style={{
                  fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300,
                  color: 'rgb(102,102,102)', lineHeight: 1.8,
                }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <div id="como-funciona" style={{ background: '#f9f9f9', padding: '80px 25px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase',
              color: '#aaa', marginBottom: 14,
            }}>Simple y rápido</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000',
            }}>¿Cómo funciona?</h2>
          </div>

          <div className="insp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#e8e8e8' }}>
            {COMO_FUNCIONA.map((p, i) => (
              <div key={i} style={{ background: '#fff', padding: '40px 32px' }}>
                <div style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 52, fontWeight: 200,
                  color: '#ebebeb', lineHeight: 1, marginBottom: 20,
                }}>{p.n}</div>
                <span style={{ fontSize: 22, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <div style={{
                  fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                  letterSpacing: '2px', textTransform: 'uppercase', color: '#000', marginBottom: 14,
                }}>{p.titulo}</div>
                <div style={{
                  fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300,
                  color: 'rgb(102,102,102)', lineHeight: 1.8,
                }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUÉ INCLUYE EL INFORME ── */}
      <div style={{ background: '#fff', padding: '80px 25px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 14,
            }}>La revisión más completa</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000',
            }}>¿Qué incluye el informe?</h2>
          </div>

          <div className="insp-incluye-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#e8e8e8' }}>
            {INCLUYE.map((bloque, i) => (
              <div key={i} style={{ background: '#fff', padding: '28px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>{bloque.icon}</span>
                  <span style={{
                    fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                    letterSpacing: '2px', textTransform: 'uppercase', color: '#000',
                  }}>{bloque.categoria}</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {bloque.items.map((item, j) => (
                    <li key={j} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      padding: '7px 0',
                      borderBottom: j < bloque.items.length - 1 ? '1px solid #f5f5f5' : 'none',
                    }}>
                      <span style={{ color: '#000', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>✓</span>
                      <span style={{
                        fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300,
                        color: 'rgb(102,102,102)', lineHeight: 1.5,
                      }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24, padding: '20px 28px',
            background: '#f9f9f9', border: '1px solid #e0e0e0',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{
              fontFamily: 'Roboto,sans-serif', fontSize: 13, fontWeight: 300,
              color: '#777', lineHeight: 1.75, margin: 0,
            }}>
              Usamos <strong style={{ fontWeight: 500, color: '#555' }}>escaner profesional</strong> para leer códigos de falla del computador del vehículo,
              incluidos errores borrados recientemente — una práctica común antes de poner un auto a la venta.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: '#f9f9f9', padding: '80px 25px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: 44 }}>
            <div style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
              letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 14,
            }}>Preguntas frecuentes</div>
            <h2 style={{
              fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
              letterSpacing: '6px', textTransform: 'uppercase', color: '#000',
            }}>FAQ</h2>
          </div>
          {FAQ.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#fff', padding: '80px 25px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 9, fontWeight: 600,
            letterSpacing: '5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 16,
          }}>¿Estás pensando en comprar un auto?</div>
          <h2 style={{
            fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 200,
            letterSpacing: '6px', textTransform: 'uppercase', color: '#000', marginBottom: 16,
          }}>AGENDA TU INSPECCIÓN</h2>
          <div style={{ width: 40, height: 1, background: 'rgba(0,0,0,0.2)', margin: '0 auto 20px' }} />
          <p style={{
            fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgb(102,102,102)', lineHeight: 1.85, marginBottom: 36,
          }}>
            Cuéntanos el auto que estás evaluando y coordinamos todo. Vamos donde esté el vehículo.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'Montserrat,sans-serif', fontSize: 10, fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase',
                background: '#000', color: '#fff',
                padding: '16px 32px', textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#000'}
            >Solicitar por WhatsApp</a>
            <button onClick={() => navigate('/contact')}
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
            