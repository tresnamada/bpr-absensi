import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToExcel = (attendanceData, filename = 'Data_Absensi_BPR') => {
  try {
    // Prepare data for Excel
    const excelData = attendanceData.map((record, index) => ({
      'No': index + 1,
      'Nama Karyawan': record.employeeName,
      'Jabatan': record.jobPosition || '-',
      'Tanggal': record.date,
      'Waktu': record.time,
      'Status': record.type === 'masuk' ? 'Masuk' : 'Pulang',
      'Timestamp': record.formattedDateTime
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama Karyawan
      { wch: 20 }, // Jabatan
      { wch: 12 }, // Tanggal
      { wch: 10 }, // Waktu
      { wch: 10 }, // Status
      { wch: 20 }  // Timestamp
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');

    // Generate filename with current date
    const currentDate = format(new Date(), 'yyyy-MM-dd_HHmmss');
    const fullFilename = `${filename}_${currentDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fullFilename);

    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Auto-export function - saves Excel file automatically with fixed name
export const autoExportToExcel = (attendanceData) => {
  try {
    // Prepare data for Excel
    const excelData = attendanceData.map((record, index) => ({
      'No': index + 1,
      'Nama Karyawan': record.employeeName,
      'Jabatan': record.jobPosition || '-',
      'Tanggal': record.date,
      'Waktu': record.time,
      'Status': record.type === 'masuk' ? 'Masuk' : 'Pulang',
      'Timestamp': record.formattedDateTime
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama Karyawan
      { wch: 20 }, // Jabatan
      { wch: 12 }, // Tanggal
      { wch: 10 }, // Waktu
      { wch: 10 }, // Status
      { wch: 20 }  // Timestamp
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');

    // Fixed filename - will always update the same file
    const fullFilename = 'Data_Absensi_BPR.xlsx';

    // Download/Save file
    XLSX.writeFile(workbook, fullFilename);

    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Error auto-exporting to Excel:', error);
    throw error;
  }
};

// Export filtered data by date range
export const exportByDateRange = (attendanceData, startDate, endDate) => {
  const filteredData = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const dateRangeStr = `${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`;
  return exportToExcel(filteredData, `Absensi_${dateRangeStr}`);
};
