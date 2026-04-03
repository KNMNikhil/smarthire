// Test different import methods
const method1 = require('pdf-parse');
const method2 = require('pdf-parse').default;

console.log('Method 1 type:', typeof method1);
console.log('Method 2 type:', typeof method2);

// Check if it's a constructor
try {
    const instance = new method1.PDFParse();
    console.log('PDFParse instance created');
} catch (e) {
    console.log('Cannot create PDFParse instance:', e.message);
}

// The correct way based on documentation
const fs = require('fs');
const dataBuffer = fs.readFileSync('./test-pdf.js'); // Use this file as test

// Try calling it directly
if (typeof method1 === 'function') {
    method1(dataBuffer).then(data => {
        console.log('Method 1 works!');
    }).catch(e => console.log('Method 1 error:', e.message));
}
