import { ArrowLeft } from 'lucide-react';

export default function StepHeader({ step, title, description, onBack, children }) {
  return (
    <header className="step-header">
      <div className="top-bar">
        {onBack ? (
          <button className="icon-button" type="button" onClick={onBack} aria-label="Volver">
            <ArrowLeft size={18} />
          </button>
        ) : (
          <span className="icon-spacer" />
        )}
        <span className="brand">Trimly</span>
        <span className="icon-spacer" />
      </div>
      <p className="step-label">{step}</p>
      <h1>{title}</h1>
      {description ? <p className="step-description">{description}</p> : null}
      {children}
    </header>
  );
}
