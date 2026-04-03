const pdfModule = require('pdf-parse');
const fs = require('fs');
const { PDFParse } = pdfModule;

async function test() {
    try {
        const parser = new PDFParse({});
        const dummyBuffer = fs.readFileSync('test-pdf2.js'); // Use any file as buffer, it will fail parsing but we check method execution
        // Or better, creating a minimal PDF is hard in pure string without correct encoding.
        // Let's rely on what happens if we call load.

        console.log('Calling load...');
        // Mocking a buffer that looks like PDF start might prevent immediate rejection if it checks header
        const pdfHeader = Buffer.from('%PDF-1.4\n');

        try {
            await parser.load(pdfHeader);
            console.log('Load success');
        } catch (e) {
            console.log('Load error:', e.message);
            // If error is "Invalid PDF" then `load` is the correct method!
        }

    } catch (e) {
        console.log('Error:', e.message);
    }
}

test();
