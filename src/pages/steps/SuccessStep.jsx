import { Check, CalendarDays, CalendarPlus, Clock, Hash, Scissors, UserRound, Phone } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import { formatLongDate } from '../../utils/dates.js';

export default function SuccessStep({ citaConfirmada, empresa, barbero, onRestart }) {
  const cita = citaConfirmada?.cita || {};
  const canDownloadCalendar = Boolean(cita.fecha && cita.hora);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  function getCalendarFile() {
    return buildCalendarFile({
      cita,
      codigo: citaConfirmada?.codigo,
      empresa,
      barbero,
    });
  }

  function handleCalendarDownload() {
    const calendarFile = getCalendarFile();

    if (!calendarFile) return;

    if (isInstagramBrowser()) {
      openGoogleCalendar(calendarFile);
      return;
    }

    if (isIosSafari()) {
      openNativeCalendarFile(calendarFile);
      return;
    }

    setShowCalendarOptions(true);
  }

  function handleOpenGoogleCalendar() {
    const calendarFile = getCalendarFile();
    if (calendarFile) openGoogleCalendar(calendarFile);
  }

  function handleDownloadCalendarFile() {
    const calendarFile = getCalendarFile();
    if (calendarFile) downloadCalendarFile(calendarFile);
  }

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
      </div>

      <PrimaryButton variant="secondary" onClick={handleCalendarDownload} disabled={!canDownloadCalendar}>
        <CalendarPlus size={18} />
        Agregar a mi calendario
      </PrimaryButton>
      {showCalendarOptions ? (
        <div className="calendar-options">
          <PrimaryButton onClick={handleOpenGoogleCalendar}>
            <CalendarPlus size={18} />
            Abrir Google Calendar
          </PrimaryButton>
          <PrimaryButton variant="secondary" onClick={handleDownloadCalendarFile}>
            Descargar .ics
          </PrimaryButton>
        </div>
      ) : null}
      <PrimaryButton onClick={onRestart}>Volver al inicio</PrimaryButton>
    </div>
  );
}

function openNativeCalendarFile(calendarFile) {
  const blob = new Blob([calendarFile.content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.location.assign(url);
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function downloadCalendarFile(calendarFile) {
  const blob = new Blob([calendarFile.content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = calendarFile.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openGoogleCalendar(calendarFile) {
  const url = buildGoogleCalendarUrl(calendarFile);
  window.location.assign(url);
}

function isInstagramBrowser() {
  return /Instagram/i.test(navigator.userAgent);
}

function isIosSafari() {
  const userAgent = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV/i.test(userAgent);
  return isIos && isSafari;
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

function buildCalendarFile({ cita, codigo, empresa, barbero }) {
  const startDate = parseAppointmentDate(cita.fecha, cita.hora);
  if (!startDate) return null;

  const durationMinutes = Number(cita.duracion) || 45;
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota';
  const barberName = cita.barbero || barbero?.nombre || 'tu barbero';
  const businessName = empresa?.nombre || 'la barbería';
  const title = `Cita con ${barberName}`;
  const location = empresa?.ubicacion || '';
  const uid = `${codigo || Date.now()}@trimly`;
  const description = [
    `Recordatorio de mi cita con ${barberName}.`,
    `Barbería: ${businessName}.`,
    empresa?.ubicacion ? `Ubicación: ${empresa.ubicacion}.` : '',
    empresa?.especialidad ? `Especialidad: ${empresa.especialidad}.` : '',
    codigo ? `Código de cita: ${codigo}.` : '',
    `Zona horaria del cliente: ${timeZone}.`,
  ].filter(Boolean).join('\n');

  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Trimly//Reserva de cita//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-TIMEZONE:${timeZone}`,
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${formatUtcDate(new Date())}`,
    `DTSTART;TZID=${timeZone}:${formatLocalDate(startDate)}`,
    `DTEND;TZID=${timeZone}:${formatLocalDate(endDate)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : '',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(`Recordatorio de mi cita con ${barberName}`)}`,
    'TRIGGER:-PT10M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return {
    content: `${content}\r\n`,
    description,
    endDate,
    filename: `trimly-cita-${cita.fecha || 'calendario'}.ics`,
    location,
    startDate,
    title,
  };
}

function buildGoogleCalendarUrl(calendarFile) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarFile.title,
    dates: `${formatGoogleCalendarDate(calendarFile.startDate)}/${formatGoogleCalendarDate(calendarFile.endDate)}`,
    details: calendarFile.description,
  });

  if (calendarFile.location) {
    params.set('location', calendarFile.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function parseAppointmentDate(dateKey, timeLabel) {
  const match = String(timeLabel).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !match) return null;

  const [, rawHour, rawMinute, meridiem] = match;
  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (meridiem) {
    const normalizedMeridiem = meridiem.toUpperCase();
    if (normalizedMeridiem === 'PM' && hour < 12) hour += 12;
    if (normalizedMeridiem === 'AM' && hour === 12) hour = 0;
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0);
}

function formatLocalDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    'T',
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    '00',
  ].join('');
}

function formatUtcDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function formatGoogleCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}
