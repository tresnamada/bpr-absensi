import { useState, useEffect } from 'react';
import { Shield, Download, Eye, EyeOff, LogOut as LogOutIcon, RefreshCw, FileSpreadsheet, Users, TrendingUp, Calendar, Clock, Briefcase, Filter, X } from 'lucide-react';
import { listenToAllAttendance } from '../services/attendanceService';
import { exportToExcel } from '../utils/excelExport';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showStats, setShowStats] = useState(true);


  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = listenToAllAttendance((data) => {
        setAttendanceData(data);
      });

      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const dataToExport = getFilteredData();
      if (dataToExport.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
      }
      await exportToExcel(dataToExport);
      alert('Data berhasil diekspor ke Excel!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    return attendanceData.filter(record => {
      const matchDate = filterDate ? record.date === filterDate : true;
      const matchName = filterName ? record.employeeName.toLowerCase().includes(filterName.toLowerCase()) : true;
      const matchPosition = filterPosition ? record.jobPosition?.toLowerCase().includes(filterPosition.toLowerCase()) : true;
      const matchStatus = filterStatus ? record.type === filterStatus : true;
      return matchDate && matchName && matchPosition && matchStatus;
    });
  };

  const getStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = attendanceData.filter(r => r.date === today);
    const uniqueEmployees = new Set(attendanceData.map(r => r.employeeName)).size;
    const todayCheckIns = todayData.filter(r => r.type === 'masuk').length;
    const todayCheckOuts = todayData.filter(r => r.type === 'pulang').length;
    
    return {
      totalRecords: attendanceData.length,
      uniqueEmployees,
      todayCheckIns,
      todayCheckOuts,
      todayTotal: todayData.length
    };
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterName('');
    setFilterPosition('');
    setFilterStatus('');
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600 font-medium">Masukkan password untuk mengakses</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Password Admin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                Masuk Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  const filteredData = getFilteredData();
  const stats = getStatistics();
  const hasActiveFilters = filterDate || filterName || filterPosition || filterStatus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Admin Panel - Data Absensi
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Real-time Updates • Total: {attendanceData.length} data
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
            >
              <LogOutIcon className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Data</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRecords}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Karyawan</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Masuk Hari Ini</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayCheckIns}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pulang Hari Ini</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayCheckOuts}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Export */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Filter & Export Data</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Tanggal
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Nama Karyawan
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Cari nama..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                Jabatan
              </label>
              <input
                type="text"
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                placeholder="Cari jabatan..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
              >
                <option value="">Semua Status</option>
                <option value="masuk">Masuk</option>
                <option value="pulang">Pulang</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {hasActiveFilters ? (
                <span className="font-medium">Menampilkan <span className="text-red-600">{filteredData.length}</span> dari {attendanceData.length} data</span>
              ) : (
                <span>Menampilkan semua {attendanceData.length} data</span>
              )}
            </div>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 transform hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Mengekspor...' : 'Export ke Excel'}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Data Absensi Real-Time</h2>
              <div className="ml-auto flex items-center gap-2 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-medium">Live</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Karyawan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Waktu</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 text-gray-400" />
                        <p className="font-medium">Belum ada data absensi</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {record.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {record.jobPosition || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {record.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          record.type === 'masuk'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.type === 'masuk' ? '🟢 Masuk' : '🔴 Pulang'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.formattedDateTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
