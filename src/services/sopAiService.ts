/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateSopFallbackTemplate, SopAiResult } from '../server/geminiService';

export interface GenerateSopResult {
  success: boolean;
  data?: SopAiResult;
  error?: string;
  errorCode?: string;
  details?: string;
  solution?: string;
  isFallback?: boolean;
}

/**
 * Calls server-side endpoint /api/generate-sop to prevent exposing API keys in browser.
 * Falls back gracefully to authentic Kemenag SOP template if connection or API fails.
 */
export async function requestSopGeneration(judulSop: string, useFallbackOnly = false): Promise<GenerateSopResult> {
  if (!judulSop || judulSop.trim() === '') {
    return {
      success: false,
      error: 'Judul SOP wajib diisi terlebih dahulu.'
    };
  }

  if (useFallbackOnly) {
    const fallbackData = generateSopFallbackTemplate(judulSop);
    return {
      success: true,
      data: fallbackData,
      isFallback: true
    };
  }

  try {
    const response = await fetch('/api/generate-sop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ judulSop, useFallbackOnly: false }),
    });

    // If server returned HTML (e.g. Vercel SPA rewrite fallback before serverless function), handle gracefully
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const fallbackData = generateSopFallbackTemplate(judulSop);
      return {
        success: false,
        errorCode: 'ENDPOINT_UNAVAILABLE',
        error: 'Endpoint Server /api/generate-sop mengembalikan format non-JSON.',
        details: 'Kemungkinan serverless function di hosting belum aktif atau mengalami rewrite.',
        solution: 'Pastikan file api/generate-sop.ts terdeploy di hosting Anda atau gunakan Template Standar Otomatis.',
        data: fallbackData
      };
    }

    const resJson = await response.json();
    if (resJson.success && resJson.data) {
      return {
        success: true,
        data: resJson.data,
        isFallback: Boolean(resJson.isFallback)
      };
    } else {
      // AI generation failed on the server
      return {
        success: false,
        error: resJson.error || 'Gagal menghasilkan SOP dengan AI.',
        errorCode: resJson.errorCode || 'UNKNOWN_ERROR',
        details: resJson.details || '',
        solution: resJson.solution || '',
        data: resJson.fallbackData || generateSopFallbackTemplate(judulSop)
      };
    }
  } catch (netErr: any) {
    console.warn('[sopAiService] Network error calling /api/generate-sop:', netErr);
    const fallbackData = generateSopFallbackTemplate(judulSop);
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      error: 'Tidak dapat terhubung ke server AI: ' + (netErr?.message || 'Koneksi terputus'),
      details: netErr?.message || String(netErr),
      solution: 'Gunakan Template Standar Otomatis Kemenag untuk melanjutkan pengisian dokumen.',
      data: fallbackData
    };
  }
}
