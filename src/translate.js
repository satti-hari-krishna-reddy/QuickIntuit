const initTranslator = async (srcLang, tgtLang ) => {
    const languagePair = { sourceLanguage: srcLang, targetLanguage: tgtLang };
    // eslint-disable-next-line no-undef
    const canTranslate = await translation.canTranslate(languagePair);
    let translator;
    if (canTranslate !== 'no') {
      if (canTranslate === 'readily') {
        // eslint-disable-next-line no-undef
        translator = await translation.createTranslator(languagePair);
        return { translator, status: 'Ready' };

      } else {
        return { translator, status: 'Downloading' };
      } 
    } else {
        throw new Error('Translation is not supported on this device.');
    }
    
};

 export const translateText = async (text, srcLang, tgtLang) => {
  console.log(" here is the source language", srcLang, "and here is the target language", tgtLang);
    const { translator, status } = await initTranslator(srcLang, tgtLang);
    if (status === 'Downloading') {
        return 'Model is currently downloading.';
    }
    const translatedText = await translator.translate(text);
    console.log('Translated text:', translatedText);
    return translatedText;
}
