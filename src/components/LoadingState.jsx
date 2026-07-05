export default function LoadingState({ message = 'Cargando disponibilidad...' }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  );
}
