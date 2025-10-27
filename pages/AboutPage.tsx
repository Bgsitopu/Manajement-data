import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-4">Tentang Aplikasi</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Website ini dibuat untuk membantu pengelolaan data siswa Kelas 7C secara modern dan interaktif.
                </p>
                <div className="text-left space-y-2 text-gray-700 dark:text-gray-400 mb-6">
                    <p><strong>IDE:</strong> Habel Irenza Sitopu</p>
                    <p><strong>PENGEMBANG:</strong> Habel Irenza Sitopu</p>
                    <p><strong>TEKNOLOGI:</strong> React, TypeScript, Tailwind CSS</p>
                    <p><strong>VERSI:</strong> 2.0.0 (React Refactor)</p>
                </div>
                <button
                    onClick={() => window.open('https://wa.me/6283188478838?text=Konnichiwa!,%20aku%20ada%20saran%20nih%20untuk%20web%20kelas%207C!', '_blank')}
                    className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    Ada saran? Hubungi Developer
                </button>
                 <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">"Tetaplah hidup walaupun hidupmu tidak berguna, rawrrr 🦖"</p>
            </div>
        </div>
    );
};

export default AboutPage;
