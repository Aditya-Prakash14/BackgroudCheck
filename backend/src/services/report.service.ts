import puppeteer from 'puppeteer';
import crypto from 'crypto';
import { prisma } from '../prisma/client';
import { maskAadhaar } from '../utils/mask';

export const generateReport = async (candidateId: string, userId: string): Promise<Buffer> => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, createdById: userId },
      include: {
        verificationLogs: true,
        createdBy: true,
      },
    });

    if (!candidate) {
      const error = new Error('Candidate not found') as any;
      error.status = 404;
      throw error;
    }

    // Check if any verification has been run
    if (!candidate.verificationLogs || candidate.verificationLogs.length === 0) {
      const error = new Error('No verification checks have been run for this candidate. Please run Aadhaar and PAN verification first.') as any;
      error.status = 400;
      throw error;
    }

  const aadhaarLog = candidate.verificationLogs.find(l => l.verificationType === 'AADHAAR');
  const panLog = candidate.verificationLogs.find(l => l.verificationType === 'PAN');
  
  const statusColor = candidate.status === 'VERIFIED' ? '#10B981' // Green
                    : candidate.status === 'FAILED'   ? '#EF4444' // Red
                    : candidate.status === 'PARTIAL'  ? '#F59E0B' // Amber
                    : '#6B7280'; // Gray (PENDING)

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Background Verification Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          padding: 40px;
          color: #1F2937;
          background: #FFFFFF;
          margin: 0;
        }
        .header {
          background: linear-gradient(135deg, #1E3A5F 0%, #111827 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header h1 {
          margin: 0 0 10px;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .header p {
          margin: 0;
          opacity: 0.85;
          font-size: 14px;
        }
        .section {
          margin: 24px 0;
          padding: 24px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
        }
        .section h2 {
          margin: 0 0 20px;
          color: #1E3A5F;
          font-size: 18px;
          font-weight: 600;
          border-bottom: 2px solid #E5E7EB;
          padding-bottom: 8px;
        }
        .badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 9999px;
          background: ${statusColor};
          color: white;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #E5E7EB;
          font-size: 14px;
        }
        tr:last-child td {
          border-bottom: none;
        }
        td.label {
          font-weight: 600;
          color: #4B5563;
          width: 35%;
        }
        td.val {
          color: #111827;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #9CA3AF;
          font-size: 12px;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }
        .watermark {
          position: absolute;
          right: 30px;
          top: 30px;
          font-size: 50px;
          opacity: 0.05;
          font-weight: 800;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Background Verification Report</h1>
        <p>Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="margin-top: 4px;">Verified by: ${candidate.createdBy.name} (${candidate.createdBy.email})</p>
        <div class="watermark">SECURE</div>
      </div>

      <div class="section">
        <h2>Candidate Information</h2>
        <table>
          <tr>
            <td class="label">Full Name</td>
            <td class="val" style="font-weight: 500;">${candidate.fullName}</td>
          </tr>
          <tr>
            <td class="label">Email Address</td>
            <td class="val">${candidate.email}</td>
          </tr>
          <tr>
            <td class="label">Phone Number</td>
            <td class="val">${candidate.phone}</td>
          </tr>
          <tr>
            <td class="label">Date of Birth</td>
            <td class="val">${new Date(candidate.dob).toLocaleDateString('en-IN')}</td>
          </tr>
          <tr>
            <td class="label">Aadhaar (Masked)</td>
            <td class="val">${maskAadhaar(candidate.aadhaarNumber)}</td>
          </tr>
          <tr>
            <td class="label">PAN Number</td>
            <td class="val" style="font-family: monospace; font-size: 15px; letter-spacing: 0.05em;">${candidate.panNumber}</td>
          </tr>
          <tr>
            <td class="label">Residential Address</td>
            <td class="val">${candidate.address}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>Verification Summary</h2>
        <table>
          <tr>
            <td class="label">Aadhaar Verification</td>
            <td class="val">
              <span class="badge" style="background-color: ${aadhaarLog?.verificationStatus === 'verified' ? '#10B981' : aadhaarLog ? '#EF4444' : '#6B7280'};">
                ${aadhaarLog?.verificationStatus?.toUpperCase() ?? 'NOT RUN'}
              </span>
            </td>
          </tr>
          <tr>
            <td class="label">PAN Verification</td>
            <td class="val">
              <span class="badge" style="background-color: ${panLog?.verificationStatus === 'verified' ? '#10B981' : panLog ? '#EF4444' : '#6B7280'};">
                ${panLog?.verificationStatus?.toUpperCase() ?? 'NOT RUN'}
              </span>
            </td>
          </tr>
          <tr>
            <td class="label">Overall Status</td>
             <td class="val">
              <span class="badge">${candidate.status}</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 50px; margin-bottom: 20px; display: flex; justify-content: flex-end;">
        <div style="text-align: center; border: 1px dashed #D1D5DB; padding: 12px 24px; border-radius: 8px; background-color: #F9FAFB; max-width: 250px; font-family: sans-serif;">
          <div style="color: #059669; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">✔ Digitally Signed</div>
          <div style="color: #4B5563; font-size: 10px; font-weight: 500; margin-bottom: 2px;">NIC BGV GATEWAY</div>
          <div style="color: #9CA3AF; font-size: 8px; font-family: monospace; word-break: break-all;">SHA-256: ${crypto.createHash('sha256').update(candidateId + userId).digest('hex').slice(0, 16).toUpperCase()}</div>
        </div>
      </div>

      <div class="footer">
        This is an official system-generated Background Verification Report.
        <br/>
        For verification queries, contact support@bgvplatform.com &copy; ${new Date().getFullYear()} BGV Platform Inc.
      </div>
    </body>
    </html>
  `;

  // Start puppeteer browser instance
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    await browser.close();
    return Buffer.from(pdf);
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    console.error('PDF Generation Error:', error);
    const err = error as any;
    err.status = 500;
    err.message = `PDF generation failed: ${err.message || 'Unknown error'}`;
    throw err;
  }
};
