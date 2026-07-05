import AlertMessage from '../../components/AlertMessage.jsx';
import BusinessHero from '../../components/BusinessHero.jsx';

export default function WelcomeStep({ empresa, barbero, inactive, onStart }) {
  if (inactive) {
    return (
      <div className="centered-step">
        <p className="brand">Trimly</p>
        <AlertMessage
          type="info"
          title="Agenda no disponible"
          message="Esta agenda no está activa en este momento. Intenta más tarde o contacta directamente a la barbería."
        />
      </div>
    );
  }

  return <BusinessHero empresa={empresa} barbero={barbero} onStart={onStart} />;
}
