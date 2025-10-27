import React, { useState, useEffect } from 'react';

const SettingsPage: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    
    // Primary Color State
    const [appliedColor, setAppliedColor] = useState(localStorage.getItem('primaryColor') || '#5a4fcf');
    const [selectedColor, setSelectedColor] = useState(appliedColor);

    // Text Color State
    const defaultTextColor = theme === 'dark' ? '#ffffff' : '#1f2937';
    const [appliedTextColor, setAppliedTextColor] = useState(localStorage.getItem('textColor') || defaultTextColor);
    const [selectedTextColor, setSelectedTextColor] = useState(appliedTextColor);

    // AI States
    const [isAiAssistantEnabled, setIsAiAssistantEnabled] = useState(
        () => localStorage.getItem('aiAssistantEnabled') === 'true' // default to false
    );
    const DEFAULT_AI_PERSONALITY = "Anda adalah 'Asisten Cerdas 7C', asisten AI untuk aplikasi manajemen data siswa. Tugas Anda adalah menjawab pertanyaan HANYA berdasarkan data siswa yang disediakan. Jika jawaban tidak ada di data, katakan Anda tidak memiliki informasi tersebut. Selalu jawab dalam Bahasa Indonesia dengan ramah dan membantu.";
    const [aiPersonality, setAiPersonality] = useState(localStorage.getItem('aiPersonality') || DEFAULT_AI_PERSONALITY);
    const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');


    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', appliedColor);
        localStorage.setItem('primaryColor', appliedColor);
    }, [appliedColor]);

    useEffect(() => {
        document.documentElement.style.setProperty('--text-color-base', appliedTextColor);
        localStorage.setItem('textColor', appliedTextColor);
    }, [appliedTextColor]);

    const handleApplyPrimaryColor = () => {
        setAppliedColor(selectedColor);
        setNotification('Warna utama berhasil diterapkan!');
        setTimeout(() => setNotification(''), 2000);
    };

    const handleApplyTextColor = () => {
        setAppliedTextColor(selectedTextColor);
        setNotification('Warna teks berhasil diterapkan!');
        setTimeout(() => setNotification(''), 2000);
    };

    const handleAiAssistantToggle = () => {
        const newIsEnabled = !isAiAssistantEnabled;
        setIsAiAssistantEnabled(newIsEnabled);
        localStorage.setItem('aiAssistantEnabled', String(newIsEnabled));
        window.dispatchEvent(new Event('settings-updated'));
        setNotification(`Asisten AI ${newIsEnabled ? 'diaktifkan' : 'dinonaktifkan'}.`);
        setTimeout(() => setNotification(''), 2000);
    };

    const handleSaveAiSettings = () => {
        localStorage.setItem('aiPersonality', aiPersonality);
        localStorage.setItem('geminiApiKey', apiKey.trim());
        setNotification('Pengaturan AI berhasil disimpan!');
        setTimeout(() => setNotification(''), 2000);
    };

    const handleResetToDefault = () => {
        if (window.confirm('Anda yakin ingin mengembalikan semua pengaturan ke default? Tindakan ini tidak dapat diurungkan.')) {
            try {
                // Define defaults
                const defaultTheme = 'dark';
                const defaultPrimaryColor = '#5a4fcf';
                const defaultTxtColor = '#ffffff'; // Corresponds to dark theme
                const defaultAiEnabled = false;
                const defaultApiKey = '';
                
                // Reset state
                setTheme(defaultTheme);
                setSelectedColor(defaultPrimaryColor);
                setAppliedColor(defaultPrimaryColor);
                setSelectedTextColor(defaultTxtColor);
                setAppliedTextColor(defaultTxtColor);
                setAiPersonality(DEFAULT_AI_PERSONALITY);
                setIsAiAssistantEnabled(defaultAiEnabled);
                setApiKey(defaultApiKey);

                // Apply visual changes immediately
                document.documentElement.classList.add('dark');
                document.documentElement.style.setProperty('--primary-color', defaultPrimaryColor);
                document.documentElement.style.setProperty('--text-color-base', defaultTxtColor);

                // Set defaults in local storage
                localStorage.setItem('theme', defaultTheme);
                localStorage.setItem('primaryColor', defaultPrimaryColor);
                localStorage.setItem('textColor', defaultTxtColor);
                localStorage.setItem('aiPersonality', DEFAULT_AI_PERSONALITY);
                localStorage.setItem('aiAssistantEnabled', String(defaultAiEnabled));
                localStorage.removeItem('geminiApiKey');
                window.dispatchEvent(new Event('settings-updated'));
                
                // Notify user and reload
                setNotification('Pengaturan berhasil dikembalikan. Halaman akan dimuat ulang.');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                console.error("Error resetting settings:", error);
                setNotification('Gagal mengembalikan pengaturan.');
                setTimeout(() => setNotification(''), 2000);
            }
        }
    };


    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            {notification && (
                <div className="fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    {notification}
                     <style>{`
                        @keyframes fade-in-out {
                            0% { opacity: 0; transform: translateY(20px); }
                            10% { opacity: 1; transform: translateY(0); }
                            90% { opacity: 1; transform: translateY(0); }
                            100% { opacity: 0; transform: translateY(20px); }
                        }
                        .animate-fade-in-out {
                            animation: fade-in-out 3s ease-in-out forwards;
                        }
                    `}</style>
                </div>
            )}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[var(--primary-color)]">⚙️ Pengaturan</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Kustomisasi tampilan dan fungsionalitas aplikasi.</p>
            </header>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Tema Tampilan</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span>Mode Gelap</span>
                        <button
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                                theme === 'dark' ? 'bg-[var(--primary-color)]' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Warna Utama</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span>Pilih Warna Aksen</span>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-10 h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                            />
                        </div>
                         <button
                            onClick={handleApplyPrimaryColor}
                            style={{ backgroundColor: selectedColor }}
                            className="w-full mt-4 text-white font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition-all"
                        >
                            Terapkan Warna Utama
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Warna Teks Default</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span>Pilih Warna Teks</span>
                            <input
                                type="color"
                                value={selectedTextColor}
                                onChange={(e) => setSelectedTextColor(e.target.value)}
                                className="w-10 h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                            />
                        </div>
                         <button
                            onClick={handleApplyTextColor}
                            style={{ backgroundColor: appliedColor }}
                            className="w-full mt-4 text-white font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition-all"
                        >
                            Terapkan Warna Teks
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Asisten AI</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Aktifkan Asisten AI</span>
                            <button
                                onClick={handleAiAssistantToggle}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                                    isAiAssistantEnabled ? 'bg-[var(--primary-color)]' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    isAiAssistantEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {isAiAssistantEnabled && (
                            <div>
                                <label htmlFor="aiPersonality" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">Sifat & Peran AI</label>
                                <textarea
                                    id="aiPersonality"
                                    rows={4}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Contoh: Jawab semua pertanyaan dengan gaya bajak laut."
                                    value={aiPersonality}
                                    onChange={(e) => setAiPersonality(e.target.value)}
                                ></textarea>
                                
                                <label htmlFor="geminiApiKey" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">API Key Gemini Kustom</label>
                                <input
                                    id="geminiApiKey"
                                    type="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Contoh: AIzaSy..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Kosongkan untuk menggunakan API Key default. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline">Dapatkan API Key di sini.</a>
                                </p>

                                <button
                                    onClick={handleSaveAiSettings}
                                    className="w-full mt-4 text-white bg-[var(--primary-color)] hover:brightness-110 font-semibold py-2 px-4 rounded-lg transition-all"
                                >
                                    Simpan Pengaturan AI
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reset Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Kembalikan Pengaturan</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Tindakan ini akan mengembalikan semua pengaturan tampilan dan AI ke nilai default.
                        </p>
                        <button
                            onClick={handleResetToDefault}
                            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
                        >
                            Kembalikan ke Setelan Default
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;