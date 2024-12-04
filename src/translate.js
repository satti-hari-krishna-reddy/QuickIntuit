// const initTranslator = async (srcLang, tgtLang) => {
//   const languagePair = { sourceLanguage: srcLang, targetLanguage: tgtLang };
//   // eslint-disable-next-line no-undef
//   const canTranslate = await translation.canTranslate(languagePair);
//   let translator;
//   if (canTranslate !== 'no') {
//     if (canTranslate === 'readily') {
//       // eslint-disable-next-line no-undef
//       translator = await translation.createTranslator(languagePair);
//       return { translator, status: 'Ready' };
//     } else {
//       return { translator, status: 'Downloading' };
//     }
//   } else {
//     throw new Error('Translation is not supported on this device.');
//   }
// };

const initTranslator = async (srcLang, tgtLang) => {
  const languagePair = { sourceLanguage: srcLang, targetLanguage: tgtLang };
  const translationApiAvailable = self.ai.translator;
  if (!translationApiAvailable) {
    throw new Error('Translation API is not available.');
  }
  const translator = await self.ai.translator.create(languagePair);
  return { translator, status: 'Ready' };
};

export const translateText = async (text, srcLang, tgtLang) => {
  const { translator, status } = await initTranslator(srcLang, tgtLang);
  if (status === 'Downloading') {
    return 'Model is currently downloading.';
  }
  const translatedText = await translator.translate(text);
  return translatedText;
};
