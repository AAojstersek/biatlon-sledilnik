import { Suspense, lazy, useEffect, useState } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { TabBar } from './components/layout/TabBar';
import { CompetitionsPage } from './pages/CompetitionsPage';
import { CompetitionEditPage } from './pages/CompetitionEditPage';
import { LiveEntryPage } from './pages/LiveEntryPage';
import { SettingsPage } from './pages/SettingsPage';
import { seedDatabase } from './db/seed';

const AnalysisPage = lazy(() =>
  import('./pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage })),
);

function MainLayout() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/competitions" replace />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/analysis"
            element={
              <Suspense fallback={null}>
                <AnalysisPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/competitions/new" element={<CompetitionEditPage />} />
        <Route path="/competitions/:id" element={<LiveEntryPage />} />
        <Route path="/competitions/:id/edit" element={<CompetitionEditPage />} />
      </Routes>
    </HashRouter>
  );
}
