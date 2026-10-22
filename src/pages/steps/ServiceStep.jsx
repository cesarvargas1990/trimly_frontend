import { Scissors } from 'lucide-react';
import AlertMessage from '../../components/AlertMessage.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';

export default function ServiceStep({ services, selectedService, onSelect, onContinue, onBack, loading, error }) {
  return (
    <div className="step-card">
      <StepHeader step="Paso 2 de 5" title="Elige tu servicio" description="Selecciona el servicio que quieres reservar." onBack={onBack} />
      <AlertMessage type="error" message={error} />
      <div className="service-list">
        {services.map((service) => (
          <button key={service.id} type="button" aria-pressed={selectedService?.id === service.id} className={`service-option ${selectedService?.id === service.id ? 'selected' : ''}`} onClick={() => onSelect(service)} disabled={loading}>
            <span className="service-icon"><Scissors size={20} /></span>
            <span className="service-copy"><strong>{service.nombre}</strong></span>
          </button>
        ))}
      </div>
      {!services.length ? <AlertMessage type="info" title="Sin servicios configurados" message="La barbería todavía no ha configurado servicios." /> : null}
      <PrimaryButton disabled={!selectedService || loading} loading={loading} onClick={onContinue}>Continuar</PrimaryButton>
    </div>
  );
}
