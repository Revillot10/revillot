import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HERO_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=90&fm=jpg';

function GroupTitle({ children }) {
  return (
    <div style={{ padding: '56px 0 24px' }}>
      <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: '4px', textTransform: 'uppercase', color: '#000', marginBottom: 10 }}>{children}</h3>
      <div style={{ width: 30, height: 1, background: 'rgba(0,0,0,0.2)' }} />
    </div>
  );
}

function Quote({ children }) {
  return (
    <blockquote style={{
      fontFamily: 'Georgia,serif',
      fontSize: 20,
      fontWeight: 300,
      fontStyle: 'italic',
      color: '#444',
      lineHeight: 1.7,
      borderLeft: '2px solid #000',
      paddingLeft: 24,
      margin: '32px 0',
      maxWidth: 680,
    }}>
      {children}
    </blockquote>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'Montserrat,sans-serif',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: '#000',
      border: '1px solid #000',
      padding: '4px 12px',
      marginRight: 8,
      marginBottom: 8,
    }}>
      {children}
    </span>
  );
}

export default function MeetTheTeam() {
  useEffect(() => { document.title = 'Nuestro Equipo — Revillot Garage'; }, []);
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* Hero */}
      <div className="hero-standard" style={{ position: 'relative', width: '100%', height: 500, overflow: 'hidden', background: '#111' }}>
        <img
          src={HERO_IMG}
          alt="Conoce al equipo"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.82) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 className="servicio-hero-h1" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 56, fontWeight: 200, letterSpacing: '8px', textTransform: 'uppercase', color: '#fff', marginBottom: 16, lineHeight: 1.05 }}>
            CONOCE AL EQUIPO
          </h1>
          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.6)' }} />
          <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.75)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 20 }}>
            Las personas detrás de Revillot Garage
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 25px 100px' }}>

        {/* ── FUNDADOR ── */}
        <GroupTitle>EL FUNDADOR</GroupTitle>

        {/* Foto 1 — presentación */}
        <div className="split-feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f0f0f0' }}>
            <img
              src="/images/tomas1.jpg"
              alt="Tomás Urzúa Revillot"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>

          <div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>
              Fundador
            </div>
            <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 32, fontWeight: 200, letterSpacing: '4px', textTransform: 'uppercase', color: '#000', marginBottom: 24, lineHeight: 1.2 }}>
              Tomás Urzúa<br />Revillot
            </h2>
            <div style={{ width: 30, height: 1, background: 'rgba(0,0,0,0.2)', marginBottom: 28 }} />

            <Quote>
              "Cada vehículo que entra a Revillot Garage pasa por mis manos. No vendemos autos, entregamos confianza."
            </Quote>

            <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300, color: 'rgb(80,80,80)', lineHeight: 1.9, marginBottom: 16 }}>
              Tomás es Ingeniero en Mecánica Automotriz y Electromovilidad, con una formación que une
              el mundo del motor tradicional con las tecnologías eléctricas e híbridas que están
              redefiniendo la industria. Desde joven desarrolló una fascinación genuina por los
              automóviles — no solo como máquinas, sino como expresiones de ingeniería, diseño e historia.
            </p>
            <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300, color: 'rgb(80,80,80)', lineHeight: 1.9, marginBottom: 28 }}>
              Esa pasión fue lo que lo llevó a fundar Revillot Garage en Curicó con una visión
              clara: ofrecer una experiencia de compra premium, honesta y personalizada en el mercado
              de vehículos usados seleccionados.
            </p>

            <div>
              <Pill>Mecánica Automotriz</Pill>
              <Pill>Electromovilidad</Pill>
              <Pill>Vehículos Híbridos</Pill>
              <Pill>Diagnóstico Electrónico</Pill>
            </div>
          </div>
        </div>

        {/* Foto 2 — en acción */}
        <div className="split-feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>
              La filosofía
            </div>
            <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 300, letterSpacing: '3px', textTransform: 'uppercase', color: '#000', marginBottom: 24 }}>
              Pasión que se nota
            </h3>
            <div style={{ width: 30, height: 1, background: 'rgba(0,0,0,0.2)', marginBottom: 28 }} />

            <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300, color: 'rgb(80,80,80)', lineHeight: 1.9, marginBottom: 16 }}>
              Para Tomás, conocer a fondo un vehículo es tan importante como saber presentarlo.
              Su formación técnica le permite inspeccionar personalmente cada auto que ingresa al
              inventario, garantizando que solo vehículos en condiciones óptimas lleguen a manos
              de sus clientes.
            </p>
            <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300, color: 'rgb(80,80,80)', lineHeight: 1.9, marginBottom: 16 }}>
              Apasionado por la electromovilidad, sigue de cerca la transición del mercado chileno
              hacia los vehículos eléctricos e híbridos, y asesora a sus clientes con criterio
              técnico real — no solo con argumentos de venta.
            </p>
            <p style={{ fontFamily: 'Roboto,sans-serif', fontSize: 15, fontWeight: 300, color: 'rgb(80,80,80)', lineHeight: 1.9 }}>
              Revillot Garage nació en Curicó porque Tomás cree que el sur de Chile merece acceder
              a vehículos premium con el mismo nivel de servicio que cualquier concesionario de
              Santiago — y lo está demostrando auto por auto.
            </p>
          </div>

          <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f0f0f0' }}>
            <img
              src="/images/tomas2.jpg"
              alt="Tomás Urzúa Revillot en el taller"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Estadísticas / logros */}
        <div className="stats-bordered-grid-3" style={{ background: '#f8f8f8', padding: '48px 40px', marginBottom: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, textAlign: 'center' }}>
          {[
            { value: '2026', label: 'Año de fundación' },
            { value: '100%', label: 'Inspección técnica en cada vehículo' },
            { value: 'Curicó', label: 'Corazón del negocio' },
          ].map((s, i) => (
            <div key={i} className="stats-bordered-grid-3__item" style={{ padding: '0 20px', borderRight: i < 2 ? '1px solid #ddd' : 'none' }}>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 36, fontWeight: 200, letterSpacing: '4px', color: '#000', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontFamily: 'Roboto,sans-serif', fontSize: 12, fontWeight: 300, color: 'rgb(120,120,120)', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 60, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>
            ¿Quieres conversar con nosotros?
          </div>
          <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 26, fontWeight: 200, letterSpacing: '4px', textTransform: 'uppercase', color: '#000', marginBottom: 28 }}>
            Estamos para ayudarte
          </h3>
          <a
            href="/contact"
            onClick={e => { e.preventDefault(); navigate('/contact'); }}
            style={{
              display: 'inline-block',
              fontFamily: 'Montserrat,sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#fff',
              background: '#000',
              padding: '14px 36px',
              textDecoration: 'none',
            }}
          >
            Contáctanos
          </a>
     