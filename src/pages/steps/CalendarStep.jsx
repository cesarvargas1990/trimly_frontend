import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import AlertMessage from '../../components/AlertMessage.jsx';
import LoadingState from '../../components/LoadingState.jsx';
import StepHeader from '../../components/StepHeader.jsx';
import {
  formatLongDate,
  formatMonthLabel,
  getMonthGrid,
  isPastDateKey,
  monthKey,
  parseDateKey,
  toDateKey,
} from '../../utils/dates.js';

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function CalendarStep({ fechas, selectedDate, onSelectDate, onBack, loading, error }) {
  const availableDates = useMemo(
    () => fechas.filter((dateKey) => !isPastDateKey(dateKey)).sort(),
    [fechas],
  );
  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);
  const initialMonth = selectedDate
    ? parseDateKey(selectedDate)
    : availableDates[0]
      ? parseDateKey(availableDates[0])
      : new Date();
  const [monthDate, setMonthDate] = useState(initialMonth);

  const minMonth = availableDates[0] ? monthKey(parseDateKey(availableDates[0])) : monthKey(new Date());
  const maxMonth = availableDates[availableDates.length - 1]
    ? monthKey(parseDateKey(availableDates[availableDates.length - 1]))
    : monthKey(new Date());
  const currentMonthKey = monthKey(monthDate);
  const days = getMonthGrid(monthDate);

  function changeMonth(delta) {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <div className="step-card calendar-card">
      <StepHeader
        step="Paso 2 de 4"
        title="Elige el día"
        description="Selecciona la fecha de tu cita."
        onBack={onBack}
      />

      {loading ? <LoadingState message="Buscando fechas disponibles..." /> : null}
      <AlertMessage type="error" message={error} />

      {!loading && !availableDates.length ? (
        <AlertMessage
          type="info"
          title="Sin fechas disponibles"
          message="La barbería no tiene fechas abiertas para reservar en este momento."
        />
      ) : null}

      {availableDates.length ? (
        <>
          <div className="calendar-nav">
            <button
              type="button"
              className="icon-button"
              onClick={() => changeMonth(-1)}
              disabled={currentMonthKey <= minMonth}
              aria-label="Mes anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <strong>{formatMonthLabel(monthDate)}</strong>
            <button
              type="button"
              className="icon-button"
              onClick={() => changeMonth(1)}
              disabled={currentMonthKey >= maxMonth}
              aria-label="Mes siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-grid weekdays">
            {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="calendar-grid days">
            {days.map((day) => {
              const dateKey = toDateKey(day);
              const available = availableSet.has(dateKey) && !isPastDateKey(dateKey);
              const outsideMonth = day.getMonth() !== monthDate.getMonth();
              const selected = selectedDate === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`day-cell ${outsideMonth ? 'outside-month' : ''} ${selected ? 'selected' : ''}`}
                  disabled={!available}
                  onClick={() => onSelectDate(dateKey)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {selectedDate ? (
            <div className="selected-date">
              <span>Fecha seleccionada:</span>
              <strong>{formatLongDate(selectedDate)}</strong>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
