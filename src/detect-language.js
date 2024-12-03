const initDetector = async () => {
  // eslint-disable-next-line no-undef
  const canDetect = await translation.canDetect();
  let detector;
  if (canDetect !== 'no') {
    if (canDetect === 'readily') {
      // eslint-disable-next-line no-undef
      detector = await translation.createDetector();
      return { detector, status: 'Ready' };
    } else {
      return { detector, status: 'Downloading' };
    }
  } else {
    throw new Error('Language detection is not supported on this device.');
  }
};

export const detectLanguage = async (text) => {
  const { detector, status } = await initDetector();
  if (status === 'Downloading') {
    return 'Model is currently downloading.';
  }
  console.log('Detecting language for:', text);
  const results = await detector.detect(text);
  const detectedLanguage = results[0].detectedLanguage;
  console.log('Detected language:', detectedLanguage);
  return detectedLanguage;
};
