const translation = {}; // Placeholder for the browser implementation

const initDetector = async () => {
    const canDetect = await translation.canDetect();
    let detector;
    if (canDetect !== 'no') {
        if (canDetect === 'readily') {
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
        return 'Model is currently downloading.'
    }
    const results = await detector.detect(text);
    const detectedLanguage = results[0].detectedLanguage;
    return detectedLanguage;
};
