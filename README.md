# SIMPKL Robotics 🤖

**Sistem Informasi Monitoring Praktik Kerja Lapangan (PKL)**

SIMPKL Robotics adalah sebuah sistem informasi berbasis _cloud_ yang dirancang untuk memonitor, mengelola, dan mendokumentasikan seluruh aktivitas Praktik Kerja Lapangan (PKL) secara _real-time_. Sistem ini dikembangkan sebagai solusi terpadu di lingkungan akademik Ilmu Komputer Universitas Djuanda, memungkinkan digitalisasi rekapitulasi kehadiran, laporan training, dan evaluasi peserta tanpa memerlukan infrastruktur _server_ tradisional.

---

## 🚀 Fitur Utama

Sistem ini menggunakan arsitektur _Role-Based Access Control_ (RBAC) yang membedakan hak akses antara **Peserta** dan **Pembimbing/Admin**.

- **📊 Dashboard Monitoring:** Panel analitik interaktif bagi pembimbing untuk memantau jumlah peserta aktif, statistik kehadiran hari ini, dan rekapitulasi _training_ secara _real-time_.
- **📅 Sistem Absensi:** Fitur pencatatan waktu masuk dan pulang peserta PKL.
- **🏫 Manajemen Training:** Formulir pelaporan kegiatan harian/training yang mencakup data institusi sekolah, jenjang, peran peserta, dan materi yang disampaikan.
- **📷 Galeri Dokumentasi:** Integrasi penyimpanan langsung ke Google Drive. Peserta dapat mengunggah foto kegiatan yang kemudian ditampilkan dalam bentuk galeri dan _popup preview_ bagi pembimbing.
- **⭐ Modul Penilaian Sikap:** Antarmuka khusus bagi pembimbing untuk menginput, mengedit, dan merekapitulasi nilai evaluasi mingguan peserta (disiplin, tanggung jawab, komunikasi, kerja sama, dan inisiatif).

---

## 🛠️ Tech Stack & Arsitektur

Proyek ini dibangun sepenuhnya menggunakan arsitektur _Serverless_ dari Google Workspace:

- **Backend:** [Google Apps Script (GAS)](https://developers.google.com/apps-script) - Menjalankan logika server, API internal, dan interaksi _filesystem_.
- **Database:** **Google Sheets** - Berfungsi sebagai basis data relasional ringan dengan _sheet_ yang saling terhubung.
- **Storage:** **Google Drive** - Penyimpanan terpusat untuk _file_ dokumentasi _training_ (.jpg, .png).
- **Frontend:** **HTML5, Vanilla JavaScript, & [Tailwind CSS](https://tailwindcss.com/)** - Menghasilkan antarmuka _Single Page Application_ (SPA) yang responsif dan modern melalui `HtmlService`.

---

## 📂 Struktur Database (Google Sheets)

Sistem membaca dan menulis pada dokumen Google Sheets tunggal yang terdiri dari 7 tab (_sheets_) wajib:

1. `Users`: Autentikasi dan pendaftaran email (Akses).
2. `Peserta`: Data induk mahasiswa PKL.
3. `Absensi`: Log waktu kehadiran.
4. `Training`: Data kegiatan/materi mengajar.
5. `Training_Peserta`: Tabel relasi antara kegiatan dan peserta (tim).
6. `Dokumentasi`: Log _ID Drive_ dan _URL_ unggahan foto.
7. `Penilaian_Sikap`: Rekapitulasi nilai per minggu dari dosen pembimbing.

Users (Sheet 1)
Kolom: ID_User, Email, Nama, Role, Status

Peserta (Sheet 2)
Kolom: ID_Peserta, Email_Google, Nama_Lengkap, Asal_Sekolah_Kampus, Jurusan, Nomor_Telepon, Tanggal_Mulai, Tanggal_Selesai, Status_Peserta

Absensi (Sheet 3)
Kolom: ID_Absen, Tanggal, ID_Peserta, Jam_Masuk, Jam_Pulang, Status_Kehadiran, Keterangan

Training (Sheet 4)
Kolom: ID_Training, Tanggal, Nama_Sekolah, Jenjang, Materi, Jumlah_Siswa, Catatan

Training_Peserta (Sheet 5)
Kolom: ID, ID_Training, ID_Peserta, Peran

Dokumentasi (Sheet 6)
Kolom: ID_Dokumentasi, Tanggal, ID_Training, ID_Peserta, Drive_File_ID, Drive_URL_View, Keterangan

Penilaian_Sikap (Sheet 7)
Kolom: ID_Nilai, ID_Peserta, Tanggal_Penilaian, Minggu_Ke, Disiplin, Tanggung_Jawab, Komunikasi, Kerja_Sama, Inisiatif, Catatan_Pembimbing

---

## ⚙️ Cara Instalasi & Deployment

Karena menggunakan Google Apps Script (Bound Script), proses instalasinya adalah sebagai berikut:

### 1. Persiapan Database

1. Buat folder baru di Google Drive.
2. Buat file Google Sheets baru di dalam folder tersebut.
3. Buat 7 tab (_sheet_) sesuai dengan **Struktur Database** di atas beserta _header_ kolomnya.

### 2. Konfigurasi Apps Script

1. Buka Google Sheets yang telah dibuat, klik menu **Ekstensi > Apps Script**.
2. Salin seluruh _source code_ berformat `.gs` dari repositori ini (seperti `Main.gs`, `Dashboard.gs`, `PesertaDetail.gs`, `Penilaian.gs`, dll) ke dalam editor Apps Script.
3. Buat file HTML baru bernama `index.html` dan salin kode _frontend_ ke dalamnya.
4. Sesuaikan konstanta nama _sheet_ pada file `Config.gs` (jika ada).

### 3. Deployment

1. Di editor Apps Script, klik tombol **Terapkan (Deploy) > Deployment Baru**.
2. Pilih jenis **Aplikasi Web (Web App)**.
3. Atur konfigurasi:
   - **Jalankan sebagai:** User accessing the web app (Pengguna yang mengakses aplikasi web).
   - **Siapa yang memiliki akses:** Anyone with Google account (Siapa saja yang memiliki Akun Google).
4. Klik **Terapkan**, setujui izin otorisasi (_permissions_), dan salin URL Web App yang dihasilkan.
5. Sistem siap digunakan!

---

## 👨‍💻 Pengembang

Dikembangkan oleh:
**Aulia Alhafidz**
_Program Studi Ilmu Komputer_
_Universitas Djuanda_

---

_© 2026 SIMPKL Robotics Project. Open-source under MIT License._
