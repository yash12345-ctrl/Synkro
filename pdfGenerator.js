const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateSubmissionSlip(data, outStream) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: `Synkro Consultation Slip - ${data.name || 'Client'}`,
      Author: 'Synkro Technologies Inc.',
      Subject: 'Official Consultation Intake & Engineering Dispatch Slip',
      Keywords: 'Synkro, Consultation, Software Architecture, Intake, Verification'
    }
  });

  doc.pipe(outStream);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2; // 515.28

  // Register DejaVu fonts for full Unicode support (including ₹ Rupee symbol)
  const fontRegularPath = path.join(__dirname, 'fonts/DejaVuSans.ttf');
  const fontBoldPath = path.join(__dirname, 'fonts/DejaVuSans-Bold.ttf');
  const hasCustomFont = fs.existsSync(fontRegularPath) && fs.existsSync(fontBoldPath);

  let fontRegular = 'Helvetica';
  let fontBold = 'Helvetica-Bold';

  if (hasCustomFont) {
    try {
      doc.registerFont('DejaVuSans', fontRegularPath);
      doc.registerFont('DejaVuSans-Bold', fontBoldPath);
      fontRegular = 'DejaVuSans';
      fontBold = 'DejaVuSans-Bold';
    } catch (err) {
      console.error('Error loading DejaVu font:', err);
    }
  }

  // Color Palette
  const cDark = '#090d16';
  const cPrimary = '#0f172a'; // slate-900
  const cSecondary = '#334155'; // slate-700
  const cMuted = '#64748b'; // slate-500
  const cLight = '#94a3b8'; // slate-400
  const cBorder = '#e2e8f0'; // slate-200
  const cBorderStrong = '#cbd5e1';
  const cCardBg = '#f8fafc'; // slate-50
  const cCardBgAlt = '#f1f5f9';
  const cAccent = '#4f46e5'; // indigo-600
  const cAccentDark = '#3730a3'; // indigo-800
  const cAccentLight = '#e0e7ff'; // indigo-100
  const cViolet = '#7c3aed';
  const cCyan = '#0ea5e9';
  const cSuccess = '#059669'; // emerald-600
  const cSuccessBg = '#ecfdf5'; // emerald-50
  const cSuccessBorder = '#a7f3d0';

  // 1. Top Decorative Brand Bar
  doc.rect(0, 0, pageWidth * 0.40, 5).fill(cAccent);
  doc.rect(pageWidth * 0.40, 0, pageWidth * 0.35, 5).fill(cViolet);
  doc.rect(pageWidth * 0.75, 0, pageWidth * 0.25, 5).fill(cCyan);

  // 2. Header Section
  let curY = 32;

  // Synkro Logo
  const logoPath = path.join(__dirname, 'public/images/gggg.jpg');
  const hasLogo = fs.existsSync(logoPath);

  if (hasLogo) {
    try {
      doc.roundedRect(marginX, curY, 46, 46, 8).fillAndStroke('#ffffff', cBorder);
      doc.save();
      doc.roundedRect(marginX + 2, curY + 2, 42, 42, 6).clip();
      doc.image(logoPath, marginX + 2, curY + 2, { width: 42, height: 42 });
      doc.restore();
    } catch (e) {
      console.error('Logo render error:', e);
    }
  }

  const brandTextX = hasLogo ? marginX + 56 : marginX;

  doc.font(fontBold).fontSize(19).fillColor(cDark).text('SYNKRO', brandTextX, curY + 2);
  doc.font(fontBold).fontSize(7.5).fillColor(cAccent).text('ENGINEERING DISCOVERY & ARCHITECTURE', brandTextX, curY + 23, {
    characterSpacing: 0.8
  });
  doc.font(fontRegular).fontSize(7.5).fillColor(cMuted).text('Enterprise Digital Systems • Cloud & Product Strategy', brandTextX, curY + 34);

  // Right-aligned header details
  const rawSeed = (data.name || 'CLIENT') + (data.platform || 'WEB') + (data.budget || '500');
  let hashVal = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hashVal = ((hashVal << 5) - hashVal) + rawSeed.charCodeAt(i);
    hashVal |= 0;
  }
  const refCode = `SYN-${new Date().getFullYear()}-${Math.abs(hashVal).toString(36).toUpperCase().padStart(5, '0').slice(0, 5)}`;
  
  const todayStr = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Status Badge Pill
  const badgeW = 126;
  const badgeH = 20;
  const badgeX = pageWidth - marginX - badgeW;
  doc.roundedRect(badgeX, curY, badgeW, badgeH, 10).fillAndStroke(cSuccessBg, cSuccessBorder);
  
  // Little green dot inside pill
  doc.circle(badgeX + 12, curY + 10, 3).fill(cSuccess);
  doc.font(fontBold).fontSize(7.5).fillColor(cSuccess).text('VERIFIED INTAKE', badgeX + 18, curY + 6, {
    width: badgeW - 22,
    align: 'center'
  });

  doc.font(fontBold).fontSize(8.5).fillColor(cPrimary).text(`REF: ${refCode}`, badgeX - 80, curY + 24, {
    width: badgeW + 80,
    align: 'right'
  });
  doc.font(fontRegular).fontSize(7.5).fillColor(cMuted).text(`Issued: ${todayStr} • ${timeStr}`, badgeX - 80, curY + 36, {
    width: badgeW + 80,
    align: 'right'
  });

  curY = 90;
  // Hairline divider
  doc.moveTo(marginX, curY).lineTo(pageWidth - marginX, curY).lineWidth(0.75).stroke(cBorder);

  // 3. Hero Intake Confirmation Card
  curY = 102;
  const heroH = 64;
  doc.roundedRect(marginX, curY, contentWidth, heroH, 8).fillAndStroke(cCardBg, cBorder);
  // Left color accent stripe
  doc.roundedRect(marginX, curY, 4.5, heroH, 2).fill(cAccent);

  doc.font(fontBold).fontSize(12).fillColor(cPrimary).text('Official Consultation Slip', marginX + 16, curY + 12);
  doc.font(fontRegular).fontSize(8.5).fillColor(cSecondary).text(
    `Thank you, ${data.name || 'Valued Client'}. Your submission has been securely registered and dispatched into the Synkro Engineering Queue. Our lead architects have received your requirements and are preparing your session agenda.`,
    marginX + 16,
    curY + 28,
    { width: contentWidth - 32, lineGap: 3 }
  );

  // 4. Client & Project Specifications Bento Grid (2x2)
  curY = 180;
  const gridGap = 12;
  const cardW = (contentWidth - gridGap) / 2;
  const cardH = 54;
  const col2X = marginX + cardW + gridGap;

  // Format budget safely
  let rawBudgetDigits = String(data.budget || '').replace(/[^0-9]/g, '');
  let formattedBudget = 'Custom Discussion';
  if (rawBudgetDigits) {
    const formattedNum = Number(rawBudgetDigits).toLocaleString('en-IN');
    formattedBudget = hasCustomFont ? `₹ ${formattedNum}` : `INR ${formattedNum}`;
  } else if (data.budget) {
    formattedBudget = `${data.budget}`;
  }

  // Row 1 - Card 1: Client Name
  doc.roundedRect(marginX, curY, cardW, cardH, 6).fillAndStroke(cCardBg, cBorder);
  doc.font(fontBold).fontSize(7.5).fillColor(cMuted).text('CLIENT NAME', marginX + 14, curY + 10, { characterSpacing: 0.5 });
  doc.font(fontBold).fontSize(12).fillColor(cPrimary).text(data.name || 'Not Specified', marginX + 14, curY + 25, { width: cardW - 28, ellipsis: true });

  // Row 1 - Card 2: Preferred Platform
  doc.roundedRect(col2X, curY, cardW, cardH, 6).fillAndStroke(cCardBg, cBorder);
  doc.font(fontBold).fontSize(7.5).fillColor(cMuted).text('PREFERRED PLATFORM', col2X + 14, curY + 10, { characterSpacing: 0.5 });
  const platText = data.platform || 'Online Video Meeting';
  doc.font(fontBold).fontSize(12).fillColor(cAccent).text(platText, col2X + 14, curY + 25, { width: cardW - 28, ellipsis: true });

  // Row 2 - Card 3: Estimated Budget
  const row2Y = curY + cardH + 12;
  doc.roundedRect(marginX, row2Y, cardW, cardH, 6).fillAndStroke(cCardBg, cBorder);
  doc.font(fontBold).fontSize(7.5).fillColor(cMuted).text('ESTIMATED BUDGET', marginX + 14, row2Y + 10, { characterSpacing: 0.5 });
  doc.font(fontBold).fontSize(12).fillColor(cSuccess).text(formattedBudget, marginX + 14, row2Y + 25, { width: cardW - 28, ellipsis: true });

  // Row 2 - Card 4: Dispatch Status
  doc.roundedRect(col2X, row2Y, cardW, cardH, 6).fillAndStroke(cCardBg, cBorder);
  doc.font(fontBold).fontSize(7.5).fillColor(cMuted).text('DISPATCH & QUEUE STATUS', col2X + 14, row2Y + 10, { characterSpacing: 0.5 });
  doc.font(fontBold).fontSize(11).fillColor(cViolet).text('Assigned to Lead Architect', col2X + 14, row2Y + 26, { width: cardW - 28, ellipsis: true });

  // 5. Submitted Project Scope & Vision Card
  curY = row2Y + cardH + 16;
  const ideaH = 100;
  doc.roundedRect(marginX, curY, contentWidth, ideaH, 6).fillAndStroke(cCardBg, cBorder);

  // Tab Header strip
  doc.roundedRect(marginX, curY, contentWidth, 24, 6).fill(cCardBgAlt);
  doc.rect(marginX, curY + 18, contentWidth, 6).fill(cCardBgAlt);
  doc.moveTo(marginX, curY + 24).lineTo(marginX + contentWidth, curY + 24).lineWidth(0.75).stroke(cBorder);

  doc.font(fontBold).fontSize(8).fillColor(cSecondary).text('PROJECT VISION & SCOPE SUMMARY', marginX + 14, curY + 8, {
    characterSpacing: 0.5
  });

  const rawIdea = (data.idea && data.idea.trim() !== '' && data.idea.trim().toUpperCase() !== 'NA')
    ? data.idea.trim()
    : 'Preliminary architecture discovery requested. The client will discuss full business requirements, system capabilities, integrations, and milestone timelines directly with the lead architect during the kickoff call.';

  doc.font(fontRegular).fontSize(9).fillColor(cPrimary).text(rawIdea, marginX + 14, curY + 34, {
    width: contentWidth - 28,
    height: 56,
    ellipsis: true,
    lineGap: 3.5
  });

  // 6. Consultation Protocol / Next Steps (3 Step Bento)
  curY = curY + ideaH + 18;
  doc.font(fontBold).fontSize(8.5).fillColor(cMuted).text('CONSULTATION PROTOCOL & TIMELINE', marginX, curY, {
    characterSpacing: 0.6
  });

  curY += 14;
  const stepGap = 12;
  const stepW = (contentWidth - stepGap * 2) / 3;
  const stepH = 82;

  const steps = [
    {
      num: '01',
      title: 'Architect Review',
      desc: 'Senior engineering architects review project requirements and formulate preliminary technical scoping.'
    },
    {
      num: '02',
      title: 'Meeting Invite',
      desc: `Direct calendar invitation with verified ${data.platform || 'video'} link dispatched to your inbox within 24 hours.`
    },
    {
      num: '03',
      title: 'Discovery Call',
      desc: 'Collaborative strategy session to finalize architecture blueprints, stack selection, and milestone roadmap.'
    }
  ];

  steps.forEach((step, idx) => {
    const sX = marginX + idx * (stepW + stepGap);
    doc.roundedRect(sX, curY, stepW, stepH, 6).fillAndStroke(cCardBg, cBorder);

    // Number tag pill
    doc.roundedRect(sX + 10, curY + 10, 22, 15, 3).fill(cAccentLight);
    doc.font(fontBold).fontSize(8).fillColor(cAccent).text(step.num, sX + 10, curY + 13.5, {
      width: 22,
      align: 'center'
    });

    // Step Title
    doc.font(fontBold).fontSize(9.5).fillColor(cPrimary).text(step.title, sX + 38, curY + 12.5, {
      width: stepW - 46,
      ellipsis: true
    });

    // Step Description
    doc.font(fontRegular).fontSize(7.5).fillColor(cSecondary).text(step.desc, sX + 10, curY + 32, {
      width: stepW - 20,
      lineGap: 2.2
    });
  });

  // 7. Official Verification Seal & Directorate Authorization
  curY = curY + stepH + 18;
  const authH = 84;
  doc.roundedRect(marginX, curY, contentWidth, authH, 6).fillAndStroke('#ffffff', cBorder);

  // Verification Seal Graphic (Left)
  const sealCenterX = marginX + 42;
  const sealCenterY = curY + 42;

  // Outer dashed circle
  doc.save();
  doc.circle(sealCenterX, sealCenterY, 28).lineWidth(1.2).dash(3, { space: 2 }).stroke(cAccent);
  doc.restore();

  // Inner solid ring
  doc.circle(sealCenterX, sealCenterY, 23).lineWidth(0.6).stroke(cBorderStrong);
  doc.circle(sealCenterX, sealCenterY, 21).fill('#f8fafc');

  // Text inside stamp
  doc.font(fontBold).fontSize(6).fillColor(cAccent).text('SYNKRO', sealCenterX - 20, sealCenterY - 14, { width: 40, align: 'center' });
  doc.font(fontBold).fontSize(7.5).fillColor(cDark).text('VERIFIED', sealCenterX - 20, sealCenterY - 4, { width: 40, align: 'center' });
  doc.font(fontBold).fontSize(5.5).fillColor(cMuted).text('OFFICIAL', sealCenterX - 20, sealCenterY + 6, { width: 40, align: 'center' });

  // Verification Details Text
  const detailsX = marginX + 80;
  doc.font(fontBold).fontSize(8.5).fillColor(cPrimary).text('AUTHENTIC CONSULTATION INTAKE', detailsX, curY + 14);
  doc.font(fontRegular).fontSize(7.5).fillColor(cMuted).text(
    'This slip certifies that client parameters have been validated and committed to the Synkro Systems core dispatch queue.',
    detailsX,
    curY + 27,
    { width: 220, lineGap: 2 }
  );

  const secHash = `SEC-HASH: ${Buffer.from(`${data.name || 'ANON'}-${data.platform || 'WEB'}-${refCode}`).toString('hex').slice(0, 18).toUpperCase()}`;
  doc.font(fontBold).fontSize(6.5).fillColor(cAccent).text(secHash, detailsX, curY + 58);

  // Directorate Sign-off (Right)
  const signBoxW = 160;
  const signX = pageWidth - marginX - signBoxW - 14;
  
  // Simulated cursive signature curve
  doc.save();
  doc.lineWidth(1.4).strokeColor(cAccentDark);
  doc.moveTo(signX + 6, curY + 38)
     .bezierCurveTo(signX + 26, curY + 22, signX + 42, curY + 44, signX + 66, curY + 28)
     .bezierCurveTo(signX + 82, curY + 18, signX + 94, curY + 40, signX + 122, curY + 26)
     .bezierCurveTo(signX + 132, curY + 22, signX + 142, curY + 35, signX + 152, curY + 32)
     .stroke();
  doc.restore();

  // Signature rule line
  doc.moveTo(signX, curY + 46).lineTo(signX + signBoxW, curY + 46).lineWidth(0.75).stroke(cBorderStrong);

  doc.font(fontBold).fontSize(7.5).fillColor(cPrimary).text('AUTHORIZED SIGNATURE', signX, curY + 51);
  doc.font(fontRegular).fontSize(6.8).fillColor(cMuted).text('Synkro Directorate • Solutions Architect', signX, curY + 62);

  // 8. Meeting Preparation Note
  curY = curY + authH + 14;
  const noteH = 40;
  doc.roundedRect(marginX, curY, contentWidth, noteH, 5).fillAndStroke('#eff6ff', '#bfdbfe');
  
  doc.font(fontBold).fontSize(7.5).fillColor('#1e40af').text('PREPARATION NOTE FOR SESSION:', marginX + 14, curY + 8);
  doc.font(fontRegular).fontSize(7.5).fillColor('#1e3a8a').text(
    `Please ensure your ${data.platform || 'video'} audio/camera permissions are active 5 minutes prior to the call. If you have existing diagrams, repositories, or requirement documents, feel free to present them during the discovery session.`,
    marginX + 14,
    curY + 20,
    { width: contentWidth - 28, lineGap: 2 }
  );

  // 9. Document Footer
  const footerY = pageHeight - 48;
  doc.moveTo(marginX, footerY).lineTo(pageWidth - marginX, footerY).lineWidth(0.5).stroke(cBorder);

  doc.font(fontBold).fontSize(7.5).fillColor(cPrimary).text('SYNKRO TECHNOLOGIES', marginX, footerY + 8);
  doc.font(fontRegular).fontSize(7).fillColor(cMuted).text('Scalable Web Architecture & Engineering Systems', marginX, footerY + 18);

  doc.font(fontRegular).fontSize(7).fillColor(cMuted).text('www.synkro.tech  •  dispatch@synkro.tech', marginX + 165, footerY + 13, {
    width: 185,
    align: 'center'
  });

  doc.font(fontRegular).fontSize(7).fillColor(cLight).text('Page 1 of 1  •  Strictly Confidential', pageWidth - marginX - 150, footerY + 13, {
    width: 150,
    align: 'right'
  });

  // Bottom brand accent strip
  doc.rect(0, pageHeight - 3, pageWidth * 0.40, 3).fill(cAccent);
  doc.rect(pageWidth * 0.40, pageHeight - 3, pageWidth * 0.35, 3).fill(cViolet);
  doc.rect(pageWidth * 0.75, pageHeight - 3, pageWidth * 0.25, 3).fill(cCyan);

  doc.end();
}

module.exports = { generateSubmissionSlip };
