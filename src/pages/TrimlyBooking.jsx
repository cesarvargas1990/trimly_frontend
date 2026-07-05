import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage.jsx';
import LayoutMobile from '../components/LayoutMobile.jsx';
import LoadingState from '../components/LoadingState.jsx';
import {
  confirmarCita,
  getDisponibilidad,
  getEmpresa,
  getFechasDisponibles,
  preconfirmarCita,
  registrarCliente,
  verificarCliente,
} from '../api/trimlyApi.js';
import CalendarStep from './steps/CalendarStep.jsx';
import PhoneStep from './steps/PhoneStep.jsx';
import PreConfirmStep from './steps/PreConfirmStep.jsx';
import RegisterStep from './steps/RegisterStep.jsx';
import SuccessStep from './steps/SuccessStep.jsx';
import TimeSlotsStep from './steps/TimeSlotsStep.jsx';
import WelcomeStep from './steps/WelcomeStep.jsx';
import { isPastDateKey } from '../utils/dates.js';
import { normalizeTimeForApi } from '../utils/time.js';

const initialBooking = {
  empresa: null,
  barbero: null,
  telefono: '',
  bookingSession: '',
  nombre: '',
  email: '',
  fechasDisponibles: [],
  fechaSeleccionada: '',
  horasDisponibles: [],
  horaSeleccionada: null,
  preconfirmacion: null,
  citaConfirmada: null,
};

const friendlyErrors = {
  loadBusiness: 'No pudimos cargar esta agenda. Revisa el enlace o intenta nuevamente.',
  verifyPhone: 'No pudimos verificar tu teléfono. Intenta nuevamente.',
  register: 'No pudimos completar tu registro. Revisa tus datos e intenta de nuevo.',
  dates: 'No pudimos cargar las fechas disponibles.',
  hours: 'No pudimos cargar los horarios disponibles.',
  preconfirm: 'No pudimos validar este horario. Intenta nuevamente o elige otro.',
  confirm: 'No pudimos confirmar la cita. Intenta nuevamente.',
};

async function filterDatesWithAvailability({ fechas, publicToken }) {
  const futureDates = fechas.filter((fecha) => !isPastDateKey(fecha));
  const results = await Promise.all(
    futureDates.map(async (fecha) => {
      try {
        const data = await getDisponibilidad({ fecha, publicToken });
        return Array.isArray(data?.horas) && data.horas.length > 0 ? fecha : null;
      } catch {
        return null;
      }
    }),
  );

  return results.filter(Boolean);
}

function getFriendlyError(error, fallback) {
  if (error?.message && error.message !== 'No pudimos completar la solicitud.') {
    return error.message;
  }

  return fallback;
}

