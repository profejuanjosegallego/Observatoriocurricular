import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MateriaPage from './pages/MateriaPage';
import GeneradorPage from './pages/GeneradorPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="materia/:materiaId" element={<MateriaPage />} />
            <Route path="generador" element={<GeneradorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
