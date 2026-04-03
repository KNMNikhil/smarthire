const fs = require('fs');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const path = require('path');
const { Student } = require('../models');

// OpenRouter Configuration
const OPEN_ROUTER_API_KEY = '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';
const AI_MODEL = 'mistralai/mistral-7b-instruct:free';

// Colors
const COLORS = {
    primary: '#2c3e50',   // Midnight Blue
    secondary: '#7f8c8d', // Grey
    accent: '#3498db',    // Blue
    text: '#2c3e50',      // Dark Grey
    divider: '#bdc3c7'    // Light Grey
};

// Icons (Simple SVG Paths - Scaled) - No Arcs
const ICONS = {
    phone: "M6.62 10.79 C8.06 13.62 10.38 15.94 13.21 17.38 L15.41 15.18 C15.69 14.9 16.08 14.82 16.43 14.93 C17.55 15.3 18.75 15.5 20 15.5 C20.55 15.5 21 15.95 21 16.5 L21 20 C21 20.55 20.55 21 20 21 C10.61 21 3 13.39 3 4 C3 3.45 3.45 3 4 3 L7.5 3 C8.05 3 8.5 3.45 8.5 4 C8.5 5.25 8.7 6.45 9.07 7.57 C9.18 7.92 9.1 8.31 8.82 8.59 L6.62 10.79 Z",
    email: "M20 4 H4 C2.9 4 2.01 4.9 2.01 6 L2 18 C2 19.1 2.9 20 4 20 H20 C21.1 20 22 19.1 22 18 V6 C22 4.9 21.1 4 20 4 Z M20 8 L12 13 L4 8 V6 L12 11 L20 6 V8 Z",
    linkedin: "M19 3 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 H19 M18.5 8.5 H15.5 V18 H18.5 V8.5 M17 7 A1 1 0 1 0 17 5 A1 1 0 1 0 17 7 M12.5 18 H9.5 V8.5 H12.5 V9.5 C13 8.5 14 8.5 14.5 9.5 V18",
    github: "M12 0.3 C5.4 0.3 0 5.7 0 12.3 C0 17.6 3.4 22.1 8.2 23.7 C8.8 23.8 9 23.4 9 23.1 C9 22.8 9 22.1 9 21.1 C5.7 21.8 5 19.5 5 19.5 C4.5 18.2 3.7 17.9 3.7 17.9 C2.6 17.1 3.8 17.2 3.8 17.2 C5 17.3 5.6 18.4 5.6 18.4 C6.7 20.2 8.4 19.7 9.1 19.4 C9.2 18.6 9.5 18.1 9.9 17.8 C7.2 17.5 4.5 16.5 4.5 11.9 C4.5 10.6 5 9.5 5.8 8.7 C5.6 8.4 5.2 7.1 5.9 5.5 C5.9 5.5 6.9 5.2 9.2 6.7 C10.2 6.4 11.2 6.3 12.2 6.3 C13.2 6.3 14.2 6.4 15.2 6.7 C17.5 5.2 18.5 5.5 18.5 5.5 C19.2 7.1 18.8 8.4 18.6 8.7 C19.4 9.5 19.9 10.6 19.9 11.9 C19.9 16.5 17.1 17.5 14.4 17.8 C14.9 18.2 15.3 19 15.3 20.2 C15.3 22 15.3 23.3 15.3 23.6 C15.3 23.9 15.5 24.3 16.1 24.2 C20.9 22.6 24.3 18.1 24.3 12.8 C24.3 6.1 18.9 0.8 12.3 0.8",
    globe: "M12 2 C6.48 2 2 6.48 2 12 C2 17.52 6.48 22 12 22 C17.52 22 22 17.52 22 12 C22 6.48 17.52 2 12 2 Z M11 19.93 C7.05 19.44 4 16.08 4 12 C4 11.38 4.08 10.79 4.21 10.21 L9 15 V16 C9 17.1 9.9 18 11 18 V19.93 Z M17.9 17.39 C17.64 16.58 16.9 16 16 16 H15 V13 C15 12.45 14.55 12 14 12 H8 V10 H10 C10.55 10 11 9.55 11 9 V7 H13 C14.1 7 15 6.1 15 5 V4.59 C17.93 5.78 20 8.65 20 12 C20 14.08 19.2 15.97 17.9 17.39 Z"
};

