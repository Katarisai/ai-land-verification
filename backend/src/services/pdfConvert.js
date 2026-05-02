const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

// Try to convert PDF to PNG pages using pdftoppm (part of poppler)
// Returns array of generated image file paths or empty array if not available
async function pdfToImages(pdfPath, outDir) {
  return new Promise((resolve) => {
    try {
      if (!fs.existsSync(pdfPath)) return resolve([]);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const baseName = `page-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      const outputPattern = path.join(outDir, baseName);

      // pdftoppm -png input.pdf output_prefix
      execFile('pdftoppm', ['-png', pdfPath, outputPattern], { timeout: 60_000 }, (err) => {
        if (err) {
          console.warn('pdftoppm conversion failed or not present:', err.message || err);
          return resolve([]);
        }
        // Collect created files
        const files = fs.readdirSync(outDir)
          .filter(f => f.startsWith(baseName) && f.endsWith('.png'))
          .map(f => path.join(outDir, f));
        resolve(files);
      });
    } catch (e) {
      console.warn('pdfToImages error', e.message || e);
      resolve([]);
    }
  });
}

module.exports = { pdfToImages };
