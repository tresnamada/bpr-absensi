import { useState, useEffect } from 'react';
import { Download, RefreshCw, Calendar, Users, TrendingUp, Search } from 'lucide-react';
import { getAllAttendance } from '../services/attendanceService';
import { exportToExcel } from '../utils/excelExport';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [attendanceData, searchTerm, filterDate, filterType]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const data = await getAllAttendance();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      alert('Gagal memuat data absensi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceData];

    // Filter by search term (employee name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(record =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(record => record.date === filterDate);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }

    setFilteredData(filtered);
  };

  const handleExport = () => {
    try {
      const dataToExport = filteredData.length > 0 ? filteredData : attendanceData;
      exportToExcel(dataToExport);
      alert('Data berhasil diekspor ke Excel!');
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Gagal mengekspor data: ' + error.message);
    }
  };

  const getStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceData.filter(r => r.date === today);
    const uniqueEmployees = new Set(attendanceData.map(r => r.employeeName)).size;
    const todayCheckIns = todayRecords.filter(r => r.type === 'masuk').length;

    return {
      totalRecords: attendanceData.length,
      uniqueEmployees,
      todayCheckIns
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 mt-1">Kelola dan pantau data absensi karyawan</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadAttendanceData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Absensi</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRecords}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Karyawan</p>
                <p className="text-3xl font-bold text-gray-900">{stats.uniqueEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Masuk Hari Ini</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayCheckIns}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Nama Karyawan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nama karyawan..."
                />
              </div>
            </div>

            {/* Filter by date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Tanggal
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filter by type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Status
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Semua</option>
                <option value="masuk">Masuk</option>
                <option value="pulang">Pulang</option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {(searchTerm || filterDate || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDate('');
                setFilterType('all');
              }}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Absensi ({filteredData.length} records)
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada data absensi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Karyawan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {record.employeeName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {record.employeeName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          record.type === 'masuk'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {record.type === 'masuk' ? '🟢 Masuk' : '🔴 Pulang'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
