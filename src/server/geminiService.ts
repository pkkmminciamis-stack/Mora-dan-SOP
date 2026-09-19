/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export interface Aktivitas {
  nomor: number | string;
  aktivitas: string;
  pelaksana: string;
  simbol: 'Terminator' | 'Process' | 'Decision' | 'Connector';
  mutuBaku: {
    persyaratan: string;
    waktu: string;
    output: string;
  };
}

export interface SopAiResult {
  dasarHukum: string[];
  kualifikasiPelaksana: string[];
  keterkaitan: string[];
  peralatanPerlengkapan: string[];
  peringatan: string[];
  pencatatanPendataan: string[];
  prosedur: Aktivitas[];
}

export interface SopGenerationResponse {
  success: boolean;
  data?: SopAiResult;
  error?: string;
  errorCode?: string;
  details?: string;
  solution?: string;
  isFallback?: boolean;
}

/**
 * Generate authentic Kemenag SOP template as fallback when AI / API Key is offline or 403
 */
export function generateSopFallbackTemplate(judulSop: string): SopAiResult {
  const judul = (judulSop || 'Standar Operasional Prosedur').toUpperCase();
  const lowerJudul = judul.toLowerCase();

  // Keyword categorization
  if (lowerJudul.includes('ppdb') || lowerJudul.includes('pendaftaran') || lowerJudul.includes('santri baru') || lowerJudul.includes('siswa baru')) {
    return {
      dasarHukum: [
        "1. Undang-Undang RI Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
        "2. Peraturan Menteri Agama (PMA) Nomor 90 Tahun 2013 tentang Penyelenggaraan Pendidikan Madrasah;",
        "3. Keputusan Direktur Jenderal Pendidikan Islam tentang Petunjuk Teknis Penerimaan Peserta Didik Baru (PPDB) Madrasah Tahun Berjalan;",
        "4. Peraturan Menteri Pendidikan dan Kebudayaan tentang Penerimaan Peserta Didik Baru."
      ],
      kualifikasiPelaksana: [
        "1. Memiliki pemahaman teknis mengenai regulasi dan alur PPDB Madrasah;",
        "2. Terampil dalam mengoperasikan aplikasi pendaftaran online dan pengelolaan spreadsheet data;",
        "3. Memiliki kemampuan komunikasi publik yang ramah, santun, dan informatif;",
        "4. Memegang teguh prinsip transparansi, objektivitas, dan akuntabilitas seleksi."
      ],
      keterkaitan: [
        "1. SOP Tata Kelola Administrasi Kesiswaan Madrasah",
        "2. SOP Pengelolaan Sistem Informasi Data EMIS Madrasah",
        "3. SOP Tata Persuratan dan Pelayanan Informasi Publik"
      ],
      peralatanPerlengkapan: [
        "1. Perangkat Komputer / Laptop dan Jaringan Internet Berkecepatan Stabil",
        "2. Formulir Pendaftaran Fisik dan Sistem Aplikasi PPDB Online",
        "3. Berkas Verifikasi Persyaratan (Akta Kelahiran, KK, Ijazah/SKL, KIP/PKH jika ada)",
        "4. Printer, Scanner, Alat Tulis Kantor (ATK), dan Cap Stempel Panitia PPDB"
      ],
      peringatan: [
        "1. Apabila verifikasi berkas tidak dilaksanakan dengan teliti, dapat menimbulkan kekeliruan data identitas siswa pada database EMIS dan ijazah;",
        "2. Panitia dilarang memungut biaya apapun di luar ketentuan petunjuk teknis resmi kementerian."
      ],
      pencatatanPendataan: [
        "1. Buku Register Pendaftaran dan Tanda Terima Penyerahan Berkas;",
        "2. Database Elektronik Peserta Didik Baru Terverifikasi;",
        "3. Arsip Hasil Rapat Pleno Kelulusan dan Berita Acara Penetapan Peserta Didik Diterima."
      ],
      prosedur: [
        {
          nomor: 1,
          aktivitas: "Menerima formulir serta berkas persyaratan pendaftaran dari calon peserta didik/orang tua",
          pelaksana: "Panitia PPDB",
          simbol: "Terminator",
          mutuBaku: {
            persyaratan: "Formulir pendaftaran terisi dan berkas persyaratan (FC KK, Akta, dll)",
            waktu: "15 Menit",
            output: "Berkas pendaftaran diterima dan bukti tanda terima"
          }
        },
        {
          nomor: 2,
          aktivitas: "Memverifikasi kelengkapan dan keabsahan dokumen persyaratan administrasi",
          pelaksana: "Tim Verifikasi PPDB",
          simbol: "Process",
          mutuBaku: {
            persyaratan: "Bukti tanda terima & berkas calon siswa",
            waktu: "20 Menit",
            output: "Lembar verifikasi lolos administrasi / catatan perbaikan"
          }
        },
        {
          nomor: 3,
          aktivitas: "Melakukan seleksi administrasi, tes potensi/baca Al-Qur'an, dan rapat pleno penetapan kelulusan?",
          pelaksana: "Kepala Madrasah & Tim Seleksi",
          simbol: "Decision",
          mutuBaku: {
            persyaratan: "Hasil verifikasi dan instrumen seleksi",
            waktu: "1 Hari Kerja",
            output: "Berita Acara dan Surat Keputusan (SK) Kelulusan PPDB"
          }
        },
        {
          nomor: 4,
          aktivitas: "Mengumumkan hasil seleksi secara resmi di papan pengumuman/website dan melayani proses daftar ulang",
          pelaksana: "Sekretariat PPDB",
          simbol: "Process",
          mutuBaku: {
            persyaratan: "SK Penetapan Kelulusan Kepala Madrasah",
            waktu: "2 Hari Kerja",
            output: "Daftar peserta didik baru yang telah daftar ulang"
          }
        },
        {
          nomor: 5,
          aktivitas: "Melakukan sinkronisasi data peserta didik baru ke dalam aplikasi EMIS Madrasah dan mengarsipkan berkas",
          pelaksana: "Operator EMIS Madrasah",
          simbol: "Terminator",
          mutuBaku: {
            persyaratan: "Berkas lengkap peserta didik yang daftar ulang",
            waktu: "1 Hari Kerja",
            output: "Data siswa resmi terdaftar di EMIS dan berkas terarsip rapi"
          }
        }
      ]
    };
  }

  if (lowerJudul.includes('bos') || lowerJudul.includes('keuangan') || lowerJudul.includes('anggaran') || lowerJudul.includes('belanja')) {
    return {
      dasarHukum: [
        "1. Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara;",
        "2. Peraturan Menteri Keuangan tentang Tata Cara Perencanaan, Penganggaran, dan Pelaksanaan Anggaran;",
        "3. Keputusan Direktur Jenderal Pendidikan Islam tentang Petunjuk Teknis Pengelolaan Bantuan Operasional Sekolah (BOS) pada Madrasah Tahun Berjalan;",
        "4. KMA tentang Pengelolaan Keuangan dan Pertanggungjawaban Anggaran di Lingkungan Kementerian Agama."
      ],
      kualifikasiPelaksana: [
        "1. Memiliki pemahaman mendalam tentang Petunjuk Teknis BOS dan standar akuntansi pemerintahan;",
        "2. Terampil dalam mengoperasikan aplikasi Rencana Kerja dan Anggaran Madrasah (e-RKAM);",
        "3. Memiliki sertifikasi atau kemampuan tata kelola pembukuan dan kearsipan perpajakan;",
        "4. Memegang teguh integritas, kejujuran, transparansi, dan akuntabilitas keuangan."
      ],
      keterkaitan: [
        "1. SOP Rencana Kerja dan Anggaran Madrasah (e-RKAM)",
        "2. SOP Pengadaan Barang dan Jasa Madrasah",
        "3. SOP Pemeriksaan Internal dan Pelaporan Pertanggungjawaban Keuangan"
      ],
      peralatanPerlengkapan: [
        "1. Dokumen e-RKAM yang telah disetujui Kepala Madrasah dan Kantor Kemenag",
        "2. Buku Kas Umum (BKU), Buku Pembantu Kas, Bank, dan Pajak",
        "3. Bukti Transaksi Sah (Kuitansi, Nota, Faktur Pajak, Surat Pesanan, Berita Acara Serah Terima)",
        "4. Komputer, Koneksi Internet, Rekening Bank Resmi Madrasah, dan Brankas Kas"
      ],
      peringatan: [
        "1. Pengeluaran dana dilarang keras mendahului persetujuan e-RKAM atau dilakukan tanpa bukti transaksi sah;",
        "2. Keterlambatan pelaporan SPJ BOS dapat berakibat penundaan pencairan dana tahap berikutnya."
      ],
      pencatatanPendataan: [
        "1. Buku Kas Umum (BKU) manual dan aplikasi digital e-RKAM;",
        "2. Berkas Laporan Pertanggungjawaban (LPJ) beserta bukti potong pajak;",
        "3. Berita Acara Rekonsiliasi Kas dan Laporan Triwulan/Semester ke Kankemenag."
      ],
      prosedur: [
        {
          nomor: 1,
          aktivitas: "Mengajukan permohonan kebutuhan belanja kegiatan berdasarkan alokasi e-RKAM yang sah",
          pelaksana: "Penanggung Jawab Kegiatan",
          simbol: "Terminator",
          mutuBaku: {
            persyaratan: "Nota usulan kegiatan dan rincian anggaran belanja",
            waktu: "1 Hari Kerja",
            output: "Draf usulan pengeluaran dana kegiatan"
          }
        },
        {
          nomor: 2,
          aktivitas: "Memverifikasi ketersediaan pagu pada e-RKAM dan kelayakan bukti pendukung transaksi",
          pelaksana: "Bendahara Madrasah",
          simbol: "Process",
          mutuBaku: {
            persyaratan: "Draf usulan belanja dan dokumen e-RKAM",
            waktu: "2 Jam",
            output: "Lembar verifikasi ketersediaan pagu dana"
          }
        },
        {
          nomor: 3,
          aktivitas: "Menelaah dan memutuskan persetujuan pengeluaran dana kegiatan?",
          pelaksana: "Kepala Madrasah",
          simbol: "Decision",
          mutuBaku: {
            persyaratan: "Lembar verifikasi dan berkas permohonan",
            waktu: "1 Jam",
            output: "Disposisi persetujuan pencairan dana"
          }
        },
        {
          nomor: 4,
          aktivitas: "Mencairkan dana, melakukan pembayaran, memungut/menyetor pajak, dan mencatat transaksi ke BKU e-RKAM",
          pelaksana: "Bendahara Madrasah",
          simbol: "Process",
          mutuBaku: {
            persyaratan: "Disposisi persetujuan & kuitansi sah",
            waktu: "1 Hari Kerja",
            output: "Bukti pembayaran, SSP pajak, dan pencatatan BKU"
          }
        },
        {
          nomor: 5,
          aktivitas: "Menyusun Laporan Pertanggungjawaban (LPJ) lengkap dan menyimpan arsip SPJ pada lemari arsip keuangan",
          pelaksana: "Bendahara Madrasah",
          simbol: "Terminator",
          mutuBaku: {
            persyaratan: "Kuitansi lengkap, faktur, nota, dan bukti setor pajak",
            waktu: "2 Hari Kerja",
            output: "Buku LPJ BOS tersahkan dan arsip keuangan tersimpan aman"
          }
        }
      ]
    };
  }

  // Default Standard Comprehensive SOP Template for Kemenag / Madrasah
  return {
    dasarHukum: [
      "1. Undang-Undang Republik Indonesia Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
      "2. Peraturan Pemerintah Nomor 17 Tahun 2010 tentang Pengelolaan dan Penyelenggaraan Pendidikan;",
      "3. Peraturan Menteri Agama Republik Indonesia Nomor 90 Tahun 2013 tentang Penyelenggaraan Pendidikan Madrasah;",
      "4. Keputusan Menteri Agama Republik Indonesia Nomor 184 Tahun 2019 tentang Pedoman Implementasi Kurikulum pada Madrasah;",
      "5. Keputusan Direktur Jenderal Pendidikan Islam tentang Pedoman Tata Kelola Pelayanan Administrasi Madrasah."
    ],
    kualifikasiPelaksana: [
      "1. Memiliki kompetensi dan pemahaman teknis tentang tugas dan fungsi administrasi pelayanan madrasah;",
      "2. Mampu mengoperasikan perangkat komputer perkantoran dan sistem informasi Kementerian Agama;",
      "3. Memiliki dedikasi, ketelitian, kedisiplinan, dan tanggung jawab terhadap kerahasiaan dokumen resmi;",
      "4. Memiliki kemampuan komunikasi kedinasan yang baik serta mengedepankan etika pelayanan publik prima."
    ],
    keterkaitan: [
      "1. SOP Tata Persuratan dan Kearsipan Kedinasan Madrasah",
      "2. SOP Pelayanan Administrasi dan Informasi Publik Kemenag",
      "3. SOP Pengawasan dan Penjaminan Mutu Internal Madrasah"
    ],
    peralatanPerlengkapan: [
      "1. Perangkat Komputer / Laptop dengan printer dan scanner terhubung",
      "2. Jaringan Internet stabil dan media penyimpanan data (Cloud / Harddisk Eksternal)",
      "3. Buku Kendali / Register Administrasi, Lembar Disposisi, dan Formulir Layanan Resmi",
      "4. Alat Tulis Kantor (ATK) lengkap dan Cap Stempel Dinas Madrasah"
    ],
    peringatan: [
      "1. Apabila tahapan prosedur ini tidak dipatuhi, proses pelayanan dapat mengalami keterlambatan serta berisiko pada ketidakabsahan dokumen formal;",
      "2. Setiap pelaksana wajib menyelesaikan tahapan sesuai standar mutu baku waktu yang telah ditentukan."
    ],
    pencatatanPendataan: [
      "1. Buku Agenda / Register Penomoran Dokumen Kedinasan;",
      "2. Lembar Disposisi dan Catatan Telaah Pimpinan Madrasah;",
      "3. Berkas arsip fisik pada ordner dan softcopy dokumen pada direktori digital madrasah."
    ],
    prosedur: [
      {
        nomor: 1,
        aktivitas: `Menerima dokumen permohonan atau bahan pelaksanaan terkait "${judulSop}" serta memeriksa kelengkapan berkas`,
        pelaksana: "Staf Tata Usaha",
        simbol: "Terminator",
        mutuBaku: {
          persyaratan: "Berkas permohonan dan dokumen pendukung lengkap",
          waktu: "15 Menit",
          output: "Lembar tanda terima dan berkas terverifikasi awal"
        }
      },
      {
        nomor: 2,
        aktivitas: "Memeriksa keabsahan data, menelaah kesesuaian dengan ketentuan regulasi, dan menyiapkan draf rekomendasi",
        pelaksana: "Kepala Urusan Tata Usaha",
        simbol: "Process",
        mutuBaku: {
          persyaratan: "Berkas terverifikasi dan lembar kendali telaah",
          waktu: "30 Menit",
          output: "Lembar telaah staf dan draf konsep keputusan"
        }
      },
      {
        nomor: 3,
        aktivitas: "Menelaah draf dokumen, memberikan arahan perbaikan, atau menetapkan persetujuan?",
        pelaksana: "Kepala Madrasah",
        simbol: "Decision",
        mutuBaku: {
          persyaratan: "Draf dokumen keputusan dan lembar disposisi",
          waktu: "20 Menit",
          output: "Disposisi persetujuan final / draf perbaikan"
        }
      },
      {
        nomor: 4,
        aktivitas: "Menindaklanjuti persetujuan dengan melakukan finalisasi, penomoran resmi, dan pembubuhan stempel dinas",
        pelaksana: "Staf Tata Usaha",
        simbol: "Process",
        mutuBaku: {
          persyaratan: "Disposisi persetujuan Kepala Madrasah",
          waktu: "30 Menit",
          output: "Dokumen SOP resmi yang telah disahkan"
        }
      },
      {
        nomor: 5,
        aktivitas: "Mendistribusikan dokumen kepada unit terkait, menyampaikan kepada pemohon, dan mengarsipkan dokumen",
        pelaksana: "Staf Tata Usaha",
        simbol: "Terminator",
        mutuBaku: {
          persyaratan: "Dokumen resmi telah disahkan",
          waktu: "15 Menit",
          output: "Tanda terima penyerahan dan dokumen tersimpan rapi dalam arsip"
        }
      }
    ]
  };
}

