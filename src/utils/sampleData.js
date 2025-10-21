// Sample data untuk testing (opsional)
// Gunakan ini jika ingin populate database dengan data dummy

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const sampleEmployees = [
  'Budi Santoso',
  'Siti Nurhaliza',
  'Ahmad Wijaya',
  'Dewi Lestari',
  'Rudi Hartono'
];

const generateSampleAttendance = async () => {
  try {
    const today = new Date();
    const promises = [];

    // Generate data untuk 5 hari terakhir
    for (let day = 0; day < 5; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);

      // Generate data untuk setiap karyawan
      for (const employee of sampleEmployees) {
        // Absen masuk (random antara 07:00-09:00)
        const checkInHour = 7 + Math.floor(Math.random() * 2);
        const checkInMinute = Math.floor(Math.random() * 60);
        const checkInTime = new Date(date);
        checkInTime.setHours(checkInHour, checkInMinute, 0);

        const checkInData = {
          employeeName: employee,
          type: 'masuk',
          timestamp: checkInTime,
          date: checkInTime.toISOString().split('T')[0],
          time: `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}:00`,
          formattedDateTime: `${checkInTime.getDate()}/${checkInTime.getMonth() + 1}/${checkInTime.getFullYear()} ${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}:00`
        };

        promises.push(addDoc(collection(db, 'attendance'), checkInData));

        // Absen pulang (random antara 16:00-18:00)
        const checkOutHour = 16 + Math.floor(Math.random() * 2);
        const checkOutMinute = Math.floor(Math.random() * 60);
        const checkOutTime = new Date(date);
        checkOutTime.setHours(checkOutHour, checkOutMinute, 0);

        const checkOutData = {
          employeeName: employee,
          type: 'pulang',
          timestamp: checkOutTime,
          date: checkOutTime.toISOString().split('T')[0],
          time: `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}:00`,
          formattedDateTime: `${checkOutTime.getDate()}/${checkOutTime.getMonth() + 1}/${checkOutTime.getFullYear()} ${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}:00`
        };

        promises.push(addDoc(collection(db, 'attendance'), checkOutData));
      }
    }

    await Promise.all(promises);
    console.log('✅ Sample data berhasil ditambahkan!');
    console.log(`📊 Total records: ${promises.length}`);
    return { success: true, count: promises.length };
  } catch (error) {
    console.error('❌ Error generating sample data:', error);
    throw error;
  }
};

export { generateSampleAttendance, sampleEmployees };
