import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const iconMap = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export default function AlertMessage({ type = 'info', title, message }) {
  const Icon = iconMap[type] || Info;

  if (!message && !title) return null;

  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={18} />
      <div>
        {title ? <strong>{title}</strong> : null}
        {message ? <p>{message}</p> : null}
      </div>
    </div>
  );
}
