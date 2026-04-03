const pdfModule = require('pdf-parse');
const { PDFParse } = pdfModule;

try {
    const parser = new PDFParse({});
    console.log('Parser instance keys:', Object.keys(parser));
    console.log('Parser prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));

    // Check if there is any method that looks like parse
    const proto = Object.getPrototypeOf(parser);
    const methods = Object.getOwnPropertyNames(proto).filter(k => typeof parser[k] === 'function');
    console.log('Methods on prototype:', methods);

} catch (e) {
    console.log('Error:', e.message);
}
