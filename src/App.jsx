import { useState } from 'react';
import { Shield } from 'lucide-react';
import EmployeePage from './pages/EmployeePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Floating Admin Button */}
      <button
        onClick={() => setShowAdmin(!showAdmin)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        title="Admin Panel"
      >
        <Shield className="w-6 h-6" />
      </button>

      {/* Content */}
      {showAdmin ? <AdminPage /> : <EmployeePage />}
    </div>
  );
}

export default App;
