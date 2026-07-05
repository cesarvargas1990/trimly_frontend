export function normalizeTimeForApi(slot) {
  const value = String(slot?.value || '').trim();
  const label = String(slot?.label || '').trim();

  return parseTime(value) || parseTime(label) || value;
}

function parseTime(value) {
  const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i);
  if (!match) return '';

  const [, rawHour, rawMinute, rawSecond = '00', rawMeridiem] = match;
  let hour = Number(rawHour);
  const minute = Number(rawMinute);
  const second = Number(rawSecond);

  if (hour > 23 || minute > 59 || second > 59) return '';

  if (rawMeridiem) {
    const meridiem = rawMeridiem.toUpperCase();
    if (hour < 1 || hour > 12) return '';
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
  }

  return [
    String(hour).padStart(2, '0'),
    String(minute).padStart(2, '0'),
    String(second).padStart(2, '0'),
  ].join(':');
}
