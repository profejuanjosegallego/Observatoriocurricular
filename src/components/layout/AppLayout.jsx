import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RoleSelector from '../common/RoleSelector';
import { useUser } from '../../context/UserContext';
import { aportesService } from '../../services/api';

export default function AppLayout() {
  const { user } = useUser();
  const [roleOpen, setRoleOpen] = useState(false);
  const [aporteCounts, setAporteCounts] = useState({});

  useEffect(() => {
    if (!user) setRoleOpen(true);
  }, [user]);

  useEffect(() => {
    aportesService.listar().then(aportes => {
      const counts = {};
      aportes.forEach(a => {
        counts[a.materiaId] = (counts[a.materiaId] || 0) + 1;
      });
      setAporteCounts(counts);
    }).catch(() => {});
  }, []);

  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenRoleSelector={() => setRoleOpen(true)} />

      <main className={`flex-1 w-full mx-auto px-4 py-7 items-start ${isHome ? 'max-w-[1100px]' : 'max-w-[1200px] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6'}`}>
        {!isHome && <Sidebar aporteCounts={aporteCounts} />}
        <div className="min-w-0">
          <Outlet context={{ aporteCounts, refreshCounts: () => {
            aportesService.listar().then(aportes => {
              const counts = {};
              aportes.forEach(a => {
                counts[a.materiaId] = (counts[a.materiaId] || 0) + 1;
              });
              setAporteCounts(counts);
            }).catch(() => {});
          }}} />
        </div>
      </main>

      <Footer />

      <RoleSelector open={roleOpen} onClose={() => setRoleOpen(false)} />
    </div>
  );
}