// Helper: AI Enhancement
const enhanceResumeData = async (rawData) => {
    const {
        personalInfo,
        education,
        skills = { technical: {} },
        experience = [],
        projects = []
    } = rawData;

    const tech = skills.technical || {};
    const skillString = `${tech.languages || ''}, ${tech.web || ''}, ${tech.tools || ''}, ${skills.soft || ''}`;

    const prompt = `
    You are an expert professional resume writer. Create a professional Summary and enhance the descriptions for the user's experience (internships) and projects to be impact-oriented.
    
    User Keywords: ${skillString}
    
    Internships:
    ${experience.map(exp => `${exp.role} at ${exp.company}: ${exp.description}`).join('\n')}
    
    Projects:
    ${projects.map(proj => `${proj.title} (${proj.stack}): ${proj.description}`).join('\n')}
    
    Output must be Valid JSON only with this structure:
    {
        "professionalSummary": "Concise professional summary (2 sentences).",
        "enhancedExperience": [
            { "role": "string", "company": "string", "enhancedDescription": ["Action-oriented bullet 1", "Action-oriented bullet 2"] }
        ],
        "enhancedProjects": [
            { "title": "string", "stack": "string", "enhancedDescription": ["Technical bullet 1", "Technical bullet 2"] }
        ]
    }
    IMPORTANT: Return ONLY raw JSON. No markdown.
    `;

    let aiData = {
        professionalSummary: `Passionate professional with expertise in ${tech.languages || 'software development'}. Dedicated to delivering high-quality solutions.`,
        enhancedExperience: (experience || []).map(e => ({ ...e, enhancedDescription: [e.description || ''] })),
        enhancedProjects: (projects || []).map(p => ({ ...p, enhancedDescription: [p.description || ''] }))
    };

    try {
        const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: AI_MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful JSON-speaking resume assistant.' },
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${OPEN_ROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const content = aiResponse.data.choices[0].message.content;
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);

        if (parsed.enhancedExperience) {
            parsed.enhancedExperience = parsed.enhancedExperience.map(e => ({
                ...e,
                enhancedDescription: Array.isArray(e.enhancedDescription) ? e.enhancedDescription : [e.enhancedDescription]
            }));
        }
        if (parsed.enhancedProjects) {
            parsed.enhancedProjects = parsed.enhancedProjects.map(p => ({
                ...p,
                enhancedDescription: Array.isArray(p.enhancedDescription) ? p.enhancedDescription : [p.enhancedDescription]
            }));
        }
        return { ...aiData, ...parsed };
    } catch (error) {
        console.error('❌ AI Enhancement Helper failed:', error.message);
        return aiData;
    }
};

// Controllers
const enhanceResume = async (req, res) => {
    try {
        console.log('✨ Enhancing resume data with AI...');
        const enhanced = await enhanceResumeData(req.body);
        res.json(enhanced);
    } catch (error) {
        console.error('❌ Enhancement endpoint error:', error);
        res.status(500).json({ message: 'Error enhancing resume', error: error.message });
    }
};

