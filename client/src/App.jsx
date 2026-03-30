import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

import Home          from './pages/Home.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';
import Subscribe     from './pages/Subscribe.jsx';
import Dashboard     from './pages/Dashboard.jsx';
import Charities     from './pages/Charities.jsx';
import DrawResults   from './pages/DrawResults.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers     from './pages/admin/AdminUsers.jsx';
import AdminDraws     from './pages/admin/AdminDraws.jsx';
import AdminCharities from './pages/admin/AdminCharities.jsx';
import AdminWinners   from './pages/admin/AdminWinners.jsx';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/charities" element={<Charities />} />

          {/* Protected user routes */}
          <Route path="/subscribe" element={
            <ProtectedRoute><Subscribe /></ProtectedRoute>
          }/>
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/draws" element={
            <ProtectedRoute><DrawResults /></ProtectedRoute>
          }/>

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          }/>
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>
          }/>
          <Route path="/admin/draws" element={
            <ProtectedRoute adminOnly={true}><AdminDraws /></ProtectedRoute>
          }/>
          <Route path="/admin/charities" element={
            <ProtectedRoute adminOnly={true}><AdminCharities /></ProtectedRoute>
          }/>
          <Route path="/admin/winners" element={
            <ProtectedRoute adminOnly={true}><AdminWinners /></ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;