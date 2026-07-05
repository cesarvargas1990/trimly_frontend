import { CalendarDays, Clock, Scissors, UserRound } from 'lucide-react';
import AlertMessage from '../../components/AlertMessage.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';
import { formatLongDate } from '../../utils/dates.js';

export default function PreConfirmStep({
  empresa,
  barbero,
  fecha,
  hora,
  preconfirmacion,
  onConfirm,
  onChangeTime,
  onBack,
  loading,
  error,
}) {
  return (
    <div className="step-card">
      <StepHeader
        step="Paso 4 de 4"
        title="Confirma tu cita"
        description="Revisa los detalles y confirma tu reserva."
        onBack={onBack}
      />

      <div className="summary-box">
        <SummaryItem icon={Scissors} label="Barbería" value={empresa?.nombre || 'Barbería'} />
        <SummaryItem icon={UserRound} label="Barbero" value={barbero?.nombre || 'Asignado'} />
        <SummaryItem icon={CalendarDays} label="Fecha" value={formatLongDate(fecha)} />
        <SummaryItem icon={Clock} label="Hora" value={hora?.label} />
      </div>

      <AlertMessage type="error" message={error} />
      <PrimaryButton onClick={onConfirm} loading={loading}>Confirmar cita</PrimaryButton>
      <PrimaryButton variant="secondary" onClick={onChangeTime} disabled={loading}>
        Cambiar horario
      </PrimaryButton>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="summary-item">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value || 'Por confirmar'}</strong>
    </div>
  );
}