const generateResume = async (req, res) => {
    try {
        console.log('📄 Resume generation started (PDF)');
        const { personalInfo, education, enhancedData } = req.body;

        if (!personalInfo || !education) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const aiData = enhancedData || await enhanceResumeData(req.body);
        const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Resume_${personalInfo.name.replace(/\s+/g, '_')}.pdf`);
        doc.pipe(res);

        const data = { ...req.body, ...aiData };
        await renderPremiumTemplate(doc, data);

        doc.end();
        console.log('✅ PDF generated');
    } catch (error) {
        console.error('❌ Resume generation error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating resume', error: error.message });
        }
    }
};

const renderPremiumTemplate = async (doc, data) => {
    let y = 45;
    doc.font('Helvetica-Bold').fontSize(26).fillColor(COLORS.primary)
        .text(data.personalInfo.name.toUpperCase(), 0, y, { align: 'center', width: 595, letterSpacing: 1 });
    y += 35;
    doc.font('Helvetica').fontSize(11).fillColor(COLORS.secondary)
        .text('FINAL YEAR STUDENT', 0, y, { align: 'center', width: 595, letterSpacing: 3 });
    y += 25;
    doc.moveTo(40, y).lineTo(555, y).strokeColor(COLORS.primary).lineWidth(1.5).stroke();
    y += 25;

    const startY = y;
    const leftX = 40;
    const leftW = 180;
    const dividerX = 240;
    const rightX = 265;
    const rightW = 280;

    let leftY = startY;
    let rightY = startY;

    // PDF Helpers
    const printIconText = (iconPath, text, x, y, w, isLink = false) => {
        if (!text) return y;
        doc.save();
        doc.translate(x, y - 2).scale(0.5);
        doc.path(iconPath).fill(COLORS.primary);
        doc.restore();
        const indent = 18;
        doc.font('Helvetica').fontSize(10).fillColor(isLink ? COLORS.accent : COLORS.text);
        const options = { width: w - indent, align: 'left' };
        if (isLink) options.link = text;
        doc.text(text, x + indent, y, options);
        return y + doc.heightOfString(text, options) + 6;
    };

    const printText = (text, x, y, w, font = 'Helvetica', size = 10, color = COLORS.text) => {
        if (!text) return y;
        doc.font(font).fontSize(size).fillColor(color);
        doc.text(text, x, y, { width: w });
        return y + doc.heightOfString(text, { width: w }) + 3;
    };

    const printBullet = (text, x, y, w) => {
        const cleanText = String(text || '').replace(/^[•\-\*]\s*/, '').trim();
        if (!cleanText) return y;
        doc.font('Helvetica').fontSize(10).fillColor(COLORS.text);
        const bullet = '•';
        const indent = 12;
        const textH = doc.heightOfString(cleanText, { width: w - indent });
        doc.text(bullet, x, y);
        doc.text(cleanText, x + indent, y, { width: w - indent, align: 'justify' });
        return y + textH + 5;
    };

    const leftHeader = (title) => {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primary)
            .text(title.toUpperCase(), leftX, leftY, { width: leftW, letterSpacing: 1 });
        const h = doc.heightOfString(title, { width: leftW });
        doc.moveTo(leftX, leftY + h + 2).lineTo(leftX + 40, leftY + h + 2).strokeColor(COLORS.accent).lineWidth(2).stroke();
        leftY += h + 12;
    };

    const rightHeader = (title) => {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primary)
            .text(title.toUpperCase(), rightX, rightY, { width: rightW, letterSpacing: 1 });
        const h = doc.heightOfString(title, { width: rightW });
        doc.moveTo(rightX, rightY + h + 2).lineTo(rightX + 40, rightY + h + 2).strokeColor(COLORS.accent).lineWidth(2).stroke();
        rightY += h + 10;
    };

    // Render Logic
    leftHeader('CONTACT');
    leftY = printIconText(ICONS.phone, data.personalInfo.phone, leftX, leftY, leftW);
    leftY = printIconText(ICONS.email, data.personalInfo.email, leftX, leftY, leftW);
    if (data.personalInfo.linkedin) leftY = printIconText(ICONS.linkedin, data.personalInfo.linkedin, leftX, leftY, leftW, true);
    if (data.personalInfo.github) leftY = printIconText(ICONS.github, data.personalInfo.github, leftX, leftY, leftW, true);
    if (data.personalInfo.portfolio) leftY = printIconText(ICONS.globe, data.personalInfo.portfolio, leftX, leftY, leftW, true);
    leftY += 20;

    leftHeader('EDUCATION');
    leftY = printText('B.E. COMPUTER SCIENCE', leftX, leftY, leftW, 'Helvetica-Bold', 10);
    leftY = printText(data.education.college.name, leftX, leftY, leftW, 'Helvetica', 10);
    if (data.education.college.year) leftY = printText(data.education.college.year, leftX, leftY, leftW, 'Helvetica', 10, COLORS.secondary);
    leftY += 12;
    if (data.education.grade12.school) {
        leftY = printText('12TH STANDARD', leftX, leftY, leftW, 'Helvetica-Bold', 10);
        leftY = printText(data.education.grade12.school, leftX, leftY, leftW, 'Helvetica', 10);
        leftY = printText(data.education.grade12.year, leftX, leftY, leftW, 'Helvetica', 10, COLORS.secondary);
        leftY += 12;
    }
    if (data.education.grade10.school) {
        leftY = printText('10TH STANDARD', leftX, leftY, leftW, 'Helvetica-Bold', 10);
        leftY = printText(data.education.grade10.school, leftX, leftY, leftW, 'Helvetica', 10);
        leftY = printText(data.education.grade10.year, leftX, leftY, leftW, 'Helvetica', 10, COLORS.secondary);
    }
    leftY += 20;

    if (data.skills.soft) {
        leftHeader('SKILLS');
        data.skills.soft.split(/[,|\n]/).map(s => s.trim()).filter(Boolean).forEach(s => { leftY = printBullet(s, leftX, leftY, leftW); });
        leftY += 15;
    }
    if (data.spokenLanguages) {
        leftHeader('LANGUAGES');
        data.spokenLanguages.split(/[,|\n]/).map(s => s.trim()).filter(Boolean).forEach(l => { leftY = printBullet(l, leftX, leftY, leftW); });
    }

    if (data.professionalSummary) {
        rightHeader('PROFILE SUMMARY');
        rightY = printText(data.professionalSummary, rightX, rightY, rightW, 'Helvetica', 10, COLORS.text);
        rightY += 10;
    }
    if (data.enhancedProjects.length) {
        rightHeader('PROJECTS');
        data.enhancedProjects.forEach(proj => {
            const title = proj.title.trim();
            const stack = proj.stack ? ` (${proj.stack})` : '';
            doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primary).text(title, rightX, rightY, { width: rightW });
            rightY += doc.heightOfString(title, { width: rightW }) + 2;
            if (stack) {
                doc.font('Helvetica-Oblique').fontSize(10).fillColor(COLORS.secondary).text(stack, rightX, rightY, { width: rightW });
                rightY += doc.heightOfString(stack, { width: rightW }) + 4;
            }
            proj.enhancedDescription.forEach(d => { rightY = printBullet(d, rightX, rightY, rightW); });
            rightY += 8;
        });
        rightY += 5;
    }
    if (data.enhancedExperience.length) {
        rightHeader('INTERNSHIP');
        data.enhancedExperience.forEach(exp => {
            rightY = printText(exp.role.toUpperCase(), rightX, rightY, rightW, 'Helvetica-Bold', 11, COLORS.primary);
            rightY = printText(exp.company, rightX, rightY, rightW, 'Helvetica-Bold', 10, COLORS.text);
            exp.enhancedDescription.forEach(d => { rightY = printBullet(d, rightX, rightY, rightW); });
            rightY += 8;
        });
        rightY += 5;
    }
    if (data.certifications) {
        rightHeader('CERTIFICATIONS');
        data.certifications.split(/\n|,/).map(c => c.trim()).filter(Boolean).forEach(c => { rightY = printBullet(c, rightX, rightY, rightW); });
        rightY += 10;
    }

    rightHeader('TECHNICAL SKILLS');
    const tech = data.skills.technical;
    const cats = [
        { name: 'Programming Languages', val: tech.languages },
        { name: 'Web Technologies', val: tech.web },
        { name: 'Tools & Platforms', val: tech.tools },
        { name: 'Others', val: tech.database }
    ];
    cats.forEach(c => {
        if (c.val) {
            doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.primary).text(`• ${c.name} - `, rightX, rightY, { width: rightW, continued: true });
            doc.font('Helvetica').fillColor(COLORS.text).text(c.val);
            rightY += doc.heightOfString(`• ${c.name} - ${c.val}`, { width: rightW }) + 4;
        }
    });

    const maxY = Math.max(leftY, rightY, 750);
    doc.moveTo(dividerX, startY).lineTo(dividerX, maxY).strokeColor(COLORS.divider).lineWidth(1).stroke();
};

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } = require('docx');

const generateWordResume = async (req, res) => {
    try {
        console.log('📄 Word Resume generation started');
        const { personalInfo, enhancedData } = req.body;
        const aiData = enhancedData || await enhanceResumeData(req.body);
        const data = { ...req.body, ...aiData };

        const doc = new Document({
            styles: {
                paragraphStyles: [
                    { id: 'Normal', name: 'Normal', run: { font: 'Helvetica', size: 20, color: '2C3E50' }, paragraph: { spacing: { line: 240 } } },
                    {
                        id: 'SectionHeader',
                        name: 'Section Header',
                        run: { font: 'Helvetica', bold: true, size: 24, color: '2C3E50', allCaps: true },
                        paragraph: { spacing: { before: 200, after: 100 }, border: { bottom: { color: '3498DB', space: 1, style: 'single', size: 12 } } }
                    }
                ]
            },
            sections: [{
                properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
                children: [
                    new Paragraph({ text: data.personalInfo.name.toUpperCase(), heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 100 }, run: { font: 'Helvetica', bold: true, size: 52, color: '2C3E50' } }),
                    new Paragraph({ text: 'FINAL YEAR STUDENT', alignment: AlignmentType.CENTER, spacing: { after: 200 }, run: { font: 'Helvetica', size: 22, color: '7F8C8D', allCaps: true, tracking: 60 } }),
                    new Paragraph({ border: { bottom: { color: '2C3E50', style: 'single', size: 24 } }, spacing: { after: 400 } }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.SINGLE, color: 'BDC3C7' } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 35, type: WidthType.PERCENTAGE },
                                        margins: { right: 200 },
                                        children: [
                                            new Paragraph({ text: 'CONTACT', style: 'SectionHeader' }),
                                            createContactLine(data.personalInfo.phone, '📞'),
                                            createContactLine(data.personalInfo.email, '✉️'),
                                            createContactLine(data.personalInfo.linkedin, '🔗', true),
                                            createContactLine(data.personalInfo.github, '💻', true),
                                            createContactLine(data.personalInfo.portfolio, '🌐', true),
                                            new Paragraph({ text: 'EDUCATION', style: 'SectionHeader' }),
                                            ...createEduBlock('B.E. COMPUTER SCIENCE', data.education.college.name, data.education.college.year),
                                            ...(data.education.grade12.school ? createEduBlock('12TH STANDARD', data.education.grade12.school, data.education.grade12.year) : []),
                                            ...(data.education.grade10.school ? createEduBlock('10TH STANDARD', data.education.grade10.school, data.education.grade10.year) : []),
                                            ...(data.skills.soft ? [
                                                new Paragraph({ text: 'SKILLS', style: 'SectionHeader' }),
                                                ...data.skills.soft.split(/[,|\n]/).map(s => s.trim()).filter(Boolean).map(s => createBullet(s))
                                            ] : []),
                                            ...(data.spokenLanguages ? [
                                                new Paragraph({ text: 'LANGUAGES', style: 'SectionHeader' }),
                                                ...data.spokenLanguages.split(/[,|\n]/).map(s => s.trim()).filter(Boolean).map(s => createBullet(s))
                                            ] : [])
                                        ]
                                    }),
                                    new TableCell({
                                        width: { size: 65, type: WidthType.PERCENTAGE },
                                        margins: { left: 200 },
                                        children: [
                                            ...(data.professionalSummary ? [new Paragraph({ text: 'PROFILE SUMMARY', style: 'SectionHeader' }), new Paragraph({ text: data.professionalSummary })] : []),
                                            ...(data.enhancedProjects.length ? [
                                                new Paragraph({ text: 'PROJECTS', style: 'SectionHeader' }),
                                                ...data.enhancedProjects.flatMap(p => [
                                                    new Paragraph({ children: [new TextRun({ text: p.title, bold: true, color: '2C3E50', size: 22 })] }),
                                                    ...(p.stack ? [new Paragraph({ children: [new TextRun({ text: `Tech Stack: ${p.stack}`, italics: true, color: '7F8C8D', size: 20 })], spacing: { before: 50, after: 100 } })] : []),
                                                    ...p.enhancedDescription.map(d => createBullet(d))
                                                ])
                                            ] : []),
                                            ...(data.enhancedExperience.length ? [
                                                new Paragraph({ text: 'INTERNSHIP', style: 'SectionHeader' }),
                                                ...data.enhancedExperience.flatMap(e => [
                                                    new Paragraph({ text: e.role.toUpperCase(), heading: HeadingLevel.HEADING_4, run: { bold: true, size: 22, color: '2C3E50' } }),
                                                    new Paragraph({ text: e.company, run: { bold: true, size: 20 } }),
                                                    ...e.enhancedDescription.map(d => createBullet(d))
                                                ])
                                            ] : []),
                                            ...(data.certifications ? [new Paragraph({ text: 'CERTIFICATIONS', style: 'SectionHeader' }), ...data.certifications.split(/[,|\n]/).filter(Boolean).map(c => createBullet(c.trim()))] : []),
                                            new Paragraph({ text: 'TECHNICAL SKILLS', style: 'SectionHeader' }),
                                            createTechLine('Programming Languages', data.skills.technical.languages),
                                            createTechLine('Web Technologies', data.skills.technical.web),
                                            createTechLine('Tools & Platforms', data.skills.technical.tools),
                                            createTechLine('Others', data.skills.technical.database)
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=Resume_${personalInfo.name.replace(/\s+/g, '_')}.docx`);
        res.send(buffer);
        console.log('✅ Word Resume generated');
    } catch (error) {
        console.error('❌ Word generation error:', error);
        res.status(500).json({ message: 'Error generating word resume', error: error.message });
    }
};

