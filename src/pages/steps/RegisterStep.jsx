import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import AlertMessage from '../../components/AlertMessage.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
const repeatedLettersPattern = /([\p{L}])\1{3,}/iu;
const maxNameLength = 60;

export default function RegisterStep({ onSubmit, onBack, loading, error }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = nombre.trim().replace(/\s+/g, ' ');
    const cleanEmail = email.trim();

    if (!cleanName) {
      setLocalError('Ingresa tu nombre.');
      return;
    }

    if (
      cleanName.length > maxNameLength ||
      !namePattern.test(cleanName) ||
      repeatedLettersPattern.test(cleanName)
    ) {
      setLocalError('Ingresa un nombre válido, sin números ni caracteres raros.');
      return;
    }

    if (cleanEmail && !emailPattern.test(cleanEmail)) {
      setLocalError('Ingresa un email válido.');
      return;
    }

    setLocalError('');
    onSubmit({ nombre: cleanName, email: cleanEmail });
  }

  return (
    <form className="step-card" onSubmit={handleSubmit}>
      <StepHeader
        step="Paso 1 de 4"
        title="Completa tus datos"
        description="Es la primera vez que reservas con nosotros."
        onBack={onBack}
      >
        <p className="helper-note">Solo te pediremos estos datos una vez.</p>
      </StepHeader>

      <label className="field-label" htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        className="text-input"
        autoComplete="name"
        placeholder="Juan"
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
      />

      <label className="field-label" htmlFor="email">Email (opcional)</label>
      <input
        id="email"
        className="text-input"
        type="text"
        inputMode="email"
        autoComplete="email"
        placeholder="juanperez@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <p className="field-hint">Lo usamos para enviarte recordatorios de tu cita.</p>

      <AlertMessage type="error" message={localError || error} />
      <PrimaryButton type="submit" loading={loading}>Continuar</PrimaryButton>

      <p className="secure-note">
        <LockKeyhole size={14} />
        Tu información está protegida
      </p>
    </form>
  );
}
