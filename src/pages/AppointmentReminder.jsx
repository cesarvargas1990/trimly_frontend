import { CalendarDays, Clock3, Hash, Phone, Scissors, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage.jsx';
import LayoutMobile from '../components/LayoutMobile.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getDetalleCita } from '../api/trimlyApi.js';
import { formatLongDate } from '../utils/dates.js';

const details = [
  { key: 'codigo', label: 'Codigo', icon: Hash },
  { key: 'cliente', label: 'Cliente', icon: UserRound },
  { key: 'telefono', label: 'Telefono', icon: Phone },
  { key: 'barbero', label: 'Barbero', icon: Scissors },
  { key: 'fecha', label: 'Fecha', icon: CalendarDays, format: formatLongDate },
  { key: 'hora', label: 'Hora', icon: Clock3 },
];

export default function AppointmentReminder() {
  const { codigo } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadAppointment() {
      if (!codigo) {
        setError('Abre el enlace con el codigo de tu cita.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await getDetalleCita(codigo);

        if (!alive) return;
        setAppointment(data?.cita || null);
      } catch {
        if (!alive) return;
        setError('No encontramos una cita con ese codigo.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAppointment();

    return () => {
      alive = false;
    };
  }, [codigo]);

  if (loading) {
    return (
      <LayoutMobile>
        <p className="brand">Trimly</p>
        <LoadingState message="Cargando cita..." />
      </LayoutMobile>
    );
  }

  if (error || !appointment) {
    return (
      <LayoutMobile>
        <div className="centered-step">
          <p className="brand">Trimly</p>
          <AlertMessage type="error" title="Cita no encontrada" message={error} />
        </div>
      </LayoutMobile>
    );
  }

  const businessName = appointment?.empresa?.nombre || 'Prestigio Barber';

  return (
    <LayoutMobile>
      <section className="appointment-reminder">
        <div className="reminder-brand">
          {appointment?.empresa?.logo_url ? (
            <img src={appointment.empresa.logo_url} alt={businessName} />
          ) : (
            <span>T</span>
          )}
        </div>

        <div className="reminder-heading">
          <p className="brand">Trimly</p>
          <h1>Recordatorio de cita</h1>
          <p>Tu cita esta proxima.</p>
        </div>

        <div className="reminder-details" aria-label="Detalles de la cita">
          {details.map(({ key, label, icon: Icon, format }) => {
            const value = appointment[key];
            return (
              <div className="reminder-row" key={key}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                <strong>{format ? format(value) : value}</strong>
              </div>
            );
          })}
        </div>

        <p className="reminder-footer">Enviado por {businessName}.</p>
      </section>
    </LayoutMobile>
  );
}
