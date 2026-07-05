import { API_BASE_URL, assertApiBaseUrl } from './config.js';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function endpoint(path) {
  assertApiBaseUrl();
  return `${API_BASE_URL}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(endpoint(path), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  let data = null;
  const text = await response.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError('Respuesta inválida del servidor.', response.status);
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'No pudimos completar la solicitud.', response.status);
  }

  return data;
}

function withPublicToken(path, publicToken) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}public_token=${encodeURIComponent(publicToken)}`;
}

export function getEmpresa(publicToken) {
  return request(withPublicToken('/empresa', publicToken));
}

export function verificarCliente({ telefono, publicToken }) {
  return request('/cliente/verificar', {
    method: 'POST',
    body: JSON.stringify({
      telefono,
      public_token: publicToken,
    }),
  });
}

export function registrarCliente({ bookingSession, nombre, telefono, email, publicToken }) {
  return request('/cliente/registro', {
    method: 'POST',
    body: JSON.stringify({
      booking_session: bookingSession,
      nombre,
      telefono,
      email,
      public_token: publicToken,
    }),
  });
}

export function getFechasDisponibles(publicToken) {
  return request(withPublicToken('/fechas-disponibles', publicToken));
}

export function getDisponibilidad({ fecha, publicToken }) {
  return request(withPublicToken(`/disponibilidad?fecha=${encodeURIComponent(fecha)}`, publicToken));
}

export function preconfirmarCita({ bookingSession, fecha, hora, publicToken }) {
  return request('/citas/preconfirmar', {
    method: 'POST',
    body: JSON.stringify({
      booking_session: bookingSession,
      fecha,
      hora,
      public_token: publicToken,
    }),
  });
}

export function confirmarCita({ bookingSession, fecha, hora, publicToken }) {
  return request('/citas/confirmar', {
    method: 'POST',
    body: JSON.stringify({
      booking_session: bookingSession,
      fecha,
      hora,
      public_token: publicToken,
    }),
  });
}
