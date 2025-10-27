
import React, { useMemo } from 'react';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface StatistikPageProps {
  students: Student[];
}

const cardStyles = "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg";

const StatistikPage: React.FC<StatistikPageProps> = ({ students }) => {

  const chartColor = useMemo(() => {
    if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#8884d8';
    }
    return '#8884d8';
  }, []);

  const kelasCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    students.forEach(s => {
      counts[s.kelas] = (counts[s.kelas] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, jumlah: counts[name] }));
  }, [students]);

  const genderCount = useMemo(() => {
    const counts = { L: 0, P: 0 };
    students.forEach(s => {
      if (s.gender === 'L') counts.L++;
      if (s.gender === 'P') counts.P++;
    });
    return [{ name: 'Laki-laki', value: counts.L }, { name: 'Perempuan', value: counts.P }];
  }, [students]);
  
  const sswCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    students.forEach(s => {
      const ssws = s.ssw.split(',').map(ssw => ssw.trim());
      ssws.forEach(ssw => {
        if(ssw) counts[ssw] = (counts[ssw] || 0) + 1;
      });
    });
    return Object.keys(counts).map(name => ({ name, jumlah: counts[name] })).sort((a,b) => b.jumlah - a.jumlah);
  }, [students]);
  
  const avgTbBb = useMemo(() => {
    const stats: { [key:string]: { tb: number, bb: number, count: number } } = {};
    students.forEach(s => {
      if(!stats[s.kelas]) stats[s.kelas] = { tb: 0, bb: 0, count: 0 };
      stats[s.kelas].tb += s.tb;
      stats[s.kelas].bb += s.bb;
      stats[s.kelas].count++;
    });
    return Object.keys(stats).map(kelas => ({
      name: kelas,
      "Rata-rata Tinggi (cm)": parseFloat((stats[kelas].tb / stats[kelas].count).toFixed(1)),
      "Rata-rata Berat (kg)": parseFloat((stats[kelas].bb / stats[kelas].count).toFixed(1))
    }));
  }, [students]);

  const PIE_COLORS = [chartColor, '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[var(--primary-color)]">📈 Statistik Siswa</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Visualisasi Data Kelas 7C</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold mb-4 text-center">Jumlah Siswa per Kelas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kelasCount} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold mb-4 text-center">Perbandingan Gender</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderCount} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill={chartColor} label>
                {genderCount.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardStyles} lg:col-span-2`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Distribusi Bidang SSW</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sswCount} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${cardStyles} lg:col-span-2`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Rata-rata Tinggi & Berat Badan per Kelas</h2>
           <ResponsiveContainer width="100%" height={300}>
            <LineChart data={avgTbBb} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Rata-rata Tinggi (cm)" stroke={chartColor} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Rata-rata Berat (kg)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;