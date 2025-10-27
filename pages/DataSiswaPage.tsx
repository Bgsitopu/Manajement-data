
import React, { useState, useMemo, useEffect } from 'react';
import { Student } from '../types';
import { KELAS_OPTIONS, GENDER_OPTIONS, SSW_OPTIONS } from '../constants';
import { ViewSwitcher } from '../components/Sidebar';
import Modal from '../components/Modal';
import { FilterIcon, EditIcon, DeleteIcon } from '../components/icons';

interface DataSiswaPageProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  tableView: 'responsive' | 'table';
  setTableView: (view: 'responsive' | 'table') => void;
}

interface FilterState {
  search: string;
  umur: string;
  kelas: string;
  gender: string;
  ssw: string[];
  tb: string;
  bb: string;
}

type SortableKeys = 'nama' | 'umur' | 'kelas' | 'tb' | 'bb';

// Helper function to determine weight status
const getWeightStatus = (tb: number, bb: number, gender: 'L' | 'P' | ''): 'ideal' | 'overweight' | 'underweight' => {
  if (!gender || !tb || !bb || tb <= 100) return 'ideal'; // Default if data is missing or invalid

  const heightFactor = tb - 100;
  const heightReduction = (gender === 'P') ? 0.15 : 0.10;
  const baseIdealWeight = heightFactor - (heightFactor * heightReduction);

  const lowerBoundIdeal = baseIdealWeight * 0.9;
  const upperBoundIdeal = baseIdealWeight * 1.1;
  const finalUpperBoundIdeal = upperBoundIdeal + 3; // User's +3kg buffer

  if (bb < lowerBoundIdeal) {
    return 'underweight';
  } else if (bb > finalUpperBoundIdeal) {
    return 'overweight';
  } else {
    return 'ideal';
  }
};

// UI Feedback Components
const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center" aria-live="polite" aria-label="Loading">
        <div className="w-16 h-16 border-4 border-t-[var(--primary-color)] border-gray-200 rounded-full animate-spin"></div>
    </div>
);

