import React, { useState } from 'react';
import { HomeIcon, TutorIcon, DataSiswaIcon, SettingsIcon, StatistikIcon, AboutIcon, MenuIcon, CardViewIcon, TableViewIcon, AIIcon } from './icons';

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

const NavItem = ({ icon, label, page, setCurrentPage, closeSidebar }: { icon: React.ReactNode; label: string; page: string; setCurrentPage: (page: string) => void; closeSidebar: () => void; }) => (
  <button
    onClick={() => {
      setCurrentPage(page);
      closeSidebar();
    }}
    className="flex items-center w-full p-3 my-1 rounded-lg text-gray-200 hover:bg-white/10 dark:hover:bg-white/10 transition-colors duration-200"
    title={label}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </button>
);

const aiAssistants = [
    { name: 'ChatGPT', url: 'https://chat.openai.com/' },
    { name: 'Gemini', url: 'https://gemini.google.com/' },
    { name: 'Claude', url: 'https://claude.ai/' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai/' },
];

const Sidebar: React.FC<SidebarProps> = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  const openAIPopup = (url: string, title: string) => {
    const width = 1000;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    window.open(
      url,
      title,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50 transition-all transform hover:scale-110"
        aria-label="Buka menu"
      >
        <MenuIcon />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={closeSidebar}
        ></div>
      )}
      
      <div 
        className={`fixed top-0 left-0 h-full bg-[var(--primary-color)] dark:bg-gray-800 text-white z-50 transition-transform duration-300 ease-in-out w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-2">
          <div className="flex items-center justify-between h-14 mb-4 px-2">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={closeSidebar} className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-700" aria-label="Tutup menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          <nav className="flex-grow">
            <NavItem icon={<HomeIcon />} label="Beranda" page="home" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
            <NavItem icon={<TutorIcon />} label="Tutor" page="tutor" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
            <NavItem icon={<DataSiswaIcon />} label="Data Siswa" page="data_siswa" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
            <NavItem icon={<StatistikIcon />} label="Statistik" page="statistik" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
            {/* AI Menu */}
            <div>
              <button
                onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                className="flex items-center justify-between w-full p-3 my-1 rounded-lg text-gray-200 hover:bg-white/10 dark:hover:bg-white/10 transition-colors duration-200"
                title="Asisten AI"
              >
                <div className="flex items-center">
                  <AIIcon />
                  <span className="ml-4 font-semibold">AI</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isAiMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isAiMenuOpen && (
                <div className="pl-8 py-1 space-y-1 bg-black/10 dark:bg-black/20 rounded-b-lg">
                  {aiAssistants.map(ai => (
                    <button
                      key={ai.name}
                      onClick={() => {
                        openAIPopup(ai.url, ai.name);
                        closeSidebar();
                      }}
                      className="flex items-center w-full p-2 rounded-md text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm text-left"
                    >
                      {ai.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div>
            <NavItem icon={<SettingsIcon />} label="Pengaturan" page="settings" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
            <NavItem icon={<AboutIcon />} label="About Us" page="about" setCurrentPage={setCurrentPage} closeSidebar={closeSidebar}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

// View Switcher Component
interface ViewSwitcherProps {
    tableView: 'responsive' | 'table';
    setTableView: (view: 'responsive' | 'table') => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ tableView, setTableView }) => {
    const baseClasses = "p-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-[var(--primary-color)] text-white shadow";
    const inactiveClasses = "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

    return (
        <div className="flex md:hidden items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
            <button
                onClick={() => setTableView('responsive')}
                className={`${baseClasses} ${tableView === 'responsive' ? activeClasses : inactiveClasses}`}
                aria-label="Tampilan Kartu"
                title="Tampilan Kartu"
            >
                <CardViewIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setTableView('table')}
                className={`${baseClasses} ${tableView === 'table' ? activeClasses : inactiveClasses}`}
                aria-label="Tampilan Tabel"
                title="Tampilan Tabel"
            >
                <TableViewIcon className="w-5 h-5" />
            </button>
        </div>
    );
};