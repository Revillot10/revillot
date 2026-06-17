import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { articlesApi } from '../services/api';

const HERO_IMG = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80';

const FALLBACK = {
  'mercado-premium-chile-2026': {
    title: 'El mercado de vehículos premium en Chile: tendencias 2026',
    excerpt: 'Analizamos cómo está evolucionando el mercado automotriz premium en Chile, qué marcas lideran y qué esperar para los próximos meses.',
    cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    published_at: '2026-05-10T00:00:00Z',
    content: `El mercado automotriz chileno ha experimentado una transformación notable en los últimos años. La demanda por vehículos premium y semi-premium creció un 18% en 2025 respecto al año anterior, y las proyecciones para 2026 son aún más optimistas.

**¿Qué está impulsando este crecimiento?**

Varios factores confluyen para explicar este fenómeno. En primer lugar, la estabilización del tipo de cambio ha permitido que los precios de importación se mantengan más predecibles, facilitando la planificación tanto de concesionarios como de compradores. En segundo lugar, una clase media consolidada con mayor poder adquisitivo está migrando desde segmentos masivos hacia vehículos con mejor equipamiento, mayor confort y mayor valor de reventa.

**Las marcas que lideran**

BMW, Mercedes-Benz y Audi continúan dominando el segmento premium, pero enfrentan una competencia creciente de Volvo, que ha ganado terreno significativo gracias a su propuesta de valor centrada en seguridad y diseño escandinavo. Lexus, por su parte, consolida su posición como la opción premium japonesa de referencia.

En el segmento semi-premium, marcas como Mazda (con su línea CX) y Volkswagen (Golf GTI, Tiguan) capturan a compradores que buscan calidad europea sin el precio de entrada del lujo puro.

**El rol del mercado de usados seleccionados**

Aquí es donde surge una oportunidad concreta: los vehículos premium de segunda mano con baja kilometración y mantención al día representan hoy una de las mejores inversiones del mercado automotriz chileno. Un BMW Serie 3 de 2022 con 30.000 km puede adquirirse a un 35-40% menos de su precio de lista original, manteniendo la garantía de fábrica en muchos casos.

En Revillot Garage seleccionamos cada vehículo de nuestro inventario con criterio técnico, priorizando historial de mantención verificable y estado mecánico impecable. Porque creemos que el lujo no debería ser sinónimo de incertidumbre.

**¿Qué esperar para el segundo semestre de 2026?**

Los analistas del sector proyectan una moderación en el crecimiento, principalmente por el impacto de la nueva normativa de emisiones que entrará en vigor en julio. Esto podría generar una oportunidad de compra interesante en el corto plazo, especialmente en modelos de combustión interna que buscarán salir del mercado antes de los ajustes regulatorios.

Si estás considerando comprar un vehículo premium en los próximos meses, este puede ser un momento especialmente conveniente para actuar.`,
  },
  'guia-comprar-auto-usado-premium': {
    title: 'Guía completa: cómo comprar un auto usado premium sin arriesgar tu inversión',
    excerpt: 'Todo lo que debes revisar, preguntar y considerar antes de comprar un vehículo premium de segunda mano en Chile.',
    cover_image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80',
    published_at: '2026-04-22T00:00:00Z',
    content: `Comprar un auto usado premium puede ser una de las mejores decisiones financieras que tomes — o una de las peores, dependiendo de cómo te prepares. En Revillot Garage llevamos años evaluando vehículos de este segmento, y en esta guía compartimos todo lo que sabemos.

**1. Define tu presupuesto total, no solo el precio del auto**

El precio de compra es solo el comienzo. Considera también: seguro automotriz (los vehículos premium tienen primas más altas), mantención (filtros, neumáticos y frenos de marcas premium son significativamente más caros), revisión técnica y posibles reparaciones iniciales, y traspaso con gastos notariales (aproximadamente 1-2% del valor del vehículo).

Una regla general: presupuesta un 10-15% adicional sobre el precio de compra para el primer año.

**2. Verifica el historial de mantención**

Este es el paso más importante y el que más se omite. Exige la libreta de mantención o registros del servicio oficial. Un BMW o Mercedes sin mantención en red oficial es una señal de alerta importante. Idealmente, busca vehículos con servicio completo en concesionario autorizado hasta al menos los 50.000 km.

**3. Solicita un informe del Registro Civil**

En Chile, el Registro Civil permite verificar si el vehículo tiene deudas de patente, multas pendientes, prendas o anotaciones. Este trámite es gratuito y puede evitarte problemas serios.

**4. La inspección técnica independiente es obligatoria**

Nunca compres un auto usado premium sin una inspección técnica independiente, aunque el vendedor te diga que está perfecto. Un mecánico especializado puede identificar reparaciones de carrocería, problemas en la suspensión, filtraciones o fallas electrónicas que no son visibles a simple vista. El costo de una inspección oscila entre $30.000 y $80.000 pesos. Es la mejor inversión que puedes hacer antes de firmar.

**5. Ojo con los precios demasiado bajos**

En el mercado premium, un precio significativamente inferior al valor de mercado casi siempre esconde algo: un siniestro no declarado, un problema mecánico conocido por el vendedor, o una deuda asociada al vehículo. Usa plataformas como Chileautos o AutoScout24 para comparar precios de referencia.

**6. Prefiere vendedores con respaldo**

Comprar a un particular tiene sus ventajas en precio, pero también implica asumir todos los riesgos. Un concesionario especializado ofrece garantía, traspaso gestionado, y en muchos casos inspección técnica certificada incluida. El diferencial de precio suele estar más que justificado por la tranquilidad que entrega.

**En resumen**

La compra perfecta de un auto usado premium combina: presupuesto realista, historial verificado, inspección independiente, precio de mercado coherente y un vendedor con respaldo. Si todos esos elementos están presentes, es muy probable que estés frente a una buena inversión.`,
  },
  'electromovilidad-chile-oportunidad': {
    title: 'Electromovilidad en Chile: ¿es el momento de dar el salto?',
    excerpt: 'Los vehículos eléctricos e híbridos premium están llegando al mercado chileno con fuerza. Analizamos si vale la pena dar el paso hoy.',
    cover_image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1400&q=80',
    published_at: '2026-03-15T00:00:00Z',
    content: `La transición hacia la movilidad eléctrica ya no es una promesa futura en Chile: es una realidad que avanza a paso firme. Durante 2025, las ventas de vehículos eléctricos e híbridos crecieron un 42% respecto al año anterior, y el segmento premium lidera esta adopción.

**El estado actual del mercado eléctrico premium en Chile**

BMW, Mercedes-Benz, Volvo y Audi encabezan la oferta de vehículos eléctricos y plug-in híbridos premium disponibles hoy en Chile. El BMW iX3, el Volvo XC40 Recharge y el Mercedes EQB son los modelos con mejor relación precio-autonomía del segmento. En el mercado de usados, ya empiezan a aparecer primeras generaciones de estos modelos a precios muy competitivos, lo que abre una oportunidad interesante para quienes quieren entrar a la electromovilidad sin pagar precio de lista.

**Las preguntas que todos se hacen**

¿Dónde cargo? La red de carga pública en Chile ha crecido considerablemente, especialmente en el eje Santiago-Valparaíso-Maule. En el contexto de Curicó y la Región del Maule, la carga domiciliaria nocturna sigue siendo la solución más práctica para el uso cotidiano.

¿Cuánto ahorro en combustible? Un vehículo eléctrico recorre aproximadamente 100 km con el equivalente energético de $1.500-$2.000 pesos en electricidad residencial, versus los $8.000-$12.000 de un vehículo a gasolina. El ahorro es real y significativo a mediano plazo.

¿Cómo se mantiene? Los vehículos eléctricos tienen menos piezas móviles que los de combustión interna, lo que se traduce en menores costos de mantención. Sin embrague, sin cambio de aceite, sin filtros de combustible.

**Los híbridos como puerta de entrada**

Para quienes no están listos para dar el salto total a la electricidad, los híbridos enchufables (PHEV) representan una excelente transición. Permiten manejar en modo eléctrico para trayectos urbanos cortos y usar el motor a gasolina para viajes más largos, eliminando la ansiedad por autonomía. Marcas como Volvo y BMW ofrecen versiones PHEV de sus SUV más populares, con autonomías eléctricas de 40-60 km que cubren perfectamente la mayoría de los desplazamientos cotidianos.

**¿Es hoy el momento?**

Si vas a usar el vehículo principalmente en la ciudad y tienes acceso a carga en tu hogar o trabajo: sí, el momento es ahora. La tecnología es madura, los precios están bajando y los incentivos tributarios vigentes hacen que la ecuación financiera sea cada vez más favorable.

En Revillot Garage seguimos de cerca esta transición. La formación técnica en electromovilidad de nuestro equipo nos permite asesorarte con criterio real sobre qué opción calza mejor con tu estilo de vida y tus necesidades de movilidad.`,
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderContent(text) {
  if (!text) return null;
  return text.split('\n\n').map((block, i) => {
    if (block.startsWith('**') && block.endsWith('**')) {
      return (
        <h3 key={i} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:12, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#000', margin:'40px 0 14px', paddingTop:8, borderTop:'0.5px solid #e8e8e8' }}>
          {block.replace(/\*\*/g, '')}
        </h3>
      );
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ fontFamily:"'Roboto',sans-serif", fontSize:16, fontWeight:300, color:'rgb(55,55,55)', lineHeight:1.95, marginBottom:22 }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ fontWeight:500, color:'#000' }}>{part.replace(/\*\*/g,'')}</strong>
            : part
        )}
      </p>
    );
  });
}

