import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'
import NewRequestPage from './pages/NewRequestPage';
import PrivateRoute from './components/PrivateRoute';
import RequestDetailsPage from './pages/RequestDetailsPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/parcelas"
              element={
                <PrivateRoute>
                  <NewRequestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/solicitacao/:id"
              element={
                <PrivateRoute>
                  <RequestDetailsPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>

  );
}
