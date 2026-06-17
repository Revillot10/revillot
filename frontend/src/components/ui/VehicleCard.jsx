import { useNavigate } from 'react-router-dom';

const fmtPrice = (price) => {
  if (!price) return 'POA';
  return `$${Number(price).toLocaleString('es-CL')}`;
};

export default function VehicleCard({ vehicle }) {
  const navigate    = useNavigate();
  const primaryImg  = vehicle.images?.find(i => i.isPrimary || i.is_primary) || vehicle.images?.[0];
  const goDetail    = () => navigate(`/vehicles/${vehicle.id}`);

  return (
    <div className="vehicle-card" onClick={goDetail}>

      {/* ── Título — Real: fontSize=14px, fontWeight=500, letterSpacing=2px
          height fija=23px (1 línea) → la imagen siempre empieza en el mismo sitio
          make + model inline, variant también inline (todo en una línea) ── */}
      <div className="vehicle-card__title">
        <span className="vehicle-card__make">{vehicle.brand_name}</span>
        {' '}
        <span className="vehicle-card__model">{vehicle.model}</span>
        {vehicle.variant && (
          <>
            {' '}
            <span className="vehicle-card__variant">{vehicle.variant}</span>
          </>
        )}
      </div>

      {/* ── Imagen — Real: height=214px, width=100% ── */}
      <div className="vehicle-card__images">
        {primaryImg ? (
          <img
            src={primaryImg.url}
            alt={`${vehicle.brand_name} ${vehicle.model}`}
            loading="lazy"
          />
        ) : (
          <div className="vehicle-card__no-image">
            <span className="material-icons">directions_car</span>
          </div>
        )}
      </div>

      {/* ── Detalles — Real: padding=13px 0 28px ── */}
      <div className="vehicle-card__details">

        {/* Precio — Real: en la misma fila que el año (o arriba) */}
        <div className="vehicle-card__price-row">
          <div className="vehicle-card__price">{fmtPrice(vehicle.price)}</div>
          {vehicle.status && vehicle.status !== 'available' && (
            <div className="vehicle-card__status-badge">
              {vehicle.status === 'under_offer' ? 'UNDER OFFER'  :
               vehicle.status === 'reserved'    ? 'RESERVADO'    :
               vehicle.status === 'sold'        ? 'VENDIDO'      : ''}
            </div>
          )}
        </div>

        {/* Specs — Real: display=flex, label width=98px fijo, fontSize=14px */}
        <div className="vehicle-card__specs">
          <div className="vehicle-card__spec">
            <span className="vehicle-card__spec-label">AÑO</span>
            <span className="vehicle-card__spec-value">{vehicle.year}</span>
          </div>
          {vehicle.colour && (
            <div className="vehicle-card__spec">
              <span className="vehicle-card__spec-label">COLOR</span>
              <span className="vehicle-card__spec-value">{vehicle.colour}</span>
            </div>
          )}
          {vehicle.mileage !== undefined && vehicle.mileage !== null && (
            <div className="vehicle-card__spec">
              <span className="vehicle-card__spec-label">KM</span>
              <span className="vehicle-card__spec-value">
                {Number(vehicle.mileage).toLocaleString('es-CL')}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* ── Botón — Real: borderTop=1px solid #000, padding=30px 10px 10px
          botón: width=220px, height=50px, display=flex, justifyContent=center ── */}
      <div className="vehicle-card__show">
        <button
          className="vehicle-card__btn"
          onClick={e => { e.stopPropagation(); goDetail(); }}
        >
          VER VEHÍCULO
        </button>
      </div>

    </div>
  );
}

