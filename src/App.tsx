/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Workflow from './components/Workflow';
import Architecture from './components/Architecture';
import Analytics from './components/Analytics';
import GeminiDemo from './components/GeminiDemo';
import Footer from './components/Footer';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentApp from './pages/StudentApp';
import UserGuide from './pages/UserGuide';
import { LanguageProvider } from './contexts/LanguageContext';

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <GeminiDemo />
      <Workflow />
      <Architecture />
      <Analytics />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/student" element={<StudentApp />} />
          <Route path="/guide" element={<UserGuide />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}
