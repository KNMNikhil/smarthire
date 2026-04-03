const fs = require('fs');
const pdfModule = require('pdf-parse');
const { PDFParse, VerbosityLevel } = pdfModule;

console.log('VerbosityLevel:', VerbosityLevel);

const optionsVariants = [
    undefined,
    {},
    { verbosity: 0 },
    { verbosity: VerbosityLevel ? VerbosityLevel.ERRORS : 0 },
    { version: 'v2.0.550' } // sometimes fake version helps if it checks it
];

for (const opts of optionsVariants) {
    console.log('Trying options:', JSON.stringify(opts));
    try {
        const parser = new PDFParse(opts);
        console.log('SUCCESS! Parser created with options:', JSON.stringify(opts));
        console.log('Is parse a function?', typeof parser.parse === 'function');

        // Try parsing dummy buffer
        // PDF signature %PDF-1.4
        const dummyBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

        // parser.parse() might return a promise
        // We can't await in top level loop easily without async wrapper or node 14+ top level await (node 22 is used, so it should work if module type, but this is CJS file)
        // Let's just create instance for now.
        break;
    } catch (e) {
        console.log('FAILED:', e.message);
    }
}
