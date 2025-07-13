import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Login from './src/components/Login';
import Dashboard from './components/Dashboard';
import FocusView from './components/FocusView';
import AllTodosView from './components/AllTodosView';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import StorageStatus from './components/StorageStatus';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <LoadingSpinner size="lg" text="애플리케이션 로딩 중..." />
      </div>
    );
  }

  const { user, view, focusedListId } = context;

  if (!user) {
    return <Login />;
  }

  // 관리자라면 관리자 대시보드 노출
  if (user.isAdmin) {
    return <AdminDashboard />;
  }
  
  const renderView = () => {
    switch (view) {
      case 'focus':
        return <FocusView listId={focusedListId!} />;
      case 'all':
        return <AllTodosView mode="all" />;
      case 'favorites':
        return <AllTodosView mode="favorites" />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0F172A] text-slate-100">
        {renderView()}
        <StorageStatus />
      </div>
    </ErrorBoundary>
  );
};

export default App;