// Word Helpers
const createBullet = (text) => {
    const cleanText = String(text || '').replace(/^[•\-\*]\s*/, '').trim();
    if (!cleanText) return new Paragraph({ text: '' });
    return new Paragraph({ text: cleanText, bullet: { level: 0 } });
};

const createContactLine = (text, icon = '', isLink = false) => {
    if (!text) return new Paragraph({});
    return new Paragraph({
        children: [
            ...(icon ? [new TextRun({ text: `${icon}  `, size: 20, font: 'Segoe UI Symbol' })] : []),
            new TextRun({ text: text, color: isLink ? '3498DB' : '2C3E50', size: 20 })
        ],
        indent: { left: 200 }
    });
};

const createEduBlock = (degree, school, year) => [
    new Paragraph({ text: degree, run: { bold: true, size: 20 } }),
    new Paragraph({ text: school, run: { size: 20 } }),
    new Paragraph({ text: year, run: { color: '7F8C8D', size: 20 }, spacing: { after: 100 } })
];

const createTechLine = (label, value) => {
    if (!value) return new Paragraph({});
    return new Paragraph({
        children: [
            new TextRun({ text: `• ${label} - `, bold: true, color: '2C3E50', size: 20 }),
            new TextRun({ text: value, color: '2C3E50', size: 20 })
        ]
    });
};

module.exports = {
    enhanceResume,
    generateResume,
    generateWordResume
};
