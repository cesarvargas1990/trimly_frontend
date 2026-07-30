import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  Clock,
  Infinity,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react';
import barberHero from '../assets/trimly-barber-hero.png';

const WHATSAPP_NUMBER = '573184469889';

const packages = [
  {
    citas: 50,
    precio: '$9.500',
    etiqueta: 'Inicio rápido',
    descripcion: 'Para probar Trimly con clientes frecuentes.',
  },
  {
    citas: 100,
    precio: '$11.000',
    etiqueta: 'Ligero',
    descripcion: 'Ideal si estás organizando la agenda por primera vez.',
  },
  {
    citas: 250,
    precio: '$15.000',
    etiqueta: 'Popular',
    descripcion: 'La opción más equilibrada para una barbería activa.',
    destacado: true,
  },
  {
    citas: 500,
    precio: '$20.500',
    etiqueta: 'Crecimiento',
    descripcion: 'Para equipos con agenda constante durante el mes.',
  },
  {
    citas: 1000,
    precio: '$30.000',
    etiqueta: 'Alto volumen',
    descripcion: 'Pensado para barberías con alta demanda.',
  },
];

const heroFeatures = [
  { icon: CalendarCheck, title: 'Agenda online', text: 'Tus clientes reservan fácil y rápido.' },
  { icon: Bell, title: 'Recordatorios', text: 'Reduce inasistencias automáticamente.' },
  { icon: TrendingUp, title: 'Más clientes', text: 'Más tiempo libre, más crecimiento.' },
];

const trustItems = [
  { icon: ShieldCheck, title: 'Pago 100% seguro', text: 'Tus datos y pagos están protegidos.' },
  { icon: Infinity, title: 'Sin vencimientos', text: 'Usa tus créditos cuando quieras.' },
  { icon: MessageCircle, title: 'Soporte rápido', text: 'Te ayudamos por WhatsApp.' },
  { icon: UsersRound, title: 'Para barberías', text: 'Organiza tu agenda sin desorden.' },
];

function buildWhatsappLink(plan) {
  const message = `Hola, quiero comprar el paquete de ${plan.citas} citas de Trimly por ${plan.precio}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <header className="pricing-nav">
        <a className="pricing-brand" href="/" aria-label="Trimly inicio">
          <span className="pricing-brand-mark">T</span>
          <span>Trimly</span>
        </a>
        <nav className="pricing-menu" aria-label="Navegación principal">
          <a href="/">Inicio</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a className="active" href="#precios">Precios</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a
          className="pricing-whatsapp"
          href={`https://trimlybook.com/admin`}
          target="_blank"
          rel="noreferrer"
        >
          <UserRound size={18} />
          Iniciar sesión
        </a>
      </header>

      <section className="pricing-hero" id="inicio">
        <img className="pricing-hero-image" src={barberHero} alt="Barbero profesional atendiendo a un cliente" />
        <div className="pricing-hero-shade" />
        <div className="pricing-copy">
          <p className="pricing-kicker">Agenda para barberías</p>
          <h1>
            Tu agenda, <span>sin complicaciones</span>
          </h1>
          <p>
            Gestiona citas, clientes y servicios desde un flujo simple. Tus clientes reservan y tú te enfocas en cortar.
          </p>
          <div className="pricing-hero-points" id="funcionalidades" aria-label="Funcionalidades">
            {heroFeatures.map(({ icon: Icon, title, text }) => (
              <span key={title}>
                <Icon size={20} />
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            ))}
          </div>
        </div>

        <aside className="pricing-help-card" id="contacto" aria-label="Contacto por WhatsApp">
          <div className="pricing-help-head">
            <span>
              <MessageCircle size={23} />
            </span>
            <strong>¿Necesitas ayuda?</strong>
          </div>
          <p>Chatea con nosotros por WhatsApp y te ayudamos a elegir el paquete correcto.</p>
          <div className="chat-bubble sent">Hola, quiero más información sobre los paquetes de citas.</div>
          <div className="chat-bubble received">¡Hola! Te contamos cómo funcionan y cuál te conviene.</div>
          <a
            className="pricing-help-action"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Chatear por WhatsApp
          </a>
        </aside>

        <div className="pricing-summary" aria-label="Resumen de créditos">
          <ShieldCheck size={25} />
          <span>Tus citas nunca vencen</span>
          <strong>Compra una sola vez y úsalas cuando quieras.</strong>
        </div>
      </section>

      <section className="pricing-section" id="precios">
        <div className="pricing-section-head">
          <p className="pricing-kicker">Créditos Trimly</p>
          <h2>Compra créditos y úsalos cuando los necesites</h2>
          <div className="pricing-section-points" aria-label="Condiciones">
            <span>
              <Check size={15} />
              Compra una sola vez
            </span>
            <span>
              <Check size={15} />
              Sin mensualidades
            </span>
            <span>
              <Check size={15} />
              Sin vencimientos
            </span>
            <span>
              <Check size={15} />
              Cada reserva consume 1 crédito
            </span>
          </div>
        </div>

        <div className="pricing-content">
          <section className="pricing-grid" aria-label="Paquetes disponibles">
            {packages.map((plan) => (
              <article className={`pricing-card ${plan.destacado ? 'featured' : ''}`} key={plan.citas}>
                {plan.destacado ? <strong className="pricing-badge">Más popular</strong> : null}
                <div className="pricing-card-head">
                  <span className="pricing-plan-icon">
                    <CalendarCheck size={22} />
                  </span>
                  <div>
                    <span>{plan.etiqueta}</span>
                    <h2>{plan.citas}</h2>
                    <p>citas</p>
                  </div>
                </div>

                <div className="pricing-price">
                  <strong>{plan.precio}</strong>
                  <span>COP</span>
                </div>

                <p className="pricing-description">{plan.descripcion}</p>

                <ul className="pricing-benefits">
                  <li>
                    <Check size={16} />
                    Activación por WhatsApp
                  </li>
                  <li>
                    <Check size={16} />
                    Sin vencimiento
                  </li>
                </ul>

                <a className="pricing-action" href={buildWhatsappLink(plan)} target="_blank" rel="noreferrer">
                  Comprar
                  <ArrowRight size={17} />
                </a>
              </article>
            ))}
          </section>

          <aside className="pricing-info-card" aria-label="Cómo funcionan los créditos">
            <h3>¿Cómo funcionan los créditos?</h3>
            <div>
              <CalendarCheck size={20} />
              <p>Cada reserva confirmada consume 1 crédito.</p>
            </div>
            <div>
              <Clock size={20} />
              <p>Si una cita se cancela dentro del tiempo permitido, el crédito se conserva.</p>
            </div>
            <div>
              <Infinity size={20} />
              <p>Tus créditos no vencen. Úsalos cuando tu barbería los necesite.</p>
            </div>
            <div>
              <Lock size={20} />
              <p>Compra segura y soporte directo por WhatsApp.</p>
            </div>
          </aside>
        </div>

        <section className="pricing-trust" aria-label="Beneficios de Trimly">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={31} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
