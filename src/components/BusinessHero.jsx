import { CalendarCheck, Clock, MapPin, Scissors, UserRound } from 'lucide-react';
import PrimaryButton from './PrimaryButton.jsx';

export default function BusinessHero({ empresa, barbero, onStart }) {
  const title = barbero?.nombre || empresa?.nombre || 'Reserva tu cita';
  const businessName = empresa?.nombre || 'Barbería';
  const imageUrl = empresa?.imagen_url || barbero?.logo_url || empresa?.logo_url;

  return (
    <div className="welcome-screen">
      <p className="brand">Trimly</p>
      <div className="hero-title">
        <h1>{title}</h1>
        <p>{businessName}</p>
      </div>

      {imageUrl ? (
        <img className="hero-image" src={imageUrl} alt={businessName} />
      ) : (
        <div className="hero-placeholder">
          <Scissors size={48} />
        </div>
      )}

      <div className="detail-list">
        <div className="detail-item">
          <Scissors size={17} />
          <span>Especialidad</span>
          <strong>{barbero?.especialidad || empresa?.especialidad || 'Barbería'}</strong>
        </div>
        <div className="detail-item">
          <MapPin size={17} />
          <span>Ubicación</span>
          <strong>{empresa?.ubicacion || 'Por confirmar'}</strong>
        </div>
        <div className="detail-item">
          <UserRound size={17} />
          <span>Barbero</span>
          <strong>{barbero?.nombre || 'Asignado por la barbería'}</strong>
        </div>
      </div>

      <PrimaryButton onClick={onStart}>
        Reservar ahora
        <CalendarCheck size={18} />
      </PrimaryButton>
      <p className="secure-note">Atención por orden de reserva</p>
    </div>
  );
}
