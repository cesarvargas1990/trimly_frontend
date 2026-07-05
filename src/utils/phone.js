export function onlyDigits(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function isValidColombianPhone(value) {
  return /^3\d{9}$/.test(value);
}

export function formatPhoneForDisplay(value) {
  const digits = onlyDigits(value);
  const partA = digits.slice(0, 3);
  const partB = digits.slice(3, 6);
  const partC = digits.slice(6, 10);
  return [partA, partB, partC].filter(Boolean).join(' ');
}

export function formatPhoneForApi(value) {
  const digits = onlyDigits(value);
  return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}
