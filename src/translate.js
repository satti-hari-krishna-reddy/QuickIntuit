import { detectLanguage } from "./detect-language";
const translation = {}; // Placeholder for the browser implementation

const initTranslator = async (text, targetLang) => {
    const srcLang = await detectLanguage(text);
    const languagePair = { sourceLanguage: srcLang, targetLanguage: targetLang };
    const canTranslate = await translation.canTranslate(languagePair);
    let translator;
    if (canTranslate !== 'no') {
      if (canTranslate === 'readily') {

        translator = await translation.createTranslator(languagePair);
        return { translator, status: 'Ready' };

      } else {
        return { translator, status: 'Downloading' };
      } 
    } else {
        throw new Error('Translation is not supported on this device.');
    }
    
};

 export const translateText = async (text, targetLang) => {
    const { translator, status } = await initTranslator(text, targetLang);
    if (status === 'Downloading') {
        return 'Model is currently downloading.';
    }
    const translatedText = await translator.translate(text);
    return translatedText;
}
