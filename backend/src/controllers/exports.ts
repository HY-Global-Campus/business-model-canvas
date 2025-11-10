import { Router, Request, Response } from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);
const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

/**
 * Convert PowerPoint (.pptx) to ODF Presentation (.odp)
 * POST /api/exports/convert-to-odp
 */
router.post('/convert-to-odp', upload.single('file'), async (req: Request, res: Response) => {
  const tempDir = path.join('/tmp', `bmc-export-${uuidv4()}`);
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create temporary directory
    await fs.mkdir(tempDir, { recursive: true });
    
    // Save uploaded .pptx file
    const pptxPath = path.join(tempDir, 'presentation.pptx');
    await fs.writeFile(pptxPath, req.file.buffer);
    
    // Convert using LibreOffice
    console.log(`Converting ${pptxPath} to ODP...`);
    const { stdout, stderr } = await execAsync(
      `soffice --headless --convert-to odp --outdir ${tempDir} ${pptxPath}`,
      { timeout: 30000 } // 30 second timeout
    );
    
    if (stderr) {
      console.error('LibreOffice conversion stderr:', stderr);
    }
    if (stdout) {
      console.log('LibreOffice conversion stdout:', stdout);
    }
    
    // Read the converted .odp file
    const odpPath = path.join(tempDir, 'presentation.odp');
    
    // Check if file exists
    try {
      await fs.access(odpPath);
    } catch (error) {
      console.error('ODP file not found after conversion:', error);
      return res.status(500).json({ error: 'Conversion failed: output file not created' });
    }
    
    const odpBuffer = await fs.readFile(odpPath);
    
    // Send the file
    res.setHeader('Content-Type', 'application/vnd.oasis.opendocument.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename="presentation.odp"');
    res.send(odpBuffer);
    
  } catch (error) {
    console.error('Error converting to ODP:', error);
    res.status(500).json({ 
      error: 'Failed to convert file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Error cleaning up temp directory:', cleanupError);
    }
  }
});

export default router;

