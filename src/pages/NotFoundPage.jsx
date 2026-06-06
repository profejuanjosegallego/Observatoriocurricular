import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <h1 className="text-6xl font-extrabold text-magenta/20 mb-4 font-heading">404</h1>
      <p className="text-ink-2 mb-6">La página solicitada no fue encontrada.</p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-heading font-semibold text-sm shadow-lg shadow-magenta/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