const Notification = ({ message, type }: { message: string, type: 'success' | 'error' }) => (
    <div role="alert" className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-[101] ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-fade-in-out`}>
        {message}
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
);

const DataSiswaPage: React.FC<DataSiswaPageProps> = ({ students, setStudents, tableView, setTableView }) => {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    umur: '',
    kelas: '',
    gender: '',
    ssw: [],
    tb: '',
    bb: '',
  });
  
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ show: true, message, type });
      setTimeout(() => {
          setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
  };
  
  const updateStudent = (updatedStudent: Student) => {
     return new Promise<void>((resolve) => {
        setIsLoading(true);
        setTimeout(() => {
          setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
          setIsLoading(false);
          showNotification('Data siswa berhasil diperbarui!', 'success');
          resolve();
        }, 1000);
    });
  };
  
  const deleteStudent = (id: string) => {
    if (window.confirm('Yakin hapus data siswa ini?')) {
      setIsLoading(true);
      setTimeout(() => {
        setStudents(prev => prev.filter(s => s.id !== id));
        setIsLoading(false);
        showNotification('Data siswa berhasil dihapus.', 'success');
      }, 1000);
    }
  };

  const openEditModal = (student: Student) => {
    setStudentToEdit(student);
    setEditModalOpen(true);
  };
  
  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
       setSortConfig({ key: null, direction: 'ascending' });
       return;
    }
    setSortConfig({ key, direction });
  };
  
  const processedStudents = useMemo(() => {
    let filtered = students.filter(s => {
      const searchLower = filters.search.toLowerCase();
      const matchSearch = filters.search === '' || s.nama.toLowerCase().includes(searchLower);
      const matchKelas = filters.kelas === '' || s.kelas === filters.kelas;
      const matchGender = filters.gender === '' || s.gender === filters.gender;
      const matchUmur = filters.umur === '' || s.umur >= parseInt(filters.umur, 10);
      const matchTb = filters.tb === '' || s.tb >= parseInt(filters.tb, 10);
      const matchBb = filters.bb === '' || s.bb <= parseInt(filters.bb, 10);
      const matchSsw = filters.ssw.length === 0 || filters.ssw.some(ssw => s.ssw.includes(ssw));
      
      return matchSearch && matchKelas && matchGender && matchUmur && matchTb && matchBb && matchSsw;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'ascending' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return filtered;
  }, [students, filters, sortConfig]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {isLoading && <LoadingOverlay />}
      {notification.show && <Notification message={notification.message} type={notification.type} />}

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[var(--primary-color)]">📊 Data Siswa</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Kelola dan Filter Data Siswa</p>
      </header>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex-grow">
             <button onClick={() => setFilterModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105 shadow-md">
              <FilterIcon />
              Filter & Cari Siswa
            </button>
          </div>
          <ViewSwitcher tableView={tableView} setTableView={setTableView} />
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 md:border-0">
          <table className={`w-full text-sm text-left text-gray-500 dark:text-gray-400 responsive-table ${tableView === 'table' ? 'force-table-view' : ''}`}>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('nama')}>Nama {getSortIndicator('nama')}</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('umur')}>Umur {getSortIndicator('umur')}</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('kelas')}>Kelas {getSortIndicator('kelas')}</th>
                <th scope="col" className="px-6 py-3">Gender</th>
                <th scope="col" className="px-6 py-3">SSW</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('tb')}>T.B {getSortIndicator('tb')}</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('bb')}>B.B {getSortIndicator('bb')}</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.map((s, i) => {
                const weightStatus = getWeightStatus(s.tb, s.bb, s.gender);
                const weightClass = 
                    weightStatus === 'overweight' ? 'text-red-500 font-bold' :
                    weightStatus === 'underweight' ? 'text-blue-500 font-bold' :
                    'text-gray-900 dark:text-white';
                return (
                <tr key={s.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td data-label="No" className="px-6 py-4">{i + 1}</td>
                  <td data-label="Nama" className="px-6 py-4 font-medium whitespace-nowrap">{s.nama}</td>
                  <td data-label="Umur" className="px-6 py-4">{s.umur}</td>
                  <td data-label="Kelas" className="px-6 py-4">{s.kelas}</td>
                  <td data-label="Gender" className="px-6 py-4">{s.gender}</td>
                  <td data-label="SSW" className="px-6 py-4">{s.ssw}</td>
                  <td data-label="T.B" className="px-6 py-4">{s.tb}</td>
                  <td data-label="B.B" className="px-6 py-4">
                    <span className={weightClass}>{s.bb}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2 actions-cell">
                      <button onClick={() => openEditModal(s)} className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><EditIcon /></button>
                      <button onClick={() => deleteStudent(s.id)} className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><DeleteIcon /></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {processedStudents.length === 0 && <p className="text-center p-8 text-gray-500 dark:text-gray-400">Tidak ada siswa yang ditemukan.</p>}
        </div>
        <p className="text-right mt-4 text-sm text-gray-500 dark:text-gray-400">Total: {processedStudents.length} siswa</p>
      </div>

      <FilterStudentModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
      {studentToEdit && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          student={studentToEdit}
          onUpdate={updateStudent}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

const FormInput = ({ id, label, ...props }: { id: string, label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <input id={id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" {...props} />
    </div>
);

const FormSelect = ({ id, label, children, ...props }: { id: string, label: string, children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        <select id={id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" {...props}>
            {children}
        </select>
    </div>
);

const EditStudentModal = ({ isOpen, onClose, student, onUpdate, isLoading }: { isOpen: boolean, onClose: () => void, student: Student, onUpdate: (student: Student) => Promise<void>, isLoading: boolean }) => {
    const [formData, setFormData] = useState(student);

    useEffect(() => {
        setFormData(student);
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev!, [name]: value }));
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
        setFormData(prev => ({ ...prev!, ssw: selectedOptions.join(', ') }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onUpdate(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Data Siswa">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput id="editNama" name="nama" label="Nama" type="text" value={formData.nama} onChange={handleChange} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <FormInput id="editUmur" name="umur" label="Umur" type="number" value={formData.umur} onChange={handleChange} required />
                   <FormInput id="editTb" name="tb" label="Tinggi (cm)" type="number" value={formData.tb} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect id="editKelas" name="kelas" label="Kelas" value={formData.kelas} onChange={handleChange} required>
                        {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                    </FormSelect>
                    <FormSelect id="editGender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} required>
                        {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </FormSelect>
                </div>
                 <FormInput id="editBb" name="bb" label="Berat (kg)" type="number" value={formData.bb} onChange={handleChange} required />
                <FormSelect id="editSsw" name="ssw" label="SSW" multiple size={5} value={formData.ssw.split(', ')} onChange={handleMultiSelectChange}>
                     {SSW_OPTIONS.map(ssw => <option key={ssw} value={ssw}>{ssw}</option>)}
                </FormSelect>
                <button type="submit" disabled={isLoading} className="w-full text-white bg-[var(--primary-color)] hover:brightness-110 focus:ring-4 focus:ring-[var(--primary-color)]/30 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                     {isLoading ? 'Memperbarui...' : 'Update Data'}
                </button>
            </form>
        </Modal>
    );
};

const FilterStudentModal = ({ isOpen, onClose, filters, setFilters }: { isOpen: boolean, onClose: () => void, filters: FilterState, setFilters: React.Dispatch<React.SetStateAction<FilterState>> }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
        setFilters(prev => ({...prev, ssw: selectedOptions}));
    };
    
    const resetFilters = () => {
        setFilters({ search: '', umur: '', kelas: '', gender: '', ssw: [], tb: '', bb: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filter Siswa">
            <div className="space-y-4">
                <FormInput id="search" name="search" label="Cari Nama" type="text" value={filters.search} onChange={handleInputChange} placeholder="Ketik nama siswa..."/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput id="filterUmur" name="umur" label="Umur Minimum" type="number" value={filters.umur} onChange={handleInputChange} placeholder="e.g. 18"/>
                    <FormInput id="filterTb" name="tb" label="Tinggi Minimum (cm)" type="number" value={filters.tb} onChange={handleInputChange} placeholder="e.g. 160"/>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect id="filterKelas" name="kelas" label="Kelas" value={filters.kelas} onChange={handleInputChange}>
                        <option value="">Semua Kelas</option>
                        {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                    </FormSelect>
                    <FormSelect id="filterGender" name="gender" label="Gender" value={filters.gender} onChange={handleInputChange}>
                        <option value="">Semua Gender</option>
                        {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </FormSelect>
                </div>
                <FormInput id="filterBb" name="bb" label="Berat Maksimum (kg)" type="number" value={filters.bb} onChange={handleInputChange} placeholder="e.g. 70"/>
                 <FormSelect id="filterSsw" name="ssw" label="Filter SSW" multiple size={5} value={filters.ssw} onChange={handleMultiSelectChange}>
                    {SSW_OPTIONS.map(ssw => <option key={ssw} value={ssw}>{ssw}</option>)}
                </FormSelect>
                <div className="flex gap-4 pt-4">
                    <button onClick={resetFilters} className="flex-1 text-gray-800 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5">
                        Reset
                    </button>
                    <button onClick={onClose} className="flex-1 text-white bg-[var(--primary-color)] hover:brightness-110 font-medium rounded-lg text-sm px-5 py-2.5">
                        Terapkan Filter
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DataSiswaPage;