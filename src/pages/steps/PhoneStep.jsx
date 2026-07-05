import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import AlertMessage from '../../components/AlertMessage.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StepHeader from '../../components/StepHeader.jsx';
import { formatPhoneForApi, formatPhoneForDisplay, isValidColombianPhone, onlyDigits } from '../../utils/phone.js';

export default function PhoneStep({ onSubmit, onBack, loading, error }) {
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const digits = onlyDigits(phone);

    if (!digits) {
      setLocalError('Ingresa tu número de celular.');
      return;
    }

    if (!isValidColombianPhone(digits)) {
      setLocalError('El celular debe tener 10 dígitos e iniciar por 3.');
      return;
    }

    setLocalError('');
    onSubmit(formatPhoneForApi(digits));
  }

  return (
    <form className="step-card" onSubmit={handleSubmit}>
      <StepHeader
        step="Paso 1 de 4"
        title="Tu número de teléfono"
        description="Lo usamos para buscar tus datos y confirmar tu cita."
        onBack={onBack}
      />

      <label className="field-label" htmlFor="telefono">Celular</label>
      <div className="phone-input">
        <span aria-hidden="true">🇨🇴</span>
        <span>+57</span>
        <input
          id="telefono"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="300 123 4567"
          value={formatPhoneForDisplay(phone)}
          onChange={(event) => setPhone(onlyDigits(event.target.value))}
        />
      </div>

      <AlertMessage type="error" message={localError || error} />
      <PrimaryButton type="submit" loading={loading}>Continuar</PrimaryButton>

      <p className="secure-note">
        <LockKeyhole size={14} />
        Tu información está protegida
      </p>
    </form>
  );
}
