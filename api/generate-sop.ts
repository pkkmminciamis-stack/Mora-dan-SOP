import type { IncomingMessage, ServerResponse } from 'http';
import { generateSopWithGemini, generateSopFallbackTemplate } from '../src/server/geminiService.js';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan. Gunakan POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { judulSop, useFallbackOnly } = body || {};

    if (!judulSop || typeof judulSop !== 'string' || judulSop.trim() === '') {
      return res.status(400).json({ error: 'Judul SOP wajib diisi.' });
    }

    // Direct fallback template requested
    if (useFallbackOnly) {
      const template = generateSopFallbackTemplate(judulSop);
      return res.status(200).json({
        success: true,
        data: template,
        isFallback: true
      });
    }

    // Attempt generation with Gemini API
    const result = await generateSopWithGemini(judulSop);

    if (result.success && result.data) {
      return res.status(200).json(result);
    } else {
      // Return detailed failure with the fallback template ready
      const fallbackTemplate = generateSopFallbackTemplate(judulSop);
      return res.status(200).json({
        ...result,
        fallbackAvailable: true,
        fallbackData: fallbackTemplate
      });
    }
  } catch (err: any) {
    console.error('[API generate-sop] Uncaught error:', err);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan internal pada server.',
      details: err?.message || String(err)
    });
  }
}
