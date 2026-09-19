/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  X, 
  RotateCcw, 
  ShieldAlert,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorTitle?: string;
  errorMessage?: string;
  errorDetails?: string;
  errorSolution?: string;
  errorCode?: string;
  onUseFallbackTemplate: () => void;
  onRetry: () => void;
}

export const AiErrorModal: React.FC<AiErrorModalProps> = ({
  isOpen,
  onClose,
  errorTitle = 'Gagal Akses Google AI (Error 403)',
  errorMessage,
  errorDetails,
  errorSolution,
  errorCode = '403',
  onUseFallbackTemplate,
  onRetry
}) => {
  if (!isOpen) return null;

  const is403 = errorCode.includes('403') || 
                (errorMessage && errorMessage.includes('403')) || 
                (errorDetails && errorDetails.includes('403')) ||
                (errorDetails && errorDetails.includes('PERMISSION_DENIED'));

  return (
    <AnimatePresence>
      <div 
        id="ai-error-modal-backdrop" 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="ai-error-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-snug tracking-wide">
                  {errorTitle}
                </h3>
                <p className="text-xs text-orange-100 font-medium">
                  {is403 ? 'Akses Ditolak oleh Google Cloud / Gemini AI SDK' : 'Kendala Saat Memproses Pembuatan SOP'}
                </p>
              </div>
            </div>
            <button
              id="btn-close-ai-error"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-slate-700 text-sm max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Quick explanation alert box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  {errorMessage || "Google menolak permintaan API karena API Key belum diaktifkan atau memiliki pembatasan akses."}
                </p>
                {errorDetails && (
                  <p className="text-xs text-amber-800/80 mt-1 font-mono break-all line-clamp-2">
                    Kode Log: {errorDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Step-by-step fix */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs tracking-wider uppercase">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Cara Mengatasi Masalah Ini (3 Langkah Mudah):
              </div>

              <div className="grid gap-2.5">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">1</span>
                    Aktifkan "Generative Language API" di Google Cloud
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Buka Google Cloud Console untuk project Anda, cari <strong>Generative Language API</strong> dan klik tombol <strong>Enable / Aktifkan</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">2</span>
                    Gunakan API Key Baru dari Google AI Studio (Bebas Batasan)
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Buat API key gratis langsung dari portal Google AI Studio di{' '}
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline font-semibold inline-flex items-center gap-1 hover:text-emerald-800"
                    >
                      aistudio.google.com/app/apikey
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">3</span>
                    Perbarui Variable di Vercel / Server Hosting
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Di dashboard Vercel, buka <strong>Settings &gt; Environment Variables</strong>, update nilai <strong>GEMINI_API_KEY</strong>, lalu klik <strong>Redeploy</strong> agar perubahan diterapkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart fallback solution banner */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Solusi Cepat (Langsung Dapat Digunakan Sekarang)
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Anda tidak perlu menunggu pengaturan API Key selesai. Anda bisa langsung menggunakan <strong>Template Standar Kemenag Resmi</strong> yang telah disesuaikan secara otomatis dengan judul SOP Anda.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="btn-retry-ai-generate"
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Coba Generate Lagi
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="btn-apply-fallback-template"
                type="button"
                onClick={onUseFallbackTemplate}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow"
              >
                <FileCheck className="w-4 h-4 text-white" />
                Gunakan Template Standar Kemenag
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
