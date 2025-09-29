import mammoth from 'mammoth';
import pdfParsingService from './pdfParsingService';

const MAX_LINES = 5;

const getTopLines = (text) => {
    return text.split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .slice(0, MAX_LINES)
        .join('\n');
};

async function processDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value.trim();

    const context = getTopLines(fullText);
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;
    const email = fullText.match(emailRegex)?.[0] || '';
    const phone = fullText.match(phoneRegex)?.[0] || '';
    
    return {
        name: '', 
        email: email,
        phone: phone,
        context: context, 
        fullText: fullText, 
        success: true,
    };
}


const fileParser = {
    parse: async (file, onProgress) => {
        if (file.type === 'application/pdf') {
            const pdfResult = await pdfParsingService.processResume(file, onProgress);
            
            if (!pdfResult.success) return pdfResult;

            const context = getTopLines(pdfResult.content);

            return {
                ...pdfResult,
                context: context, 
            };
        }
        
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return processDocx(file);
        } 
        
        return { success: false, error: 'Unsupported file type.' };
    }
};

export default fileParser;