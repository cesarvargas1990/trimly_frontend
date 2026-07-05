import AlertMessage from '../../components/AlertMessage.jsx';
import LoadingState from '../../components/LoadingState.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';
import { formatLongDate } from '../../utils/dates.js';

export default function TimeSlotsStep({
  fecha,
  horas,
  selectedHour,
  onSelectHour,
  onContinue,
  onBack,
  loading,
  error,
}) {
  return (
    <div className="step-card time-slots-card">
      <StepHeader
        step="Paso 3 de 4"
        title="Horarios disponibles"
        description={formatLongDate(fecha)}
        onBack={onBack}
      />

      {loading ? <LoadingState message="Consultando horarios..." /> : null}
      <AlertMessage type="error" message={error} />

      {!loading && !horas.length ? (
        <AlertMessage
          type="info"
          title="Sin horarios disponibles"
          message="No hay horarios disponibles para esta fecha. Elige otro día."
        />
      ) : null}

      <div className="slots-list">
        {horas.map((hora) => (
          <button
            key={hora.value}
            type="button"
            className={`slot-button ${selectedHour?.value === hora.value ? 'selected' : ''}`}
            disabled={loading}
            onClick={() => onSelectHour(hora)}
          >
            {hora.label}
          </button>
        ))}
      </div>

      <PrimaryButton disabled={!selectedHour || loading} loading={loading} onClick={onContinue}>
        Continuar
      </PrimaryButton>
    </div>
  );
}
