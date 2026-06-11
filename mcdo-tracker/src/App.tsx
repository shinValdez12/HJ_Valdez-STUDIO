import React, { useState } from 'react';
import { AppProvider } from './hooks/useApp';
import BottomNav, { NavPage } from './components/layout/BottomNav';
import Dashboard from './components/dashboard/Dashboard';
import TimeTracking from './components/timetracking/TimeTracking';
import CalendarPage from './components/calendar/CalendarPage';
import ProfilePage from './components/profile/ProfilePage';

function AppContent() {
  const [page, setPage] = useState<NavPage>('dashboard');
  const [openAddEntry, setOpenAddEntry] = useState(false);

  const handlePageChange = (newPage: NavPage) => {
    setPage(newPage);
    setOpenAddEntry(false);
  };

  const handleAddEntry = () => {
    setPage('time');
    setOpenAddEntry(true);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={(p) => setPage(p as NavPage)} />;
      case 'time': return <TimeTracking openOnAdd={openAddEntry} onOpenHandled={() => setOpenAddEntry(false)} />;
      case 'calendar': return <CalendarPage />;
      case 'profile': return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-gray-50 dark:bg-surface-dark">
      {/* Main content with bottom nav space */}
      <main className="max-w-lg mx-auto pb-32 min-h-screen overflow-y-auto">
        <div key={page} className="page-enter">
          {renderPage()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="max-w-lg mx-auto">
        <BottomNav current={page} onChange={handlePageChange} onAddEntry={handleAddEntry} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
