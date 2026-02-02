import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CaseInventory from './pages/CaseInventory';
import CaseDetail from './pages/CaseDetail';
import Calendar from './pages/Calendar';
import ClientDirectory from './pages/ClientDirectory';
import ClientDetail from './pages/ClientDetail';
import EFiling from './pages/EFiling';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="cases" element={<CaseInventory />} />
                        <Route path="cases/:id" element={<CaseDetail />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="clients" element={<ClientDirectory />} />
                        <Route path="clients/:id" element={<ClientDetail />} />
                        <Route path="e-filing" element={<EFiling />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
