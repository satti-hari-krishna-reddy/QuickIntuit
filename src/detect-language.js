// const initDetector = async () => {
//   // eslint-disable-next-line no-undef
//   const canDetect = await translation.canDetect();
//   let detector;
//   if (canDetect !== 'no') {
//     if (canDetect === 'readily') {
//       // eslint-disable-next-line no-undef
//       detector = await translation.createDetector();
//       return { detector, status: 'Ready' };
//     } else {
//       return { detector, status: 'Downloading' };
//     }
//   } else {
//     throw new Error('Language detection is not supported on this device.');
//   }
// };

const initDetector = async () => {
  const langDetectorApiAvailable = self.ai.languageDetector;
  if (!langDetectorApiAvailable) {
    throw new Error('language detection API is not available.');
  }
  const capabilities = await ai.languageDetector.capabilities();
  if (!capabilities || capabilities.available === 'no') {
    throw new Error('language detection is not supported on this device.');
  }
  const detector = await self.ai.languageDetector.create();
  if (capabilities.available === 'after-download') {
    return { detector, status: 'Downloading' };
  }
  return { detector, status: 'Ready' };
};

export const detectLanguage = async (text) => {
  const { detector, status } = await initDetector();
  if (status === 'Downloading') {
    return 'Model is currently downloading.';
  }
  const results = await detector.detect(text);
  const detectedLanguage = results[0].detectedLanguage;
  return detectedLanguage;
};
