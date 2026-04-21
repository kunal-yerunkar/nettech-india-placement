import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SuccessStories from './pages/success/SuccessStories';
import DomainsPage from './pages/DomainsPage';
import AboutPage from './pages/AboutPage';
import ProcessPage from './pages/process/ProcessPage';
import PartnersPage from './pages/partners/PartnersPage';
import ContactPage from './pages/contact/ContactPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TestInteractive from './pages/TestInteractive';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext';
import Preloader from './components/Preloader';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <Preloader />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="success-stories" element={<SuccessStories />} />
            <Route path="domains" element={<DomainsPage />} />
            <Route path="register" element={<RegistrationPage />} />
            <Route path="test" element={<TestInteractive />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;