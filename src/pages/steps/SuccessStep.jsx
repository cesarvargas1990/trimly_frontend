import { Check, CalendarDays, Clock, Hash, Scissors, Timer, UserRound, Phone } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import { formatLongDate } from '../../utils/dates.js';

export default function SuccessStep({ citaConfirmada, onRestart }) {
  const cita = citaConfirmada?.cita || {};

  return (
    <div className="success-screen">
      <p className="brand">Trimly</p>
      <div className="success-icon">
        <Check size={42} />
      </div>
      <h1>¡Cita confirmada!</h1>
      <p>Tu cita fue agendada correctamente.</p>

      <div className="summary-box">
        <SummaryItem icon={Hash} label="Código" value={citaConfirmada?.codigo} />
        <SummaryItem icon={UserRound} label="Cliente" value={cita.cliente} />
        <SummaryItem icon={Phone} label="Teléfono" value={cita.telefono} />
        <SummaryItem icon={Scissors} label="Barbero" value={cita.barbero} />
        <SummaryItem icon={CalendarDays} label="Fecha" value={formatDate(cita.fecha)} />
        <SummaryItem icon={Clock} label="Hora" value={cita.hora} />
        {cita.duracion ? <SummaryItem icon={Timer} label="Duración" value={`${cita.duracion} min`} /> : null}
      </div>

      <p className="telegram-note">Te enviaremos los detalles de tu cita por Telegram.</p>
      <PrimaryButton onClick={onRestart}>Volver al inicio</PrimaryButton>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="summary-item">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(dateKey) {
  if (!dateKey) return '';
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? formatLongDate(dateKey) : dateKey;
}
