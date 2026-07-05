export default function PrimaryButton({
  children,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Procesando...' : children}
    </button>
  );
}
