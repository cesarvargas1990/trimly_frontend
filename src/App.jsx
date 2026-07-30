import { Route, Routes } from 'react-router-dom';
import TrimlyBooking from './pages/TrimlyBooking.jsx';
import PricingPage from './pages/PricingPage.jsx';
import AlertMessage from './components/AlertMessage.jsx';

function MissingToken() {
  return (
    <main className="app-shell">
      <section className="phone-frame compact-frame">
        <p className="brand">Trimly</p>
        <AlertMessage
          type="error"
          title="Link incompleto"
          message="Abre el enlace personalizado de tu barbero para reservar una cita."
        />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/paquetes" element={<PricingPage />} />
      <Route path="/precios" element={<PricingPage />} />
      <Route path="/:publicToken" element={<TrimlyBooking />} />
      <Route path="/trimly/:publicToken" element={<TrimlyBooking />} />
      <Route path="/trimly" element={<MissingToken />} />
      <Route path="/" element={<PricingPage />} />
      <Route path="*" element={<MissingToken />} />
    </Routes>
  );
}
