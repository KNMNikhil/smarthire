const fs = require('fs');
// Mock a simple PDF buffer (this won't work for real parsing but might check import structure)
// Better yet, just check the exports of the module.
const pdfModule = require('pdf-parse');

console.log('--- generic require output ---');
console.log('Type of module:', typeof pdfModule);
console.log('Keys:', Object.keys(pdfModule));

try {
    console.log('Is it a function?', typeof pdfModule === 'function');
} catch (e) { console.log(e.message); }

try {
    const { PDFParse } = pdfModule;
    console.log('PDFParse export type:', typeof PDFParse);
} catch (e) { console.log(e.message); }

// If it's version 1.1.1 compliant, it should be a function.
// If it's the newer version the user seems to have, it might be different.
