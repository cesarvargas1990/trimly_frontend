import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import AlertMessage from '../../components/AlertMessage.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterStep({ onSubmit, onBack, loading, error }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = nombre.trim().replace(/\s+/g, ' ');
    const words = cleanName.split(' ').filter(Boolean);

    if (words.length < 2) {
      setLocalError('Ingresa tu nombre completo.');
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setLocalError('Ingresa un email válido.');
      return;
    }

    setLocalError('');
    onSubmit({ nombre: cleanName, email: email.trim() });
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

      <label className="field-label" htmlFor="nombre">Nombre completo</label>
      <input
        id="nombre"
        className="text-input"
        autoComplete="name"
        placeholder="Juan Pérez"
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
      />

      <label className="field-label" htmlFor="email">Email</label>
      <input
        id="email"
        className="text-input"
        type="email"
        autoComplete="email"
        placeholder="juanperez@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <AlertMessage type="error" message={localError || error} />
      <PrimaryButton type="submit" loading={loading}>Continuar</PrimaryButton>

      <p className="secure-note">
        <LockKeyhole size={14} />
        Tu información está protegida
      </p>
    </form>
  );
}
