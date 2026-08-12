# Instruksi Pengembangan Order Management Center

## Tujuan

Kembangkan halaman `pemilik_marketplace_orderview.dart` menjadi **Order Management Center** yang profesional, modern, dan responsif, dengan pengalaman penggunaan seperti sistem merchant pada aplikasi delivery modern.

Jangan menghapus atau merusak fitur maupun logic order yang sudah berjalan. Pertahankan kompatibilitas dengan backend dan struktur project yang ada.

Halaman yang saat ini menampilkan daftar **Pesanan Masuk** dengan nomor order, nama customer, ringkasan menu, waktu, total, dan status harus tetap dipertahankan sebagai halaman utama. Pengembangan dilakukan di atas halaman tersebut: setiap card order dapat dibuka untuk mengelola order, berkomunikasi dengan pihak terkait, dan memantau proses pengantaran.

## Alur fitur order yang diinginkan

Pemilik marketplace harus dapat mengikuti satu order secara lengkap melalui alur berikut:

```text
Pesanan masuk
    ↓
Pemilik menerima atau menolak pesanan
    ↓
Pesanan dipersiapkan oleh outlet
    ↓
Pesanan siap diambil driver
    ↓
Driver ditugaskan dan mengambil pesanan
    ↓
Driver mengantarkan pesanan
    ↓
Driver tiba di customer
    ↓
Pesanan selesai
```

Pada setiap tahap, pemilik dapat membuka detail order untuk melihat status terbaru, mengetahui pihak yang sedang menangani order, menggunakan chat yang sesuai, dan melihat lokasi driver jika tracking sudah aktif.

Jangan membuat halaman order terpisah yang tidak terhubung dengan daftar Pesanan Masuk. Chat, detail, timeline, dan tracking harus selalu membawa konteks nomor order yang sedang dipilih.

## Aturan wajib sebelum coding

1. Analisis terlebih dahulu struktur project, routing, state management, dan file terkait.
2. Identifikasi serta gunakan model/service yang sudah tersedia untuk:
   - Order
   - Customer
   - Driver
   - Marketplace/outlet
   - Product/menu
   - Review/rating
   - Authentication
   - Database/API
   - Chat/messaging
   - GPS/location tracking
   - Map
   - Notification
3. Jangan membuat data dummy jika data asli sudah tersedia.
4. Jangan membuat backend, database, sistem chat, map, atau API key baru apabila project sudah memiliki implementasinya.
5. Jika suatu backend belum tersedia, buat UI dan service abstraction yang jelas, aman, dan mudah dihubungkan kemudian. Tandai bagian yang masih memerlukan integrasi backend.
6. Implementasikan perubahan secara bertahap dan verifikasi setiap tahap.

## Fitur utama

### 1. Tab dan filter status order

Pertahankan status yang sudah ada dan sediakan struktur untuk status tambahan berikut:

- Semua
- Menunggu
- Diproses
- Siap
- Diambil
- Selesai
- Dibatalkan

Setiap tab menampilkan jumlah order, misalnya `Menunggu (3)`. Jika status tertentu belum didukung backend, tampilkan UI yang kompatibel tanpa memaksakan perubahan backend.

Tambahkan search bar untuk mencari berdasarkan:

- Nomor order
- Nama customer
- Nama menu
- Nama driver

Tambahkan filter melalui bottom sheet untuk tanggal, status, driver, dan customer.

### 2. Order card

Tampilkan setiap order dalam card modern yang memuat:

- Nomor order
- Waktu order dan zona waktu yang sesuai
- Nama/customer dan avatar jika tersedia
- Ringkasan item, jumlah, dan total pembayaran
- Status order dengan warna/indikator intuitif
- Informasi driver jika sudah ditugaskan
- Tombol aksi yang relevan
- Tombol `Chat Customer` yang benar-benar membuka chat terkait order

Tambahkan akses yang jelas pada card atau detail order untuk:

- `Chat Customer`, agar pemilik dapat menanyakan atau memberi informasi terkait pesanan.
- `Chat Driver`, hanya jika driver sudah ditugaskan atau mengambil order.
- `Tracking Driver`, hanya jika driver sudah menerima order dan lokasi tersedia/fitur tracking aktif.

Jangan menampilkan tombol chat atau tracking sebagai ikon dekoratif. Setiap tombol harus membuka fitur yang benar-benar berfungsi atau menampilkan state yang menjelaskan mengapa fitur belum tersedia.

Card harus tetap mudah dibaca pada layar smartphone kecil sampai besar.

### 3. Order detail

Saat card diklik, tampilkan halaman detail atau bottom sheet yang dapat di-scroll, bukan popup sederhana.

Detail minimal:

- Informasi customer dan nomor kontak jika tersedia
- Tombol `Chat Customer`
- Rincian item, kuantitas, harga, subtotal, biaya delivery, dan total
- Status order
- Informasi driver, rating, kendaraan, dan nomor kendaraan jika tersedia
- Tombol `Chat Driver` dan `Tracking Driver` jika driver sudah ditugaskan
- Timeline progres order/driver
- Alasan pembatalan jika order dibatalkan
- Rating customer atau informasi transaksi jika order selesai

Detail order harus menjadi pusat kendali untuk order tersebut. Dari satu halaman ini pemilik harus dapat:

1. Melihat siapa customer dan isi order.
2. Melihat tahap persiapan, pengambilan, pengantaran, dan penyelesaian order.
3. Chat dengan customer.
4. Melihat informasi driver yang ditugaskan.
5. Chat dengan driver.
6. Membuka tracking driver di map.

Jika belum ada driver, tampilkan `Menunggu driver ditugaskan` dan nonaktifkan tracking driver dengan penjelasan yang jelas. Jika driver sudah ada tetapi lokasi belum tersedia, tampilkan informasi driver dan status `Lokasi belum tersedia`, bukan lokasi palsu.

### 4. Action berdasarkan status

Tampilkan action button berdasarkan status dan kemampuan backend yang tersedia:

- **Menunggu:** `Terima Pesanan`, `Tolak Pesanan`
- **Diproses:** `Tandai Siap`
- **Siap:** tampilkan status menunggu driver; jika driver ditemukan, tampilkan chat dan tracking
- **Diambil:** tampilkan status sedang diantar, `Tracking Driver`, dan `Chat Driver`
- **Selesai:** tampilkan konfirmasi selesai, total transaksi, dan rating customer
- **Dibatalkan:** tampilkan status serta alasan pembatalan

Untuk penolakan, gunakan confirmation dialog dan input alasan jika sistem mendukungnya.

### 5. Chat customer dan driver

Implementasikan chat yang terikat pada order tertentu. Jangan membuat chat hanya sebagai dekorasi.

Chat customer harus dapat dibuka dari order card dan detail order. Chat driver hanya tersedia jika driver ditugaskan pada order tersebut. Sediakan dua tombol terpisah jika keduanya tersedia: `Chat Customer` dan `Chat Driver`.

Chat minimal harus memiliki:

- Bubble pesan
- Nama pengirim
- Timestamp/waktu pesan
- Input teks
- Tombol kirim
- Auto-scroll ke pesan terbaru
- Keyboard-safe layout
- Loading state
- Empty state
- Error state
- Indikator pesan belum dibaca
- Read/unread indicator jika didukung backend

Gunakan Firebase/Firestore/Realtime Database atau messaging service yang sudah ada. Pastikan pengguna hanya dapat mengakses percakapan yang terkait dengan order dan pihak yang berwenang.

### 6. Driver dan tracking

Pada order yang memiliki driver, tampilkan:

- Nama driver
- Foto/avatar jika tersedia
- Rating
- Jenis dan nomor kendaraan
- Status perjalanan
- Jarak dari outlet jika tersedia
- Estimasi waktu tiba jika tersedia
- `Chat Driver`
- `Lihat Lokasi Driver` atau `Tracking Driver`

Tracking aktif hanya ketika driver telah menerima/ditugaskan dan order berada pada tahap pengambilan atau pengantaran.

Informasi tracking pada detail order sebaiknya berupa card ringkas, misalnya:

```text
Driver sedang menuju outlet
Budi Santoso · Motor B 1234 XYZ
Jarak dari outlet: 1,2 km
Estimasi tiba: 5 menit

[ Chat Driver ] [ Lihat Tracking ]
```

Status tersebut harus mengikuti data order dan lokasi yang sebenarnya. Perbarui ringkasan ketika status driver atau lokasi berubah.

Buat halaman tracking yang memuat:

- Map provider yang sudah digunakan project
- Marker driver
- Marker outlet
- Marker customer jika koordinat dan izin tersedia
- Ringkasan driver
- Status perjalanan
- Estimasi tiba
- Tombol `Chat Driver`

Jika sistem sudah memiliki GPS/location tracking, gunakan data tersebut dan perbarui posisi secara real-time atau berkala sesuai kemampuan backend. Jangan menggunakan lokasi dummy jika data asli tersedia. Jika tracking belum tersedia, buat service abstraction yang siap dihubungkan ke GPS tanpa membuat API key atau konfigurasi palsu.

### 7. Timeline status

Gunakan timeline atau stepper untuk memperlihatkan progres, misalnya:

1. Pesanan diterima
2. Driver ditemukan
3. Driver menuju outlet
4. Pesanan diambil
5. Menuju customer
6. Selesai