/**
 * Server-side generation using Gemini API with comprehensive error diagnostics
 */
export async function generateSopWithGemini(judulSop: string): Promise<SopGenerationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return {
      success: false,
      errorCode: 'API_KEY_MISSING',
      error: 'GEMINI_API_KEY Belum Dikonfigurasi',
      details: 'Environment variable GEMINI_API_KEY tidak ditemukan pada server atau Vercel hosting.',
      solution: '1. Buka dashboard hosting Anda (misalnya Vercel > Settings > Environment Variables).\n2. Tambahkan variable GEMINI_API_KEY dengan API Key Anda.\n3. Lakukan Redeploy agar variable baru aktif.'
    };
  }

  const prompt = `Anda adalah asisten konsultan ahli penyusunan Dokumen Standar Operasional Prosedur (SOP) resmi Kementerian Agama Republik Indonesia (Kemenag) dan Madrasah (MI/MTs/MA).
Buat dokumen SOP resmi, terstruktur, mendalam, dan aplikatif untuk judul SOP:
"${judulSop}"

Hasilkan output HANYA berupa format JSON murni tanpa pembungkus markdown (\`\`\`json):
{
  "dasarHukum": [
    "1. Undang-Undang Nomor ...",
    "2. Peraturan Menteri Agama (PMA) Nomor ...",
    "3. Keputusan Menteri Agama (KMA) Nomor ...",
    "4. Juknis Ditjen Pendis Nomor ..."
  ],
  "kualifikasiPelaksana": [
    "1. ...",
    "2. ...",
    "3. ..."
  ],
  "keterkaitan": [
    "1. SOP ...",
    "2. SOP ..."
  ],
  "peralatanPerlengkapan": [
    "1. ...",
    "2. ...",
    "3. ..."
  ],
  "peringatan": [
    "1. ...",
    "2. ..."
  ],
  "pencatatanPendataan": [
    "1. ...",
    "2. ..."
  ],
  "prosedur": [
    {
      "nomor": 1,
      "aktivitas": "Menerima dan memverifikasi berkas...",
      "pelaksana": "Staf Tata Usaha / Operator",
      "simbol": "Terminator",
      "mutuBaku": {
        "persyaratan": "...",
        "waktu": "15 Menit",
        "output": "..."
      }
    },
    {
      "nomor": 2,
      "aktivitas": "Memeriksa keabsahan dan menelaah kesesuaian...",
      "pelaksana": "Kepala Urusan Tata Usaha / Waka",
      "simbol": "Process",
      "mutuBaku": {
        "persyaratan": "...",
        "waktu": "30 Menit",
        "output": "..."
      }
    },
    {
      "nomor": 3,
      "aktivitas": "Menelaah usulan dan memutuskan persetujuan?",
      "pelaksana": "Kepala Madrasah",
      "simbol": "Decision",
      "mutuBaku": {
        "persyaratan": "...",
        "waktu": "15 Menit",
        "output": "Disposisi persetujuan"
      }
    },
    {
      "nomor": 4,
      "aktivitas": "Memproses dokumen akhir dan penomoran resmi...",
      "pelaksana": "Staf Tata Usaha",
      "simbol": "Process",
      "mutuBaku": {
        "persyaratan": "Disposisi persetujuan",
        "waktu": "30 Menit",
        "output": "Dokumen resmi selesai"
      }
    },
    {
      "nomor": 5,
      "aktivitas": "Menyerahkan dokumen kepada pemohon dan pengarsipan...",
      "pelaksana": "Staf Tata Usaha",
      "simbol": "Terminator",
      "mutuBaku": {
        "persyaratan": "Dokumen resmi",
        "waktu": "10 Menit",
        "output": "Dokumen terarsip rapi"
      }
    }
  ]
}

Aturan simbol:
- 'Terminator' untuk aktivitas awal (Mulai) dan akhir (Selesai/Penyerahan).
- 'Decision' untuk aktivitas yang memerlukan keputusan/pemeriksaan persetujuan (Ya/Tidak).
- 'Process' untuk aktivitas pemrosesan/tindakan rutin.
- 'Connector' untuk alur penghubung.
`;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
    } catch (primaryErr: any) {
      const msg = String(primaryErr?.message || '');
      // Fallback model if 3.8 is not enabled in this specific key
      if (msg.includes('not found') || msg.includes('unsupported') || msg.includes('404')) {
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
        });
      } else {
        throw primaryErr;
      }
    }

    let text = response.text || '';
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(text) as SopAiResult;
    return {
      success: true,
      data: parsedData
    };
  } catch (err: any) {
    const rawMsg = String(err?.message || err || '');
    console.error("[geminiService] Error generating content:", rawMsg);

    const is403 = rawMsg.includes('403') || 
                  rawMsg.includes('PERMISSION_DENIED') || 
                  rawMsg.includes('denied') || 
                  rawMsg.includes('API_KEY_SERVICE_BLOCKED') ||
                  rawMsg.includes('Generative Language API has not been used');

    if (is403) {
      return {
        success: false,
        errorCode: '403_ACCESS_DENIED',
        error: 'Akses Ditolak (403 Forbidden)',
        details: rawMsg,
        solution: '1. Aktifkan "Generative Language API" pada Google Cloud Console proyek API Key Anda.\n2. Jika API Key memiliki Application/API Restrictions, pastikan tidak memblokir Generative Language API.\n3. Atau buat API Key baru langsung di Google AI Studio (https://aistudio.google.com/app/apikey) lalu perbarui GEMINI_API_KEY di Vercel/Hosting dan lakukan redeploy.'
      };
    }

    if (rawMsg.includes('API key not valid') || rawMsg.includes('API_KEY_INVALID')) {
      return {
        success: false,
        errorCode: 'API_KEY_INVALID',
        error: 'API Key Gemini Tidak Valid',
        details: rawMsg,
        solution: 'Periksa kembali nilai GEMINI_API_KEY di pengaturan Environment Variables Vercel/Hosting.'
      };
    }

    if (rawMsg.includes('quota') || rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
      return {
        success: false,
        errorCode: 'QUOTA_EXCEEDED',
        error: 'Kuota Permintaan Gemini Terlampaui (429)',
        details: rawMsg,
        solution: 'Silakan tunggu beberapa menit atau gunakan Template Standar Otomatis.'
      };
    }

    return {
      success: false,
      errorCode: 'GENERAL_ERROR',
      error: 'Gagal Menghasilkan SOP dengan AI',
      details: rawMsg,
      solution: 'Periksa koneksi internet atau gunakan Template Standar Otomatis.'
    };
  }
}