export default function ArticleDetail() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    articlesApi.getOne(slug)
      .then(r => { setArticle(r.data); setLoading(false); })
      .catch(() => {
        const fb = FALLBACK[slug];
        setArticle(fb || null);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    document.title = article?.title ? `${article.title} — Revillot Garage` : 'Insights — Revillot Garage';
  }, [article]);

  return (
    <>
      <Header />

      {/* ── Hero compartido con Insights ── */}
      <div style={{ width:'100%', height:340, overflow:'hidden', position:'relative', background:'#000' }}>
        <img
          src={HERO_IMG}
          alt="Revillot Insights"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 40%', opacity:0.38, filter:'blur(2px)', transform:'scale(1.05)' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 40px', textAlign:'center' }}>
          <p style={{ fontFamily:"'Roboto',sans-serif", fontSize:16, fontWeight:300, color:'rgba(255,255,255,0.85)', lineHeight:1.9, maxWidth:680, margin:0 }}>
            En Revillot Garage compartimos nuestra visión del mercado automotriz premium en Chile.
            Analizamos tendencias, vehículos destacados y todo lo que necesitas saber para tomar
            la mejor decisión en tu próxima compra.
          </p>
        </div>
      </div>

      {/* ── Contenido del artículo ── */}
      {loading ? (
        <div style={{ minHeight:'50vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:'3px', color:'#bbb' }}>CARGANDO...</span>
        </div>
      ) : !article ? (
        <div style={{ minHeight:'50vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, textAlign:'center', padding:40 }}>
          <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:'3px', color:'#999' }}>ARTÍCULO NO ENCONTRADO</span>
          <button onClick={() => navigate('/insights')} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', background:'#000', color:'#fff', border:'none', padding:'12px 28px', cursor:'pointer' }}>
            ← Volver a Insights
          </button>
        </div>
      ) : (
        <div style={{ maxWidth:780, margin:'0 auto', padding:'64px 25px 100px' }}>

          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:40 }}>
            <button onClick={() => navigate('/insights')} style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#999', background:'none', border:'none', cursor:'pointer', padding:0 }}>
              INSIGHTS
            </button>
            <span style={{ color:'#ccc', fontSize:11 }}>›</span>
            <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:'1px', color:'#ccc', textTransform:'uppercase' }}>
              {(article.title || '').substring(0, 45)}{article.title?.length > 45 ? '...' : ''}
            </span>
          </div>

          {/* Imagen de portada del artículo */}
          {article.cover_image && (
            <div style={{ width:'100%', height:420, overflow:'hidden', marginBottom:48, background:'#f0f0f0' }}>
              <img src={article.cover_image} alt={article.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="eager" />
            </div>
          )}

          {/* Fecha */}
          {article.published_at && (
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:500, letterSpacing:'3px', textTransform:'uppercase', color:'#aaa', marginBottom:16 }}>
              {formatDate(article.published_at)}
            </div>
          )}

          {/* Título */}
          <h1 style={{ fontFamily:"'Montserrat',sans-serif", fontSize:28, fontWeight:300, letterSpacing:'1px', color:'#000', lineHeight:1.4, marginBottom:20, margin:'0 0 20px' }}>
            {article.title}
          </h1>

          {/* Línea */}
          <div style={{ width:30, height:'0.5px', background:'#000', margin:'0 0 32px' }} />

          {/* Excerpt */}
          {article.excerpt && (
            <blockquote style={{ fontFamily:"'Georgia',serif", fontSize:17, fontWeight:300, fontStyle:'italic', color:'rgb(80,80,80)', lineHeight:1.85, borderLeft:'2px solid #000', paddingLeft:22, margin:'0 0 44px' }}>
              {article.excerpt}
            </blockquote>
          )}

          {/* Cuerpo */}
          <div>{renderContent(article.content)}</div>

          {/* Firma */}
          <div style={{ borderTop:'0.5px solid #e8e8e8', marginTop:64, paddingTop:32, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:46, height:46, borderRadius:'50%', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:13, fontWeight:500, color:'#fff' }}>TU</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'#000' }}>
                Tomás Urzúa Revillot
              </div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:12, fontWeight:300, color:'#999', marginTop:3 }}>
                Fundador — Revillot Garage · Técnico en Electromovilidad Automotriz
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <div style={{ marginTop:52, textAlign:'center' }}>
            <button
              onClick={() => navigate('/insights')}
              style={{ fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', background:'none', color:'#000', border:'1px solid #000', padding:'13px 36px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#000'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#000'; }}
            >
              ← Volver a Insights
            </button>
          </div>

        </div>
      )}

      <Footer />
    </>
  );
}