export default function TrimlyBooking() {
  const { publicToken } = useParams();
  const [step, setStep] = useState('loading');
  const [state, setState] = useState(initialBooking);
  const [loading, setLoading] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [error, setError] = useState('');

  const isInactive = useMemo(() => state.activo === false, [state.activo]);

  useEffect(() => {
    let alive = true;

    async function loadBusiness() {
      if (!publicToken) {
        setStep('missing-token');
        setLoadingBusiness(false);
        return;
      }

      try {
        setLoadingBusiness(true);
        setError('');
        const data = await getEmpresa(publicToken);

        if (!alive) return;

        setState((current) => ({
          ...current,
          empresa: data?.empresa || null,
          barbero: data?.barbero || null,
          activo: data?.activo,
        }));
        setStep('welcome');
      } catch {
        if (!alive) return;
        setError(friendlyErrors.loadBusiness);
        setStep('load-error');
      } finally {
        if (alive) setLoadingBusiness(false);
      }
    }

    loadBusiness();

    return () => {
      alive = false;
    };
  }, [publicToken]);

  async function loadDates(nextStep = 'calendar') {
    setLoading(true);
    setError('');

    try {
      const data = await getFechasDisponibles(publicToken);
      const fechas = Array.isArray(data?.fechas) ? data.fechas : [];
      const fechasConHorarios = await filterDatesWithAvailability({ fechas, publicToken });

      setState((current) => ({
        ...current,
        fechasDisponibles: fechasConHorarios,
        fechaSeleccionada: '',
        horaSeleccionada: null,
        horasDisponibles: [],
      }));
      setStep(nextStep);
    } catch {
      setError(friendlyErrors.dates);
      setStep('calendar');
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneSubmit(telefono) {
    setLoading(true);
    setError('');

    try {
      const data = await verificarCliente({ telefono, publicToken });
      setState((current) => ({
        ...current,
        telefono,
        bookingSession: data?.booking_session || current.bookingSession,
      }));

      if (data?.exists) {
        await loadDates();
      } else {
        setStep('register');
      }
    } catch {
      setError(friendlyErrors.verifyPhone);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit({ nombre, email }) {
    setLoading(true);
    setError('');

    try {
      const data = await registrarCliente({
        bookingSession: state.bookingSession,
        nombre,
        telefono: state.telefono,
        email,
        publicToken,
      });

      if (!data?.registered) {
        setError(friendlyErrors.register);
        return;
      }

      setState((current) => ({
        ...current,
        nombre,
        email,
        bookingSession: data?.booking_session || current.bookingSession,
      }));
      await loadDates();
    } catch {
      setError(friendlyErrors.register);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectDate(fecha) {
    setState((current) => ({
      ...current,
      fechaSeleccionada: fecha,
      horaSeleccionada: null,
      horasDisponibles: [],
      preconfirmacion: null,
    }));
    setLoading(true);
    setError('');

    try {
      const data = await getDisponibilidad({ fecha, publicToken });
      const horas = Array.isArray(data?.horas) ? data.horas : [];

      if (!horas.length) {
        setState((current) => ({
          ...current,
          fechasDisponibles: current.fechasDisponibles.filter((dateKey) => dateKey !== fecha),
          fechaSeleccionada: '',
          horaSeleccionada: null,
          horasDisponibles: [],
        }));
        setError('Esta fecha ya no tiene horarios disponibles. Elige otro día.');
        setStep('calendar');
        return;
      }

      setState((current) => ({
        ...current,
        horasDisponibles: horas,
      }));
      setStep('times');
    } catch {
      setError(friendlyErrors.hours);
      setStep('times');
    } finally {
      setLoading(false);
    }
  }

  async function handlePreconfirm() {
    if (!state.horaSeleccionada || loading) return;

    setLoading(true);
    setError('');

    try {
      const data = await preconfirmarCita({
        bookingSession: state.bookingSession,
        fecha: state.fechaSeleccionada,
        hora: normalizeTimeForApi(state.horaSeleccionada),
        publicToken,
      });

      setState((current) => ({
        ...current,
        preconfirmacion: data || {},
      }));
      setStep('preconfirm');
    } catch (requestError) {
      setState((current) => ({
        ...current,
        horaSeleccionada: null,
      }));
      setError(getFriendlyError(requestError, friendlyErrors.preconfirm));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    setError('');

    try {
      const data = await confirmarCita({
        bookingSession: state.bookingSession,
        fecha: state.fechaSeleccionada,
        hora: normalizeTimeForApi(state.horaSeleccionada),
        publicToken,
      });

      setState((current) => ({
        ...current,
        citaConfirmada: data,
      }));
      setStep('success');
    } catch {
      setError(friendlyErrors.confirm);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setState((current) => ({
      ...initialBooking,
      empresa: current.empresa,
      barbero: current.barbero,
      activo: current.activo,
    }));
    setError('');
    setStep('welcome');
  }

  if (loadingBusiness) {
    return (
      <LayoutMobile>
        <p className="brand">Trimly</p>
        <LoadingState message="Preparando agenda..." />
      </LayoutMobile>
    );
  }

  if (step === 'missing-token' || step === 'load-error') {
    return (
      <LayoutMobile>
        <div className="centered-step">
          <p className="brand">Trimly</p>
          <AlertMessage
            type="error"
            title={step === 'missing-token' ? 'Link incompleto' : 'Agenda no encontrada'}
            message={step === 'missing-token' ? 'Abre el enlace personalizado de tu barbero.' : error}
          />
        </div>
      </LayoutMobile>
    );
  }

  return (
    <LayoutMobile>
      {step === 'welcome' ? (
        <WelcomeStep
          empresa={state.empresa}
          barbero={state.barbero}
          inactive={isInactive}
          onStart={() => setStep('phone')}
        />
      ) : null}

      {step === 'phone' ? (
        <PhoneStep
          onSubmit={handlePhoneSubmit}
          onBack={() => setStep('welcome')}
          loading={loading}
          error={error}
        />
      ) : null}

      {step === 'register' ? (
        <RegisterStep
          onSubmit={handleRegisterSubmit}
          onBack={() => setStep('phone')}
          loading={loading}
          error={error}
        />
      ) : null}

      {step === 'calendar' ? (
        <CalendarStep
          fechas={state.fechasDisponibles}
          selectedDate={state.fechaSeleccionada}
          onSelectDate={handleSelectDate}
          onBack={() => setStep('phone')}
          loading={loading}
          error={error}
        />
      ) : null}

      {step === 'times' ? (
        <TimeSlotsStep
          fecha={state.fechaSeleccionada}
          horas={state.horasDisponibles}
          selectedHour={state.horaSeleccionada}
          onSelectHour={(hora) => setState((current) => ({ ...current, horaSeleccionada: hora }))}
          onContinue={handlePreconfirm}
          onBack={() => setStep('calendar')}
          loading={loading}
          error={error}
        />
      ) : null}

      {step === 'preconfirm' ? (
        <PreConfirmStep
          empresa={state.empresa}
          barbero={state.barbero}
          fecha={state.fechaSeleccionada}
          hora={state.horaSeleccionada}
          preconfirmacion={state.preconfirmacion}
          onConfirm={handleConfirm}
          onChangeTime={() => setStep('times')}
          onBack={() => setStep('times')}
          loading={loading}
          error={error}
        />
      ) : null}

      {step === 'success' ? (
        <SuccessStep
          citaConfirmada={state.citaConfirmada}
          empresa={state.empresa}
          barbero={state.barbero}
          onRestart={restart}
        />
      ) : null}
    </LayoutMobile>
  );
}
