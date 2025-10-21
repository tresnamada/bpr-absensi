import { useState, useEffect } from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle, Download, LogIn, LogOut, Briefcase } from 'lucide-react';
import { 
  submitAttendance, 
  listenToTodayAttendance, 
  validateAttendanceTime,
  getAllowedTimeRange,
  getCurrentWIBTime
} from '../services/attendanceService';
import { format } from 'date-fns';

const AttendanceForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [todayRecords, setTodayRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(getCurrentWIBTime());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentWIBTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real-time listener for today's attendance
  useEffect(() => {
    if (employeeName.trim()) {
      const unsubscribe = listenToTodayAttendance(employeeName.trim(), (records) => {
        setTodayRecords(records);
      });

      return () => unsubscribe();
    } else {
      setTodayRecords([]);
    }
  }, [employeeName]);

  const handleSubmit = async (type) => {
    if (!employeeName.trim()) {
      setMessage({ type: 'error', text: 'Nama karyawan harus diisi' });
      return;
    }
    if (!jobPosition.trim()) {
      setMessage({ type: 'error', text: 'Jabatan harus diisi' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await submitAttendance(employeeName.trim(), jobPosition.trim(), type);
      setMessage({ 
        type: 'success', 
        text: `Absensi ${type} berhasil dicatat pada ${result.formattedDateTime}` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };


  const hasCheckedIn = todayRecords.some(r => r.type === 'masuk');
  const hasCheckedOut = todayRecords.some(r => r.type === 'pulang');
  const canCheckIn = validateAttendanceTime('masuk') && !hasCheckedIn;
  const canCheckOut = validateAttendanceTime('pulang') && hasCheckedIn && !hasCheckedOut;
  const maxAttendanceReached = hasCheckedIn && hasCheckedOut;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">Sistem Absensi</h1>
          <p className="text-gray-600 text-lg font-medium">BPR - Bank Perkreditan Rakyat</p>
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="font-medium">Real-time Updates</span>
          </div>
        </div>

        {/* Current Time Display - Elegant Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 backdrop-blur-sm bg-opacity-95">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-red-600" />
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Waktu Saat Ini (WIB)</p>
            </div>
            <p className="text-5xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2 tracking-tight">
              {format(currentTime, 'HH:mm:ss')}
            </p>
            <p className="text-base text-gray-600 font-medium">
              {format(currentTime, 'EEEE, dd MMMM yyyy')}
            </p>
          </div>
        </div>

        {/* Main Form - Elegant Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 mb-6 backdrop-blur-sm bg-opacity-95">
          {/* Employee Name Input */}
          <div className="mb-6">
            <label htmlFor="employeeName" className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Nama Karyawan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-red-400" />
              </div>
              <input
                type="text"
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
                placeholder="Masukkan nama lengkap Anda"
                disabled={loading}
              />
            </div>
          </div>

          {/* Job Position Input */}
          <div className="mb-6">
            <label htmlFor="jobPosition" className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Jabatan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-red-400" />
              </div>
              <input
                type="text"
                id="jobPosition"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
                placeholder="Contoh: Teller, Customer Service, Manager"
                disabled={loading}
              />
            </div>
          </div>

          {/* Attendance Status */}
          {employeeName.trim() && (
            <div className="mb-6 p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Status Absensi Hari Ini</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${hasCheckedIn ? 'bg-white border-green-500 shadow-md' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <LogIn className={`w-5 h-5 ${hasCheckedIn ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold text-gray-600 uppercase">Masuk</span>
                  </div>
                  <span className={`flex items-center text-sm font-bold ${hasCheckedIn ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasCheckedIn ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Sudah
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        Belum
                      </>
                    )}
                  </span>
                </div>
                <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${hasCheckedOut ? 'bg-white border-red-500 shadow-md' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <LogOut className={`w-5 h-5 ${hasCheckedOut ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold text-gray-600 uppercase">Pulang</span>
                  </div>
                  <span className={`flex items-center text-sm font-bold ${hasCheckedOut ? 'text-red-600' : 'text-gray-400'}`}>
                    {hasCheckedOut ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Sudah
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        Belum
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Time Info */}
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-900">
                <p className="font-bold mb-2 uppercase tracking-wide">Jam Absensi:</p>
                <div className="space-y-1">
                  <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span className="font-semibold">Masuk:</span> {getAllowedTimeRange('masuk')}</p>
                  <p className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span><span className="font-semibold">Pulang:</span> {getAllowedTimeRange('pulang')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSubmit('masuk')}
              disabled={loading || !canCheckIn || !employeeName.trim()}
              className={`group relative py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform ${
                canCheckIn && employeeName.trim()
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" />
                {loading ? 'Memproses...' : 'Absen Masuk'}
              </span>
              {canCheckIn && employeeName.trim() && (
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>

            <button
              onClick={() => handleSubmit('pulang')}
              disabled={loading || !canCheckOut || !employeeName.trim()}
              className={`group relative py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform ${
                canCheckOut && employeeName.trim()
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                {loading ? 'Memproses...' : 'Absen Pulang'}
              </span>
              {canCheckOut && employeeName.trim() && (
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          {/* Max Attendance Warning */}
          {maxAttendanceReached && (
            <div className="mt-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
              <p className="text-sm text-green-800 text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Anda sudah menyelesaikan absensi hari ini
              </p>
            </div>
          )}

          {/* Message Display */}
          {message.text && (
            <div className={`mt-5 p-4 rounded-xl border-2 shadow-sm ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-900' 
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-900'
            }`}>
              <p className="text-sm font-bold text-center">{message.text}</p>
            </div>
          )}

        </div>

        {/* Today's Records */}
        {todayRecords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 backdrop-blur-sm bg-opacity-95">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Riwayat Hari Ini</h3>
            </div>
            <div className="space-y-3">
              {todayRecords.map((record, index) => (
                <div key={index} className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                  record.type === 'masuk' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      record.type === 'masuk' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {record.type === 'masuk' ? (
                        <LogIn className="w-6 h-6 text-green-700" />
                      ) : (
                        <LogOut className="w-6 h-6 text-red-700" />
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-base ${
                        record.type === 'masuk' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {record.type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">{record.formattedDateTime}</p>
                    </div>
                  </div>
                  <CheckCircle className={`w-7 h-7 ${
                    record.type === 'masuk' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceForm;
