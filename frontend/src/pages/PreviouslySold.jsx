import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { vehiclesApi } from '../services/api';

const HERO_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=90&fm=jpg';

export default function PreviouslySold() {
  useEffect(() => { document.title = 'Vehículos Vendidos — Revillot Garage'; }, []);
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    vehiclesApi.getAll({ status: 'sold', limit: 48, sort: 'newest' })
      .then(r => setVehicles(r.data.vehicles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      {/* Hero */}
      <div style={{ position:'relative', width:'100%', height:400, overflow:'hidden', background:'#111' }}>
        <img src={HERO_IMG} alt="Vehículos Vendidos" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:1, display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontSize:42, fontWeight:200, letterSpacing:'10px', textTransform:'uppercase', color:'#fff', marginBottom:16, textShadow:'0 2px 20px rgba(0,0,0,0.4)' }}>VENDIDOS</h1>
          <div style={{ width:60, height:1, background:'rgba(255,255,255,0.6)', marginBottom:20 }} />
          <p style={{ fontFamily:'Roboto,sans-serif', fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.85)', letterSpacing:'1px' }}>
            Galería de vehículos que han pasado por Revillot Garage
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1600, margin:'0 auto', padding:'50px 25px 80px' }}>

        {/* Heading */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:'Montserrat,sans-serif', fontSize:28, fontWeight:300, letterSpacing:'8px', textTransform:'uppercase', color:'#000', marginBottom:14 }}>
            GALERÍA DE VENDIDOS
          </h2>
          <div style={{ width:40, height:1, background:'#000', margin:'0 auto' }} />
        </div>

        {loading ? (
          <div className="loading" />
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', fontFamily:'Montserrat,sans-serif', fontSize:11, letterSpacing:'3px', textTransform:'uppercase', color:'#999' }}>
            No hay vehículos vendidos aún
          </div>
        ) : (
          <div className="sold-gallery-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:30 }}>
            {vehicles.map(v => {
              const img = v.images?.find(i => i.isPrimary || i.is_primary) || v.images?.[0];
              const name = `${v.brand_name || ''} ${v.model || ''}`.trim();
              return (
                <div key={v.id} style={{ cursor:'pointer', position:'relative' }}
                  onClick={() => navigate(`/vehicles/${v.id}`)}>
                  {/* Imagen */}
                  <div style={{ width:'100%', height:200, overflow:'hidden', background:'#0a0a0a', position:'relative' }}>
                    {img
                      ? <img src={img.url} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'grayscale(30%)', transition:'all 0.4s' }}
                          onMouseOver={e=>{e.target.style.filter='grayscale(0%)';e.target.style.transform='scale(1.04)';}}
                          onMouseOut={e=>{e.target.style.filter='grayscale(30%)';e.target.style.transform='scale(1)';}}
                          loading="lazy" />
                      : <div style={{ width:'100%', height:'100%', background:'#1a1a1a' }} />
                    }
                    {/* Badge VENDIDO */}
                    <div style={{ position:'absolute', top:10, right:10, background:'#000', color:'#fff', fontFamily:'Montserrat,sans-serif', fontSize:9, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', padding:'4px 10px' }}>
                      VENDIDO
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding:'12px 0 8px' }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontSize:12, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color:'#000', marginBottom:4 }}>
                      {name}
                      {v.variant && <div style={{ fontSize:11, letterSpacing:'1.5px' }}>{v.variant}</div>}
                    </div>
                    <div style={{ fontFamily:'Roboto,sans-serif', fontSize:13, fontWeight:300, color:'rgb(102,102,102)' }}>
                      {v.year} · {v.colour}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
