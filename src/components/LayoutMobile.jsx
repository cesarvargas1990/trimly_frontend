export default function LayoutMobile({ children, className = '' }) {
  return (
    <main className={`app-shell ${className}`}>
      <section className="phone-frame">{children}</section>
    </main>
  );
}
