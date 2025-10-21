# 📋 Sistem Absensi BPR

Aplikasi web modern untuk pencatatan kehadiran karyawan BPR dengan validasi waktu real-time dan dashboard admin yang lengkap.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.18-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-ffca28)

## ✨ Fitur Utama

### 👥 **Untuk Karyawan**
- ✅ Form absensi masuk dan pulang
- ✅ Validasi waktu otomatis (WIB/Asia Jakarta)
- ✅ Input nama dan jabatan
- ✅ Maksimal 2 absensi per hari (masuk & pulang)
- ✅ Tombol otomatis disabled setelah absen
- ✅ Tampilan modern dan responsif

### 🛡️ **Untuk Admin**
- ✅ Dashboard statistik real-time
- ✅ Filter data (tanggal, nama, jabatan, status)
- ✅ Export ke Excel (.xlsx)
- ✅ Tabel data dengan live updates
- ✅ Protected dengan password
- ✅ 4 kartu statistik (Total Data, Total Karyawan, Masuk Hari Ini, Pulang Hari Ini)

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** TailwindCSS 3
- **Backend:** Firebase Firestore
- **Icons:** Lucide React
- **Excel Export:** xlsx
- **Date Handling:** date-fns + date-fns-tz
- **Package Manager:** Bun

## 📦 Installation

### Prerequisites
- Node.js 20.19+ atau 22.12+
- Bun (recommended) atau npm
- Firebase account

### Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/tresnamada/bpr-absensi.git
   cd bpr-absensi
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # atau
   npm install
   ```

3. **Setup Environment Variables**
   
   Buat file `.env.local` di root folder:
   ```env
   # Admin Password
   VITE_ADMIN_PASSWORD=your_secure_password
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run Development Server**
   ```bash
   bun run dev
   # atau
   npm run dev
   ```

5. **Open Browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build for Production

```bash
# Build
bun run build

# Preview production build
bun run preview
```

## 📁 Project Structure

```
absensi-bpr/
├── public/
│   └── favicon.svg          # Custom favicon
├── src/
│   ├── components/
│   │   ├── AttendanceForm.jsx    # Form absensi karyawan
│   │   └── AdminPanel.jsx        # Panel admin (deprecated)
│   ├── pages/
│   │   ├── EmployeePage.jsx      # Halaman karyawan
│   │   └── AdminPage.jsx         # Halaman admin
│   ├── services/
│   │   └── attendanceService.js  # Firebase CRUD operations
│   ├── utils/
│   │   └── excelExport.js        # Excel export functionality
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # This file
```

## 🎯 Usage

### **Karyawan - Absensi**

1. Buka aplikasi
2. Isi nama lengkap
3. Isi jabatan
4. Klik "Absen Masuk" (07:00-12:00 WIB)
5. Klik "Absen Pulang" (12:00-18:00 WIB)

### **Admin - Dashboard**

1. Klik tombol Shield (🛡️) di pojok kanan bawah
2. Masukkan password admin
3. Lihat statistik dan data absensi
4. Gunakan filter untuk mencari data
5. Export ke Excel jika diperlukan

## 🔐 Security

- ✅ Password admin menggunakan environment variables
- ✅ Firebase config menggunakan environment variables
- ✅ `.env.local` tidak di-commit ke Git
- ✅ Tidak ada hardcoded secrets
- ✅ Firebase security rules (setup manual)

## 🌐 Deployment

### **Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

### **Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### **Firebase Hosting**
```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy
```

**Jangan lupa:** Setup environment variables di hosting provider!

## 📊 Features Detail

### **Validasi Waktu**
- Check-in: 07:00 - 12:00 WIB
- Check-out: 12:00 - 18:00 WIB
- Timezone: Asia/Jakarta (WIB)

### **Filter Admin**
- Filter by tanggal
- Filter by nama karyawan
- Filter by jabatan
- Filter by status (masuk/pulang)

### **Export Excel**
Kolom yang di-export:
- No
- Nama Karyawan
- Jabatan
- Tanggal
- Waktu
- Status
- Timestamp

## 🐛 Troubleshooting

### **Build Error**
```bash
# Clear cache
rm -rf node_modules
bun install
```

### **Firebase Error**
- Check `.env.local` configuration
- Verify Firebase project is active
- Check Firestore rules

### **Admin Password Not Working**
- Check `VITE_ADMIN_PASSWORD` in `.env.local`
- Restart dev server after changing `.env.local`

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

Developed for BPR internal use.

## 🤝 Contributing

This is a private project. For internal contributions, please contact the project maintainer.

## 📞 Support

For issues or questions, please contact the development team.

---

**Version:** 2.0.0  
**Last Updated:** Oktober 2025  
**Status:** ✅ Production Ready
