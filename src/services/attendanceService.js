import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Jakarta'; // WIB timezone

// Get current time in WIB
export const getCurrentWIBTime = () => {
  return toZonedTime(new Date(), TIMEZONE);
};

// Check if current time is within allowed range
export const validateAttendanceTime = (type) => {
  const now = getCurrentWIBTime();
  const hours = now.getHours();
  const minutes = hours * 60 + now.getMinutes();

  if (type === 'masuk') {
    // Check-in: 07:00 - 12:00
    const start = 7 * 60; // 07:00
    const end = 12 * 60; // 12:00
    return minutes >= start && minutes <= end;
  } else if (type === 'pulang') {
    // Check-out: 12:00 - 18:00
    const start = 12 * 60; // 12:00
    const end = 18 * 60; // 18:00
    return minutes >= start && minutes <= end;
  }
  return false;
};


export const getAllowedTimeRange = (type) => {
  if (type === 'masuk') {
    return '07:00 - 12:00 WIB';
  } else if (type === 'pulang') {
    return '12:00 - 18:00 WIB';
  }
  return '';
};


export const getTodayAttendance = async (employeeName) => {
  try {
    const now = getCurrentWIBTime();
    const today = format(now, 'yyyy-MM-dd');

    const q = query(
      collection(db, 'attendance'),
      where('employeeName', '==', employeeName),
      where('date', '==', today)
    );

    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });

    // Sort manually by timestamp
    records.sort((a, b) => {
      const timeA = new Date(a.timestamp?.seconds * 1000 || a.formattedDateTime);
      const timeB = new Date(b.timestamp?.seconds * 1000 || b.formattedDateTime);
      return timeA - timeB;
    });

    return records;
  } catch (error) {
    console.error('Error getting today attendance:', error);
    throw error;
  }
};

// Submit attendance
export const submitAttendance = async (employeeName, jobPosition, type) => {
  try {
    // Validate time
    if (!validateAttendanceTime(type)) {
      throw new Error(`Absensi ${type} hanya bisa dilakukan pada jam ${getAllowedTimeRange(type)}`);
    }

    // Check today's attendance
    const todayRecords = await getTodayAttendance(employeeName);

    // Check if already checked in/out for this type
    const existingRecord = todayRecords.find(record => record.type === type);
    if (existingRecord) {
      throw new Error(`Anda sudah melakukan absensi ${type} hari ini`);
    }

    // Check if trying to check out without checking in
    if (type === 'pulang') {
      const hasCheckedIn = todayRecords.some(record => record.type === 'masuk');
      if (!hasCheckedIn) {
        throw new Error('Anda harus absen masuk terlebih dahulu');
      }
    }

    // Add attendance record
    const now = getCurrentWIBTime();
    const attendanceData = {
      employeeName,
      jobPosition,
      type,
      timestamp: now,
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm:ss'),
      formattedDateTime: format(now, 'dd/MM/yyyy HH:mm:ss')
    };

    const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
    
    return {
      success: true,
      id: docRef.id,
      ...attendanceData
    };
  } catch (error) {
    console.error('Error submitting attendance:', error);
    throw error;
  }
};

// Get all attendance records (for admin)
export const getAllAttendance = async () => {
  try {
    // Get all records without ordering (to avoid index requirement)
    const querySnapshot = await getDocs(collection(db, 'attendance'));
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });

    // Sort manually by timestamp (descending - newest first)
    records.sort((a, b) => {
      const timeA = new Date(a.timestamp?.seconds * 1000 || a.formattedDateTime);
      const timeB = new Date(b.timestamp?.seconds * 1000 || b.formattedDateTime);
      return timeB - timeA; // Descending order
    });

    return records;
  } catch (error) {
    console.error('Error getting all attendance:', error);
    throw error;
  }
};

// Get attendance by date range
export const getAttendanceByDateRange = async (startDate, endDate) => {
  try {
    // Get all records and filter manually to avoid index requirement
    const querySnapshot = await getDocs(collection(db, 'attendance'));
    const records = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const recordTime = new Date(data.timestamp?.seconds * 1000 || data.formattedDateTime);
      
      // Filter by date range
      if (recordTime >= startDate && recordTime <= endDate) {
        records.push({ id: doc.id, ...data });
      }
    });

    // Sort by timestamp (descending)
    records.sort((a, b) => {
      const timeA = new Date(a.timestamp?.seconds * 1000 || a.formattedDateTime);
      const timeB = new Date(b.timestamp?.seconds * 1000 || b.formattedDateTime);
      return timeB - timeA;
    });

    return records;
  } catch (error) {
    console.error('Error getting attendance by date range:', error);
    throw error;
  }
};

// Real-time listener for today's attendance
export const listenToTodayAttendance = (employeeName, callback) => {
  try {
    const now = getCurrentWIBTime();
    const today = format(now, 'yyyy-MM-dd');

    const q = query(
      collection(db, 'attendance'),
      where('employeeName', '==', employeeName),
      where('date', '==', today)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });

      // Sort manually by timestamp
      records.sort((a, b) => {
        const timeA = new Date(a.timestamp?.seconds * 1000 || a.formattedDateTime);
        const timeB = new Date(b.timestamp?.seconds * 1000 || b.formattedDateTime);
        return timeA - timeB;
      });

      callback(records);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    throw error;
  }
};

// Real-time listener for all attendance records
export const listenToAllAttendance = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db, 'attendance'), (querySnapshot) => {
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });

      // Sort manually by timestamp (descending - newest first)
      records.sort((a, b) => {
        const timeA = new Date(a.timestamp?.seconds * 1000 || a.formattedDateTime);
        const timeB = new Date(b.timestamp?.seconds * 1000 || b.formattedDateTime);
        return timeB - timeA;
      });

      callback(records);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    throw error;
  }
};
