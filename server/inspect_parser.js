const fs = require('fs');
const pdfModule = require('pdf-parse');
const { PDFParse } = pdfModule;

try {
    const parser = new PDFParse();
    console.log('Parser instance created.');
    console.log('Parser properties:', Object.keys(parser));
    console.log('Is parse a function?', typeof parser.parse === 'function');
    console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
} catch (e) {
    console.log('Error creating parser:', e.message);
}
