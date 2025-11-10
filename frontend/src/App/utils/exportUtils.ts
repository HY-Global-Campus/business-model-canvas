import html2canvas from 'html2canvas';
import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import { BMCProject } from '../../types/bmc';
import { bmcBlocksMeta, getBlockOrder } from '../../content/bmcBlocks';
import axiosInstance from '../api/axiosInstance';

/**
 * Captures the canvas element as a base64 image
 */
async function captureCanvasImage(
  canvasRef: HTMLDivElement,
  toggleFullscreen?: () => void,
  isFullscreen?: boolean
): Promise<string> {
  const wasFullscreen = isFullscreen || false;
  
  // Enter fullscreen mode temporarily if not already
  if (!wasFullscreen && toggleFullscreen) {
    toggleFullscreen();
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  
  // Hide completion badges, click hints, and footers
  const completionBadges = canvasRef.querySelectorAll('.completion-badge');
  const clickHints = canvasRef.querySelectorAll('.click-hint');
  const blockFooters = canvasRef.querySelectorAll('.block-footer');
  
  const hiddenElements: HTMLElement[] = [];
  [...completionBadges, ...clickHints, ...blockFooters].forEach(el => {
    hiddenElements.push(el as HTMLElement);
    (el as HTMLElement).style.display = 'none';
  });
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Capture the canvas
  const canvas = await html2canvas(canvasRef, {
    scale: 2,
    backgroundColor: '#f8f9fa',
    logging: false,
    useCORS: true,
  });
  
  // Restore hidden elements
  hiddenElements.forEach(el => {
    el.style.display = '';
  });
  
  // Restore previous state
  if (!wasFullscreen && toggleFullscreen) {
    await new Promise(resolve => setTimeout(resolve, 100));
    toggleFullscreen();
  }
  
  return canvas.toDataURL('image/png');
}

/**
 * Generates a filename for exports
 */
function getExportFilename(project: BMCProject, format: string, extension: string): string {
  const projectName = (project.displayName || 'Business-Model-Canvas').replace(/[^a-zA-Z0-9]/g, '-');
  const date = new Date().toISOString().split('T')[0];
  return `${projectName}_BMC_${format}_${date}.${extension}`;
}

/**
 * Export BMC to PowerPoint (.pptx)
 */
export async function exportToPowerPoint(
  project: BMCProject,
  canvasRef: HTMLDivElement,
  toggleFullscreen?: () => void,
  isFullscreen?: boolean
): Promise<void> {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = 'Business Model Canvas Tool';
  pptx.title = project.displayName || 'Business Model Canvas';
  pptx.subject = 'Business Model Canvas Export';
  
  // Slide 1: Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '2C3E50' };
  
  titleSlide.addText('Business Model Canvas', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  
  titleSlide.addText(project.displayName || 'Untitled Project', {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: 'ECF0F1',
    align: 'center'
  });
  
  // Business context
  const contextParts: string[] = [];
  if (project.businessContext.industry) contextParts.push(project.businessContext.industry);
  if (project.businessContext.stage) contextParts.push(project.businessContext.stage);
  if (project.businessContext.description) contextParts.push(project.businessContext.description);
  
  if (contextParts.length > 0) {
    titleSlide.addText(contextParts.join(' • '), {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: 'BDC3C7',
      align: 'center'
    });
  }
  
  titleSlide.addText(`Exported: ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 6.5,
    w: 9,
    h: 0.4,
    fontSize: 14,
    color: '95A5A6',
    align: 'center'
  });
  
  // Slide 2: Canvas Overview
  const canvasImageData = await captureCanvasImage(canvasRef, toggleFullscreen, isFullscreen);
  const overviewSlide = pptx.addSlide();
  overviewSlide.background = { color: 'F8F9FA' };
  
  overviewSlide.addText('Business Model Canvas Overview', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '2C3E50',
    align: 'center'
  });
  
  overviewSlide.addImage({
    data: canvasImageData,
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 5.5
  });
  
  // Slides 3-11: Individual Block Details
  const blockOrder = getBlockOrder();
  
  for (const blockId of blockOrder) {
    const meta = bmcBlocksMeta.find(b => b.id === blockId);
    if (!meta) continue;
    
    const content = project.canvasData[blockId] || 'Not yet completed';
    
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    
    // Block title
    slide.addText(meta.title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: '2C3E50'
    });
    
    // Description
    slide.addText(meta.description, {
      x: 0.5,
      y: 1.0,
      w: 9,
      h: 0.8,
      fontSize: 14,
      color: '7F8C8D',
      italic: true
    });
    
    // User content
    slide.addText('Your Content:', {
      x: 0.5,
      y: 2.0,
      w: 9,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: '34495E'
    });
    
    slide.addText(content, {
      x: 0.5,
      y: 2.4,
      w: 9,
      h: 4.0,
      fontSize: 14,
      color: '2C3E50',
      valign: 'top'
    });
  }
  
  // Save the presentation
  const filename = getExportFilename(project, 'PowerPoint', 'pptx');
  await pptx.writeFile({ fileName: filename });
}

/**
 * Export BMC to PDF
 */
export async function exportToPDF(
  project: BMCProject,
  canvasRef: HTMLDivElement,
  toggleFullscreen?: () => void,
  isFullscreen?: boolean
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  
  // Page 1: Title Page
  pdf.setFillColor(44, 62, 80);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Business Model Canvas', pageWidth / 2, 60, { align: 'center' });
  
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'normal');
  pdf.text(project.displayName || 'Untitled Project', pageWidth / 2, 85, { align: 'center' });
  
  // Business context
  const contextParts: string[] = [];
  if (project.businessContext.industry) contextParts.push(project.businessContext.industry);
  if (project.businessContext.stage) contextParts.push(project.businessContext.stage);
  if (project.businessContext.description) contextParts.push(project.businessContext.description);
  
  if (contextParts.length > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(189, 195, 199);
    pdf.text(contextParts.join(' • '), pageWidth / 2, 105, { align: 'center' });
  }
  
  pdf.setFontSize(12);
  pdf.setTextColor(149, 165, 166);
  pdf.text(`Exported: ${new Date().toLocaleDateString()}`, pageWidth / 2, 160, { align: 'center' });
  
  // Page 2: Canvas Overview
  pdf.addPage();
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(44, 62, 80);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Business Model Canvas Overview', pageWidth / 2, 20, { align: 'center' });
  
  const canvasImageData = await captureCanvasImage(canvasRef, toggleFullscreen, isFullscreen);
  pdf.addImage(canvasImageData, 'PNG', margin, 30, contentWidth, 140);
  
  // Pages 3+: Individual Block Details
  const blockOrder = getBlockOrder();
  
  for (const blockId of blockOrder) {
    const meta = bmcBlocksMeta.find(b => b.id === blockId);
    if (!meta) continue;
    
    const content = project.canvasData[blockId] || 'Not yet completed';
    
    pdf.addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    let yPosition = margin;
    
    // Block title
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text(meta.title, margin, yPosition);
    yPosition += 12;
    
    // Description
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(127, 140, 141);
    const descLines = pdf.splitTextToSize(meta.description, contentWidth);
    pdf.text(descLines, margin, yPosition);
    yPosition += descLines.length * 5 + 8;
    
    // User content
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(52, 73, 94);
    pdf.text('Your Content:', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(44, 62, 80);
    const contentLines = pdf.splitTextToSize(content, contentWidth);
    pdf.text(contentLines, margin, yPosition);
  }
  
  // Save the PDF
  const filename = getExportFilename(project, 'PDF', 'pdf');
  pdf.save(filename);
}

/**
 * Export BMC to ODF Presentation (.odp)
 * Converts PowerPoint to ODF using backend service
 */
export async function exportToODP(
  project: BMCProject,
  canvasRef: HTMLDivElement,
  toggleFullscreen?: () => void,
  isFullscreen?: boolean
): Promise<void> {
  // First, generate PowerPoint in memory
  const pptx = new pptxgen();
  
  pptx.author = 'Business Model Canvas Tool';
  pptx.title = project.displayName || 'Business Model Canvas';
  pptx.subject = 'Business Model Canvas Export';
  
  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '2C3E50' };
  
  titleSlide.addText('Business Model Canvas', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  
  titleSlide.addText(project.displayName || 'Untitled Project', {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: 'ECF0F1',
    align: 'center'
  });
  
  const contextParts: string[] = [];
  if (project.businessContext.industry) contextParts.push(project.businessContext.industry);
  if (project.businessContext.stage) contextParts.push(project.businessContext.stage);
  if (project.businessContext.description) contextParts.push(project.businessContext.description);
  
  if (contextParts.length > 0) {
    titleSlide.addText(contextParts.join(' • '), {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: 'BDC3C7',
      align: 'center'
    });
  }
  
  titleSlide.addText(`Exported: ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 6.5,
    w: 9,
    h: 0.4,
    fontSize: 14,
    color: '95A5A6',
    align: 'center'
  });
  
  // Canvas Overview
  const canvasImageData = await captureCanvasImage(canvasRef, toggleFullscreen, isFullscreen);
  const overviewSlide = pptx.addSlide();
  overviewSlide.background = { color: 'F8F9FA' };
  
  overviewSlide.addText('Business Model Canvas Overview', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 28,
    bold: true,
    color: '2C3E50',
    align: 'center'
  });
  
  overviewSlide.addImage({
    data: canvasImageData,
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 5.5
  });
  
  // Individual blocks
  const blockOrder = getBlockOrder();
  
  for (const blockId of blockOrder) {
    const meta = bmcBlocksMeta.find(b => b.id === blockId);
    if (!meta) continue;
    
    const content = project.canvasData[blockId] || 'Not yet completed';
    
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    
    slide.addText(meta.title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: '2C3E50'
    });
    
    slide.addText(meta.description, {
      x: 0.5,
      y: 1.0,
      w: 9,
      h: 0.8,
      fontSize: 14,
      color: '7F8C8D',
      italic: true
    });
    
    slide.addText('Your Content:', {
      x: 0.5,
      y: 2.0,
      w: 9,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: '34495E'
    });
    
    slide.addText(content, {
      x: 0.5,
      y: 2.4,
      w: 9,
      h: 4.0,
      fontSize: 14,
      color: '2C3E50',
      valign: 'top'
    });
  }
  
  // Generate .pptx as blob
  const pptxBlob = await pptx.write({ outputType: 'blob' });
  
  // Send to backend for conversion
  const formData = new FormData();
  formData.append('file', pptxBlob as Blob, 'presentation.pptx');
  
  const response = await axiosInstance.post('/exports/convert-to-odp', formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Download the ODP file
  const odpBlob = new Blob([response.data], { type: 'application/vnd.oasis.opendocument.presentation' });
  const url = URL.createObjectURL(odpBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = getExportFilename(project, 'ODF', 'odp');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

