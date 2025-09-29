import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

async function processResume(file, onProgress = null) {
  try {
    if (onProgress) onProgress(10);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    if (onProgress) onProgress(70);
    const text = fullText.trim();

    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

    let name = '';
    if (lines.length > 0) {
      const firstLine = lines[0];        
      const words = firstLine.split(/\s+/);
      if (words.length >= 2) {
        name = words[0] + ' ' + words[1];
      } else {
        name = words[0];
      }
    }

    if (!name) {
      name = lines[0].trim();
      const nonNameTerms = ['resume', 'cv', 'profile', 'developer', 'engineer'];
      const firstLineWords = name.split(' ');
      const cleanNameWords = firstLineWords.filter(word => !nonNameTerms.includes(word.toLowerCase()));
      name = cleanNameWords.join(' ');
    }

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;
    const email = text.match(emailRegex) || '';
    const phone = text.match(phoneRegex) || '';

    console.log("Name:", name);
    console.log("Emails:", email.toString());
    console.log("Phone numbers:", phone.toString());

    if (onProgress) onProgress(100);

    return {
      name: name || '',
      email: email.toString() || '',
      phone: phone.toString() || '',
      content: text || '',
      success: true
    };
  } catch (error) {
    console.error(`Resume processing failed: ${error.message}`);
    return { success: false, error: `Resume processing failed: ${error.message}` };
  }
}

const pdfParsingService = { processResume };
export default pdfParsingService;