Sesuaikan langkah dengan status/data yang benar-benar tersedia. Jangan menampilkan status seolah-olah sudah terjadi jika backend belum mengonfirmasinya.

Timeline harus terlihat langsung pada detail order sehingga pemilik tidak perlu berpindah-pindah halaman hanya untuk mengetahui posisi proses. Gunakan state visual yang berbeda untuk:

- Selesai
- Sedang berlangsung
- Belum dimulai
- Gagal atau dibatalkan

Contoh tampilan:

```text
✓ Pesanan diterima
│
✓ Pesanan sedang dipersiapkan
│
● Menunggu driver mengambil pesanan
│
○ Pesanan diantar ke customer
│
○ Pesanan selesai
```

Jika driver sudah mengambil pesanan, ubah timeline menjadi:

```text
✓ Pesanan diterima
✓ Pesanan dipersiapkan
✓ Pesanan diambil driver
● Driver sedang menuju customer
○ Pesanan selesai
```

### 8. Notifikasi order

Ketika order baru masuk:

- Card baru muncul tanpa mengganggu order lama
- Badge jumlah order baru bertambah
- Tampilkan snackbar atau in-app notification
- Gunakan push notification yang sudah tersedia jika project mendukungnya

Sediakan indikator pesan baru pada customer/driver jika data unread tersedia.

## Struktur komponen

Jika file utama menjadi terlalu besar, pecah menjadi komponen sesuai pola project yang sudah ada. Contoh struktur:

```text
pemilik_marketplace/
├── order/
│   ├── pemilik_marketplace_orderview.dart
│   ├── widgets/
│   │   ├── order_card.dart
│   │   ├── order_status_chip.dart
│   │   ├── order_summary_card.dart
│   │   ├── customer_info_card.dart
│   │   ├── driver_info_card.dart
│   │   ├── order_tracking_card.dart
│   │   ├── order_filter_sheet.dart
│   │   └── order_chat_button.dart
│   └── chat/
│       ├── customer_chat_view.dart
│       └── driver_chat_view.dart
└── tracking/
    └── driver_tracking_view.dart
```

Gunakan struktur, naming convention, state management, dan dependency injection yang sudah dipakai project. Jangan memaksakan struktur di atas jika tidak sesuai dengan arsitektur yang ada.

## UX, visual, dan responsivitas

Gunakan desain yang clean, modern, profesional, minimalis, dan user-friendly:

- Rounded card
- Spacing konsisten
- CTA mudah ditemukan
- Icon jelas dan memiliki fungsi nyata
- Warna status intuitif tetapi tidak berlebihan
- Hierarki informasi yang jelas
- Loading, empty, error, dan retry state pada setiap area yang membutuhkan data

Pastikan responsif pada smartphone kecil, sedang, dan besar. Hindari overflow, text terpotong, tombol keluar layar, bottom sheet yang tidak dapat di-scroll, chat tertutup keyboard, dan map yang terpotong.

Gunakan inspirasi UX dari GrabMerchant, GoFood Merchant, atau ShopeeFood Merchant tanpa menyalin desain secara persis.

## Keamanan dan privasi

Batasi akses berdasarkan relasi order:

- Pemilik hanya dapat chat dengan customer dari order di outletnya.
- Pemilik hanya dapat chat dengan driver yang ditugaskan pada order tersebut.
- Pemilik hanya dapat melihat lokasi driver yang sedang menangani order tersebut.
- Jangan menampilkan daftar customer, percakapan, atau lokasi driver secara global.
- Hormati permission, authentication, dan authorization yang sudah diterapkan project.

## Kriteria penerimaan

Hasil akhir harus mengubah alur:

```text
Daftar Pesanan → Klik → Popup sederhana
```

menjadi:

```text
Order Management Center
  ├── Pesanan masuk
  ├── Detail order
  ├── Chat customer
  ├── Chat driver
  ├── Tracking driver
  ├── Timeline progres
  ├── Search dan filter
  └── Notifikasi
```

Sebelum menyelesaikan pekerjaan:

1. Pastikan fitur order lama tetap berjalan.
2. Pastikan tidak ada error compile, lint, atau import yang rusak.
3. Uji state loading, empty, error, retry, dan data yang tidak lengkap.
4. Uji order tanpa driver dan order dengan driver.
5. Uji setiap status order dan action button-nya.
6. Uji chat customer, chat driver, unread indicator, dan auto-scroll.
7. Uji tracking dengan data lokasi yang tersedia serta fallback ketika lokasi belum tersedia.
8. Uji layar kecil agar tidak terjadi overflow.
9. Jelaskan file yang diubah, integrasi yang digunakan, bagian yang masih membutuhkan dukungan backend, dan hasil verifikasi.

Mulai dengan audit file dan struktur project, kemudian buat rencana perubahan singkat sebelum mengimplementasikan kode.
