import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import { Student } from './types';
import { INITIAL_STUDENTS } from './constants';
import AIAssistant from './components/AIAssistant';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const DataSiswaPage = lazy(() => import('./pages/DataSiswaPage'));
const StatistikPage = lazy(() => import('./pages/StatistikPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TutorPage = lazy(() => import('./pages/TutorPage'));

// Fallback component while lazy-loaded pages are loading
const PageLoader: React.FC = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="w-16 h-16 border-4 border-t-[var(--primary-color)] border-gray-200 rounded-full animate-spin" aria-label="Memuat halaman..."></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [tableView, setTableView] = useState<'responsive' | 'table'>(() => {
    const savedView = localStorage.getItem('tableView');
    return (savedView === 'responsive' || savedView === 'table') ? savedView : 'responsive';
  });

  // Save tableView to localStorage
  useEffect(() => {
    localStorage.setItem('tableView', tableView);
  }, [tableView]);

  // Apply theme and color from localStorage on initial load
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const color = localStorage.getItem('primaryColor');
    if (color) {
      document.documentElement.style.setProperty('--primary-color', color);
    } else {
      document.documentElement.style.setProperty('--primary-color', '#5a4fcf');
    }

    const textColor = localStorage.getItem('textColor');
    if (textColor) {
        document.documentElement.style.setProperty('--text-color-base', textColor);
    }

  }, []);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage students={students} setStudents={setStudents} tableView={tableView} setTableView={setTableView} />;
      case 'data_siswa':
        return <DataSiswaPage students={students} setStudents={setStudents} tableView={tableView} setTableView={setTableView} />;
      case 'statistik':
        return <StatistikPage students={students} />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      case 'tutor':
        return <TutorPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage students={students} setStudents={setStudents} tableView={tableView} setTableView={setTableView} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Sidebar setCurrentPage={setCurrentPage} />
      <main className="transition-all duration-300">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
      <AIAssistant students={students} />
    </div>
  );
};

export default App;
